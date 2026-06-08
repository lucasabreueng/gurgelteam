import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import { prisma } from "@/lib/server/prisma";

function conflictError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.CONFLICT,
    message,
    httpStatus: 409,
  };
}

async function isKartFreeForSlot(
  kartId: string,
  startsAt: Date,
  endsAt: Date,
): Promise<boolean> {
  const conflict = await prisma.scheduleEvent.findFirst({
    where: {
      kartId,
      status: { not: "cancelado" },
      startsAt: { lt: endsAt },
      endsAt: { gt: startsAt },
    },
  });
  return !conflict;
}

export async function resolveKartForPilotBooking(
  clientId: string,
  categoryId: string | null,
  startsAt: Date,
  endsAt: Date,
  favoriteNumber?: string | null,
  excludeKartIds?: ReadonlySet<string>,
): Promise<{ kartId: string; kartNumber: number }> {
  const isExcluded = (kartId: string) => excludeKartIds?.has(kartId) ?? false;

  const ownKart = await prisma.kart.findFirst({
    where: { clientId, ownership: "client" },
    orderBy: { number: "asc" },
  });

  if (
    ownKart &&
    !isExcluded(ownKart.id) &&
    (await isKartFreeForSlot(ownKart.id, startsAt, endsAt))
  ) {
    return { kartId: ownKart.id, kartNumber: ownKart.number };
  }

  const favorite = favoriteNumber?.trim();
  if (favorite) {
    const parsed = Number.parseInt(favorite, 10);
    if (!Number.isNaN(parsed)) {
      const preferred = await prisma.kart.findUnique({ where: { number: parsed } });
      if (
        preferred &&
        !isExcluded(preferred.id) &&
        preferred.status === "disponivel" &&
        (await isKartFreeForSlot(preferred.id, startsAt, endsAt))
      ) {
        return { kartId: preferred.id, kartNumber: preferred.number };
      }
    }
  }

  const rentals = await prisma.kart.findMany({
    where: {
      ownership: "rental",
      status: "disponivel",
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy: { number: "asc" },
  });

  for (const kart of rentals) {
    if (
      !isExcluded(kart.id) &&
      (await isKartFreeForSlot(kart.id, startsAt, endsAt))
    ) {
      return { kartId: kart.id, kartNumber: kart.number };
    }
  }

  throw conflictError(
    "Nenhum kart disponível para este horário. Escolha outro slot ou fale com a equipe.",
  );
}
