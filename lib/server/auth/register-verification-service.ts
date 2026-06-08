import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";

import type { ApiError } from "@/lib/contracts/api/api-error";

import { writeAuthAuditLog } from "@/lib/server/auth/auth-utils";

import { applySessionCookie } from "@/lib/server/auth/cookies";

import { mapUserToAuthDTO } from "@/lib/server/auth/map-user";

import { createPilotAccount } from "@/lib/server/auth/pilot-account";
import {
  recordRegistrationConsents,
  type StoredRegistrationConsents,
} from "@/lib/server/auth/record-registration-consents";

import {

  generateRecoveryCode,

  hashRecoveryCode,

} from "@/lib/server/auth/signed-token";

import { createSession } from "@/lib/server/auth/session-service";

import { getSessionTtlSeconds } from "@/lib/server/auth/session-token";

import { sendVerificationCodeEmail } from "@/lib/server/email/send-verification-code-email";

import { prisma } from "@/lib/server/prisma";

import { NextResponse } from "next/server";

import { jsonSuccess } from "@/lib/server/api/responses";



export const VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000;

export const VERIFICATION_CODE_TTL_MINUTES = 15;



function validationError(message: string): ApiError {

  return {

    code: API_ERROR_CODES.VALIDATION_ERROR,

    message,

    httpStatus: 400,

  };

}



function conflictError(message: string): ApiError {

  return {

    code: API_ERROR_CODES.CONFLICT,

    message,

    httpStatus: 409,

  };

}



function parseCategoryIds(value: unknown): string[] {

  if (!Array.isArray(value)) return [];

  return value.filter((item): item is string => typeof item === "string");

}

function parseRegistrationConsents(
  value: unknown,
): StoredRegistrationConsents | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const o = value as Record<string, unknown>;
  const versions = o.versions;
  if (!versions || typeof versions !== "object" || Array.isArray(versions)) {
    return null;
  }
  const v = versions as Record<string, unknown>;
  if (typeof v.privacy !== "string" || typeof v.terms !== "string") return null;
  if (o.acceptedPrivacy !== true || o.acceptedTerms !== true) return null;
  return {
    acceptedPrivacy: true,
    acceptedTerms: true,
    acceptedImageUsage: o.acceptedImageUsage === true,
    versions: {
      privacy: v.privacy,
      terms: v.terms,
      ...(typeof v.image === "string" ? { image: v.image } : {}),
    },
  };
}

export const registerVerificationService = {

  async sendRegistrationCodeEmail(

    email: string,

    firstName: string,

    code: string,

  ): Promise<void> {

    await sendVerificationCodeEmail({

      kind: "register",

      to: email,

      firstName,

      code,

      expiresMinutes: VERIFICATION_CODE_TTL_MINUTES,

    });

  },



  async resendCode(email: string): Promise<{ verificationSent: true }> {

    const normalizedEmail = email.trim().toLowerCase();

    const pending = await prisma.pendingRegistration.findUnique({

      where: { email: normalizedEmail },

    });



    if (!pending) {

      const existingUser = await prisma.user.findUnique({

        where: { email: normalizedEmail },

      });

      if (existingUser) {

        throw validationError("Esta conta já foi confirmada. Faça login.");

      }

      throw validationError("Cadastro não encontrado. Crie a conta novamente.");

    }



    if (pending.expiresAt <= new Date()) {

      await prisma.pendingRegistration.delete({ where: { id: pending.id } });

      throw validationError("Cadastro expirado. Crie a conta novamente.");

    }



    const code = generateRecoveryCode();

    await prisma.pendingRegistration.update({

      where: { id: pending.id },

      data: {

        codeHash: hashRecoveryCode(code),

        expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),

      },

    });



    await registerVerificationService.sendRegistrationCodeEmail(

      normalizedEmail,

      pending.firstName,

      code,

    );

    return { verificationSent: true };

  },



  async verifyAndActivate(

    email: string,

    code: string,

    meta: { userAgent: string | null; ipAddress: string | null },

  ): Promise<NextResponse> {

    const normalizedEmail = email.trim().toLowerCase();

    const pending = await prisma.pendingRegistration.findUnique({

      where: { email: normalizedEmail },

    });



    if (!pending || pending.expiresAt <= new Date()) {

      if (pending) {

        await prisma.pendingRegistration.delete({ where: { id: pending.id } });

      }

      throw validationError("Código inválido ou expirado.");

    }



    const codeHash = hashRecoveryCode(code);

    if (pending.codeHash !== codeHash) {

      throw validationError("Código inválido ou expirado.");

    }



    const [userByEmail, userByCpf] = await Promise.all([

      prisma.user.findUnique({ where: { email: normalizedEmail } }),

      prisma.user.findUnique({ where: { cpf: pending.cpf } }),

    ]);



    if (userByEmail || userByCpf) {

      await prisma.pendingRegistration.delete({ where: { id: pending.id } });

      throw conflictError("Esta conta já foi confirmada. Faça login.");

    }



    const registrationConsents = parseRegistrationConsents(
      pending.registrationConsents,
    );

    const user = await createPilotAccount({

      email: pending.email,

      cpf: pending.cpf,

      passwordHash: pending.passwordHash,

      firstName: pending.firstName,

      lastName: pending.lastName,

      birthDate: pending.birthDate,

      skillLevelId: pending.skillLevelId,

      categoryIds: parseCategoryIds(pending.categoryIds),
      username: pending.reservedUsername,
    });

    if (registrationConsents) {
      await recordRegistrationConsents(user.id, registrationConsents);
    }

    await prisma.pendingRegistration.delete({ where: { id: pending.id } });



    await writeAuthAuditLog({

      actorId: user.id,

      action: "AUTH_LOGIN",

      metadata: { source: "register_verify", email: normalizedEmail },

    });



    const { token, expiresAt } = await createSession({

      userId: user.id,

      rememberMe: false,

      userAgent: meta.userAgent,

      ipAddress: meta.ipAddress,

    });



    const expiresIn = Math.max(

      1,

      Math.floor((expiresAt.getTime() - Date.now()) / 1000),

    );



    const response = jsonSuccess({

      user: mapUserToAuthDTO(user),

      accessToken: token,

      expiresIn,

    });



    applySessionCookie(response, token, {

      rememberMe: false,

      maxAgeSeconds: getSessionTtlSeconds(false),

    });



    return response;

  },

};

