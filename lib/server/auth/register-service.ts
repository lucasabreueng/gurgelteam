import { isUnder14 } from "@/lib/auth-accounts-mocks";
import type { RegisterRequest } from "@/lib/contracts/api/v1/auth.api.schemas";
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import {
  resolveCategoryIds,
  resolveSkillLevelId,
} from "@/lib/reference-data/resolve-reference-ids";
import { REFERENCE_SEED_IDS } from "@/lib/reference-data/seed-reference-ids";
import { hashPassword } from "@/lib/server/auth/password";
import { suggestPilotUsername } from "@/lib/server/auth/pilot-account";
import {
  registerVerificationService,
  VERIFICATION_CODE_TTL_MS,
} from "@/lib/server/auth/register-verification-service";
import {
  generateRecoveryCode,
  hashRecoveryCode,
} from "@/lib/server/auth/signed-token";
import { assertRegistrationLegalConsents } from "@/lib/server/auth/registration-legal-documents";
import { reserveUsernameForRegistration } from "@/lib/server/auth/username-reservation";
import { prisma } from "@/lib/server/prisma";
import { Prisma } from "@prisma/client";

function businessRuleError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.BUSINESS_RULE,
    message,
    httpStatus: 422,
  };
}

function conflictError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.CONFLICT,
    message,
    httpStatus: 409,
  };
}

function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

async function ensureRegistrationAvailable(email: string, cpf: string): Promise<void> {
  const [userByEmail, userByCpf, pendingByCpf] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { cpf } }),
    prisma.pendingRegistration.findUnique({ where: { cpf } }),
  ]);

  if (userByEmail) throw conflictError("E-mail já cadastrado.");
  if (userByCpf) throw conflictError("CPF já cadastrado.");
  if (pendingByCpf && pendingByCpf.email !== email) {
    throw conflictError("CPF já cadastrado.");
  }
}

export const registerService = {
  suggestUsername: suggestPilotUsername,

  async register(data: RegisterRequest) {
    if (isUnder14(data.birthDate)) {
      throw businessRuleError(
        "Pilotos menores de 14 anos devem ser cadastrados por um responsável.",
      );
    }

    const email = data.email.trim().toLowerCase();
    const cpf = normalizeCpf(data.cpf);
    await ensureRegistrationAvailable(email, cpf);

    const skillLevelId = resolveSkillLevelId(data.levelId ?? "iniciante");
    const categoryIds = resolveCategoryIds(
      data.categoryIds?.length
        ? data.categoryIds
        : [REFERENCE_SEED_IDS.categories.f400],
    );
    const passwordHash = hashPassword(data.password);
    const legal = await assertRegistrationLegalConsents({
      acceptedPrivacy: data.acceptedPrivacy,
      acceptedTerms: data.acceptedTerms,
      acceptedImageUsage: data.acceptedImageUsage,
    });
    const code = generateRecoveryCode();
    const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MS);

    let reservedUsername: string;
    try {
      reservedUsername = await reserveUsernameForRegistration(
        data.firstName.trim(),
        data.lastName.trim(),
        email,
      );
    } catch {
      throw conflictError(
        "Usuário indisponível no momento. Aguarde ou altere nome/sobrenome.",
      );
    }

    const pendingPayload = {
      email,
      cpf,
      passwordHash,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      birthDate: new Date(`${data.birthDate}T12:00:00`),
      skillLevelId,
      categoryIds,
      reservedUsername,
      codeHash: hashRecoveryCode(code),
      expiresAt,
      registrationConsents: {
        acceptedPrivacy: true,
        acceptedTerms: true,
        acceptedImageUsage: legal.acceptedImageUsage,
        versions: legal.versions,
      },
    };

    try {
      await prisma.pendingRegistration.upsert({
        where: { email },
        create: pendingPayload,
        update: pendingPayload,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        Array.isArray(error.meta?.target) &&
        (error.meta.target as string[]).includes("reserved_username")
      ) {
        reservedUsername = await reserveUsernameForRegistration(
          data.firstName.trim(),
          data.lastName.trim(),
          email,
        );
        await prisma.pendingRegistration.upsert({
          where: { email },
          create: { ...pendingPayload, reservedUsername },
          update: { ...pendingPayload, reservedUsername },
        });
      } else {
        throw error;
      }
    }

    try {
      await registerVerificationService.sendRegistrationCodeEmail(
        email,
        data.firstName.trim(),
        code,
      );
    } catch (error) {
      await prisma.pendingRegistration.deleteMany({ where: { email } }).catch(() => undefined);
      console.error("[auth/register] Falha ao enviar e-mail de confirmação:", error);
      throw {
        code: API_ERROR_CODES.SERVICE_UNAVAILABLE,
        message:
          "Não foi possível enviar o e-mail de confirmação. Tente novamente em instantes.",
        httpStatus: 503,
      } satisfies ApiError;
    }

    return { email, verificationSent: true as const };
  },
};
