import type { User } from "@prisma/client";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import { assertGuardianManagesClient } from "@/lib/server/pilot/guardian-client-access";
import { ensureGuardianForUser } from "@/lib/server/pilot/pilot-account-bundle";
import { prisma } from "@/lib/server/prisma";

function forbiddenError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.FORBIDDEN,
    message,
    httpStatus: 403,
  };
}

export type BookingClientTarget = {
  clientId: string;
  name: string;
};

/** Resolve clientes alvo da reserva a partir de IDs explícitos. */
export async function resolveBookingClientsByIds(
  user: User,
  clientIds: readonly string[],
): Promise<BookingClientTarget[]> {
  if (!user.clientId) {
    throw forbiddenError("Conta sem perfil de piloto vinculado.");
  }
  if (clientIds.length === 0) {
    throw forbiddenError("Selecione ao menos um piloto para reservar.");
  }

  const uniqueIds = [...new Set(clientIds)];
  const targets: BookingClientTarget[] = [];

  for (const clientId of uniqueIds) {
    await assertGuardianManagesClient(user, clientId);
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, name: true },
    });
    if (!client) {
      throw forbiddenError("Perfil de piloto não encontrado.");
    }
    targets.push({ clientId: client.id, name: client.name });
  }

  return targets;
}

/** Resolve clientes alvo da reserva (próprio, vinculado ou grupo). */
export async function listGuardianBookingClients(
  user: User,
  options: { clientId?: string; includeLinkedPilots?: boolean },
): Promise<BookingClientTarget[]> {
  if (!user.clientId) {
    throw forbiddenError("Conta sem perfil de piloto vinculado.");
  }

  if (options.clientId) {
    await assertGuardianManagesClient(user, options.clientId);
    const client = await prisma.client.findUnique({
      where: { id: options.clientId },
      select: { id: true, name: true },
    });
    if (!client) {
      throw forbiddenError("Perfil de piloto não encontrado.");
    }
    return [{ clientId: client.id, name: client.name }];
  }

  const self = await prisma.client.findUnique({
    where: { id: user.clientId },
    select: { id: true, name: true },
  });
  if (!self) {
    throw forbiddenError("Perfil de piloto não encontrado.");
  }

  const targets: BookingClientTarget[] = [{ clientId: self.id, name: self.name }];

  if (options.includeLinkedPilots) {
    const adultClient = await prisma.client.findUnique({
      where: { id: user.clientId },
      select: { phone: true },
    });
    const guardianId = await ensureGuardianForUser(user, adultClient?.phone ?? null);
    const links = await prisma.guardianLink.findMany({
      where: { guardianId },
      include: { client: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });

    for (const link of links) {
      if (!targets.some((t) => t.clientId === link.clientId)) {
        targets.push({ clientId: link.client.id, name: link.client.name });
      }
    }
  }

  return targets;
}
