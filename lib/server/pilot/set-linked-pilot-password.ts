import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import type { SetLinkedPilotPasswordRequest } from "@/lib/contracts/api/v1/pilot.api.schemas";
import { assertGuardianManagesClient } from "@/lib/server/pilot/guardian-client-access";
import { hashPassword } from "@/lib/server/auth/password";
import { prisma } from "@/lib/server/prisma";
import type { User } from "@prisma/client";

function notFoundError(): ApiError {
  return {
    code: API_ERROR_CODES.NOT_FOUND,
    message: "Piloto vinculado não encontrado.",
    httpStatus: 404,
  };
}

export async function setLinkedPilotPassword(
  guardianUser: User,
  clientId: string,
  input: SetLinkedPilotPasswordRequest,
): Promise<{ ok: true }> {
  if (!guardianUser.clientId) {
    throw {
      code: API_ERROR_CODES.VALIDATION_ERROR,
      message: "Conta sem perfil de piloto vinculado.",
      httpStatus: 400,
    } satisfies ApiError;
  }

  await assertGuardianManagesClient(guardianUser, clientId);

  const link = await prisma.guardianLink.findFirst({
    where: { clientId },
    include: { client: { include: { user: true } } },
  });

  if (!link?.client.user) {
    throw notFoundError();
  }

  await prisma.user.update({
    where: { id: link.client.user.id },
    data: { passwordHash: hashPassword(input.newPassword) },
  });

  return { ok: true };
}
