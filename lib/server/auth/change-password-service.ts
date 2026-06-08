import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import { hashPassword, verifyPassword } from "@/lib/server/auth/password";
import { prisma } from "@/lib/server/prisma";

function invalidCurrentPassword(): ApiError {
  return {
    code: API_ERROR_CODES.UNAUTHORIZED,
    message: "Senha atual incorreta.",
    httpStatus: 401,
  };
}

export const changePasswordService = {
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ ok: true }> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw {
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Usuário não encontrado.",
        httpStatus: 404,
      } satisfies ApiError;
    }

    if (!verifyPassword(currentPassword, user.passwordHash)) {
      throw invalidCurrentPassword();
    }

    if (verifyPassword(newPassword, user.passwordHash)) {
      throw {
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: "A nova senha deve ser diferente da senha atual.",
        httpStatus: 400,
      } satisfies ApiError;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashPassword(newPassword) },
    });

    return { ok: true };
  },
};
