import type { Kart, KartCategory, Client } from "@prisma/client";

import type { KartApiDTO } from "@/lib/contracts/api/v1/karts.api.schemas";
import type { KartOwnership, KartStatus } from "@/lib/contracts/enums";

export type KartWithRelations = Kart & {
  category: KartCategory;
  clientOwner?: Client | null;
};

export function formatIsoDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  return date.toISOString().slice(0, 10);
}

export function mapKartToDTO(kart: KartWithRelations): KartApiDTO {
  return {
    id: kart.id,
    number: kart.number,
    categoryId: kart.categoryId,
    categoryName: kart.category.name,
    ownership: kart.ownership as KartOwnership,
    clientId: kart.clientId,
    clientName: kart.clientOwner?.name ?? null,
    status: kart.status as KartStatus,
    motorRef: kart.motorRef,
    chassisRef: kart.chassisRef,
    photoUrl: kart.photoUrl,
    engineHours:
      kart.engineHours != null ? Number(kart.engineHours) : null,
    lastMaintenanceAt: formatIsoDate(kart.lastMaintenanceAt),
    nextMaintenanceHours:
      kart.nextMaintenanceHours != null
        ? Number(kart.nextMaintenanceHours)
        : null,
    preventiveMaintenanceHours: parsePreventiveHours(
      (kart as Kart & { preventiveMaintenanceHours?: unknown })
        .preventiveMaintenanceHours,
    ),
  };
}

function parsePreventiveHours(
  value: unknown,
): Record<string, number> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const result: Record<string, number> = {};
  for (const [key, hours] of Object.entries(value as Record<string, unknown>)) {
    if (typeof hours === "number" && Number.isFinite(hours)) {
      result[key] = hours;
    }
  }
  return Object.keys(result).length > 0 ? result : null;
}

export const kartInclude = {
  category: true,
  clientOwner: true,
} as const;
