import type { Client, ClientCategory, KartCategory, SkillLevel } from "@prisma/client";

import type {
  ClientDetailDTO,
  ClientListItemDTO,
} from "@/lib/contracts/api/v1/clients.api.schemas";
import type { ClientStatus } from "@/lib/contracts/enums";

export type ClientWithRelations = Client & {
  skillLevel: SkillLevel;
  categories: (ClientCategory & { category: KartCategory })[];
};

export function formatIsoDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  return date.toISOString().slice(0, 10);
}

export function mapClientToListItem(client: ClientWithRelations): ClientListItemDTO {
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    avatarUrl: client.avatarUrl,
    skillLevelId: client.skillLevelId,
    skillLevelName: client.skillLevel.name,
    status: client.status as ClientStatus,
    isMinor: client.isMinor,
    categoryIds: client.categories.map((entry) => entry.categoryId),
    memberSince: formatIsoDate(client.memberSince),
  };
}

export function mapClientToDetail(client: ClientWithRelations): ClientDetailDTO {
  return {
    ...mapClientToListItem(client),
    bestLapMs: client.bestLapMs,
    consistencyPct: client.consistencyPct,
    totalSessions: client.totalSessions,
    categoryNames: client.categories.map((entry) => entry.category.name),
  };
}

export const clientInclude = {
  skillLevel: true,
  categories: { include: { category: true } },
} as const;
