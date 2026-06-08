import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import {
  findUserByIdentifier,
  writeAuthAuditLog,
} from "@/lib/server/auth/auth-utils";
import { hashPassword } from "@/lib/server/auth/password";
import {
  createSignedResetToken,
  generateRecoveryCode,
  hashRecoveryCode,
  verifySignedResetToken,
} from "@/lib/server/auth/signed-token";
import { sendVerificationCodeEmail } from "@/lib/server/email/send-verification-code-email";
import { prisma } from "@/lib/server/prisma";

const RECOVERY_CODE_TTL_MS = 15 * 60 * 1000;
const RECOVERY_CODE_TTL_MINUTES = 15;

function unauthorizedError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.UNAUTHORIZED,
    message,
    httpStatus: 401,
  };
}

function validationError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.VALIDATION_ERROR,
    message,
    httpStatus: 400,
  };
}

export const passwordRecoveryService = {
  async requestRecovery(identifier: string): Promise<{ sent: true }> {
    const user = await findUserByIdentifier(identifier);
    if (!user) {
      throw unauthorizedError("E-mail ou usuário não encontrado em nossa base.");
    }

    const code = generateRecoveryCode();
    const expiresAt = new Date(Date.now() + RECOVERY_CODE_TTL_MS);

    await prisma.passwordReset.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        codeHash: hashRecoveryCode(code),
        expiresAt,
      },
    });

    await sendVerificationCodeEmail({
      kind: "password_recovery",
      to: user.email,
      firstName: user.firstName,
      code,
      expiresMinutes: RECOVERY_CODE_TTL_MINUTES,
    });

    return { sent: true };
  },

  async verifyCode(code: string): Promise<{ token: string }> {
    const codeHash = hashRecoveryCode(code);
    const reset = await prisma.passwordReset.findFirst({
      where: {
        codeHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!reset) {
      throw validationError("Código inválido ou expirado.");
    }

    const token = createSignedResetToken({
      resetId: reset.id,
      userId: reset.userId,
    });

    return { token };
  },

  async resetPassword(token: string, password: string): Promise<{ ok: true }> {
    const payload = verifySignedResetToken(token);
    if (!payload) {
      throw validationError("Token de redefinição inválido ou expirado.");
    }

    const reset = await prisma.passwordReset.findUnique({
      where: { id: payload.resetId },
    });

    if (
      !reset ||
      reset.userId !== payload.userId ||
      reset.usedAt ||
      reset.expiresAt <= new Date()
    ) {
      throw validationError("Token de redefinição inválido ou expirado.");
    }

    const passwordHash = hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: payload.userId },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
    ]);

    await writeAuthAuditLog({
      actorId: payload.userId,
      action: "AUTH_PASSWORD_RESET",
    });

    return { ok: true };
  },
};
