import { format } from "date-fns";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import type {
  PilotDashboardApiDTO,
  PilotProfileApiDTO,
  UpdatePilotProfileRequest,
} from "@/lib/contracts/api/v1/pilot.api.schemas";
import { prisma } from "@/lib/server/prisma";
import { persistClientAvatarUrl } from "@/lib/server/clients/save-client-avatar";
import {
  clientInclude,
  formatIsoDate,
  mapClientToDetail,
  type ClientWithRelations,
} from "@/lib/server/clients/map-client";
import { formatTimeHHmm, isoDateFromDbDate } from "@/lib/server/format-money";

function notFoundError(): ApiError {
  return {
    code: API_ERROR_CODES.NOT_FOUND,
    message: "Perfil de piloto não encontrado.",
    httpStatus: 404,
  };
}

function todayIso(): string {
  return format(new Date(), "yyyy-MM-dd");
}

type ClientWithUser = ClientWithRelations & {
  user: { birthDate: Date | null; cpf: string | null; email?: string | null } | null;
};

function resolveClientEmail(client: ClientWithUser): string | null {
  if (client.email?.trim()) return client.email.trim();
  const userEmail = client.user?.email?.trim();
  if (!userEmail || userEmail.endsWith("@piloto-vinculado.local")) return null;
  return userEmail;
}

export function mapClientToPilotProfile(client: ClientWithUser): PilotProfileApiDTO {
  const detail = mapClientToDetail(client);
  return {
    id: detail.id,
    name: detail.name,
    email: resolveClientEmail(client),
    phone: detail.phone,
    avatarUrl: detail.avatarUrl,
    birthDate: formatIsoDate(client.user?.birthDate ?? null),
    cpf: client.user?.cpf ?? null,
    weightKg: client.weightKg ?? null,
    heightCm: client.heightCm ?? null,
    city: client.city ?? null,
    state: client.state ?? null,
    categoryIds: detail.categoryIds ?? [],
    categorySlugs: client.categories.map((entry) => entry.category.slug),
    skillLevelId: detail.skillLevelId,
    skillLevelSlug: client.skillLevel.slug,
    isMinor: detail.isMinor,
    notifyWhatsapp: client.notifyWhatsapp,
    notifyEmail: client.notifyEmail,
    emergencyName: client.emergencyName ?? null,
    emergencyPhone: client.emergencyPhone ?? null,
    emergencyRelation: client.emergencyRelation ?? null,
    favoriteNumber: client.favoriteNumber ?? null,
  };
}

export const pilotRepository = {
  async getProfile(clientId: string): Promise<PilotProfileApiDTO | null> {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { ...clientInclude, user: true },
    });
    if (!client) return null;

    return mapClientToPilotProfile(client);
  },

  async updateProfile(
    clientId: string,
    data: UpdatePilotProfileRequest,
  ): Promise<PilotProfileApiDTO> {
    const existing = await prisma.client.findUnique({ where: { id: clientId } });
    if (!existing) throw notFoundError();

    const avatarUrl =
      data.avatarUrl !== undefined
        ? await persistClientAvatarUrl(data.avatarUrl)
        : undefined;

    const client = await prisma.client.update({
      where: { id: clientId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
        ...(data.weightKg !== undefined ? { weightKg: data.weightKg || null } : {}),
        ...(data.heightCm !== undefined ? { heightCm: data.heightCm || null } : {}),
        ...(data.city !== undefined ? { city: data.city || null } : {}),
        ...(data.state !== undefined ? { state: data.state || null } : {}),
        ...(data.notifyWhatsapp !== undefined
          ? { notifyWhatsapp: data.notifyWhatsapp }
          : {}),
        ...(data.notifyEmail !== undefined ? { notifyEmail: data.notifyEmail } : {}),
        ...(data.emergencyName !== undefined
          ? { emergencyName: data.emergencyName || null }
          : {}),
        ...(data.emergencyPhone !== undefined
          ? { emergencyPhone: data.emergencyPhone || null }
          : {}),
        ...(data.emergencyRelation !== undefined
          ? { emergencyRelation: data.emergencyRelation || null }
          : {}),
        ...(data.favoriteNumber !== undefined
          ? { favoriteNumber: data.favoriteNumber || null }
          : {}),
      },
      include: { ...clientInclude, user: true },
    });

    return mapClientToPilotProfile(client);
  },

  async getDashboard(clientId: string): Promise<PilotDashboardApiDTO> {
    const today = todayIso();
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: clientInclude,
    });
    if (!client) throw notFoundError();

    const events = await prisma.scheduleEvent.findMany({
      where: {
        clientId,
        startsAt: {
          gte: new Date(`${today}T00:00:00.000-03:00`),
        },
        status: { notIn: ["cancelado"] },
      },
      orderBy: { startsAt: "asc" },
      take: 5,
    });

    const nextEvents = events.map((event) => ({
      id: event.id,
      date: isoDateFromDbDate(event.startsAt),
      start: formatTimeHHmm(event.startsAt),
      typeLabel: event.type.replace(/_/g, " "),
      status: event.status,
    }));

    return {
      clientId,
      nextEvents,
      kpis: [
        {
          id: "sessions",
          label: "Treinos realizados",
          value: String(client.totalSessions),
        },
        {
          id: "best-lap",
          label: "Melhor volta",
          value: client.bestLapMs
            ? `${Math.floor(client.bestLapMs / 60000)}:${String(
                Math.floor((client.bestLapMs % 60000) / 1000),
              ).padStart(2, "0")}`
            : "—",
        },
        {
          id: "consistency",
          label: "Consistência",
          value: client.consistencyPct
            ? `${client.consistencyPct}%`
            : "—",
        },
      ],
    };
  },
};

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value
  );
}
