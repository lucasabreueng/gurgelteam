import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import { ensureGuardianForUser } from "@/lib/server/pilot/pilot-account-bundle";
import { prisma } from "@/lib/server/prisma";
import type { User } from "@prisma/client";

function forbiddenError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.FORBIDDEN,
    message,
    httpStatus: 403,
  };
}

/** Garante que o usuário logado pode gerenciar o client (próprio perfil ou piloto vinculado). */
export async function assertGuardianManagesClient(
  user: User,
  clientId: string,
): Promise<void> {
  if (!user.clientId) {
    throw forbiddenError("Conta sem perfil de piloto vinculado.");
  }

  if (user.clientId === clientId) return;

  const adultClient = await prisma.client.findUnique({
    where: { id: user.clientId },
    select: { phone: true },
  });
  const guardianId = await ensureGuardianForUser(user, adultClient?.phone ?? null);

  const link = await prisma.guardianLink.findFirst({
    where: { guardianId, clientId },
  });

  if (!link) {
    throw forbiddenError("Você não tem permissão para gerenciar este perfil.");
  }
}
