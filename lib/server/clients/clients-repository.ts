import type { Prisma } from "@prisma/client";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import type {
  ClientsQuery,
  CreateClientRequest,
  LinkGuardianRequest,
  UpdateClientRequest,
} from "@/lib/contracts/api/v1/clients.api.schemas";
import type { PilotStatsQuery } from "@/lib/contracts/api/v1/telemetry.api.schemas";
import { prisma } from "@/lib/server/prisma";
import {
  clientInclude,
  mapClientToDetail,
  mapClientToListItem,
} from "@/lib/server/clients/map-client";

function notFoundError(): ApiError {
  return {
    code: API_ERROR_CODES.NOT_FOUND,
    message: "Cliente não encontrado.",
    httpStatus: 404,
  };
}

async function loadClient(clientId: string) {
  return prisma.client.findUnique({
    where: { id: clientId },
    include: clientInclude,
  });
}

export const clientsRepository = {
  async list(query: ClientsQuery) {
    const where: Prisma.ClientWhereInput = {
      ...(query.query.trim()
        ? {
            OR: [
              { name: { contains: query.query.trim(), mode: "insensitive" } },
              { email: { contains: query.query.trim(), mode: "insensitive" } },
            ],
          }
        : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.skillLevelId ? { skillLevelId: query.skillLevelId } : {}),
      ...(query.categoryId
        ? { categories: { some: { categoryId: query.categoryId } } }
        : {}),
    };

    const [total, clients] = await Promise.all([
      prisma.client.count({ where }),
      prisma.client.findMany({
        where,
        include: clientInclude,
        orderBy: { name: "asc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
    ]);

    return {
      items: clients.map(mapClientToListItem),
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
      },
    };
  },

  async getById(clientId: string) {
    const client = await loadClient(clientId);
    if (!client) return null;
    return mapClientToDetail(client);
  },

  async create(data: CreateClientRequest) {
    const client = await prisma.client.create({
      data: {
        name: data.name,
        email: data.email ?? null,
        phone: data.phone ?? null,
        skillLevelId: data.skillLevelId,
        isMinor: data.isMinor,
        status: "Ativo",
        memberSince: new Date(),
        categories: {
          create: data.categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
      include: clientInclude,
    });

    if (data.sendInvite && client.email) {
      console.info(`[clients] Convite pendente para ${client.email}`);
    }

    return mapClientToListItem(client);
  },

  async update(clientId: string, data: UpdateClientRequest) {
    const existing = await loadClient(clientId);
    if (!existing) throw notFoundError();

    if (data.categoryIds) {
      await prisma.clientCategory.deleteMany({ where: { clientId } });
      await prisma.clientCategory.createMany({
        data: data.categoryIds.map((categoryId) => ({
          clientId,
          categoryId,
        })),
      });
    }

    const client = await prisma.client.update({
      where: { id: clientId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.email !== undefined ? { email: data.email ?? null } : {}),
        ...(data.phone !== undefined ? { phone: data.phone ?? null } : {}),
        ...(data.skillLevelId !== undefined
          ? { skillLevelId: data.skillLevelId }
          : {}),
        ...(data.isMinor !== undefined ? { isMinor: data.isMinor } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
      include: clientInclude,
    });

    return mapClientToListItem(client);
  },

  async getStats(clientId: string, query: PilotStatsQuery) {
    void query;
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) throw notFoundError();

    return {
      clientId: client.id,
      bestLapMs: client.bestLapMs,
      consistencyPct: client.consistencyPct,
      totalSessions: client.totalSessions,
      validLapsCount: client.totalSessions,
    };
  },

  async remove(clientId: string): Promise<void> {
    const existing = await loadClient(clientId);
    if (!existing) throw notFoundError();

    await prisma.$transaction(async (tx) => {
      await tx.clientCategory.deleteMany({ where: { clientId } });
      await tx.guardianLink.deleteMany({ where: { clientId } });
      const linkedUser = await tx.user.findFirst({ where: { clientId } });
      if (linkedUser) {
        await tx.modulePermission.deleteMany({ where: { userId: linkedUser.id } });
        await tx.user.delete({ where: { id: linkedUser.id } });
      }
      await tx.client.delete({ where: { id: clientId } });
    });
  },

  async getTimeline(clientId: string) {
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) throw notFoundError();

    const [events, lessons] = await Promise.all([
      prisma.scheduleEvent.findMany({
        where: { clientId },
        orderBy: { startsAt: "desc" },
        take: 20,
      }),
      prisma.lessonSession.findMany({
        where: { clientId },
        include: { scheduleEvent: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    const timeline = [
      ...events.map((event) => ({
        id: event.id,
        type: "schedule" as const,
        label: `Agenda · ${event.type.replace(/_/g, " ")}`,
        at: event.startsAt.toISOString(),
        status: event.status,
      })),
      ...lessons.map((lesson) => ({
        id: lesson.id,
        type: "lesson" as const,
        label: `Aula · ${lesson.typeLabel}`,
        at: lesson.scheduleEvent.startsAt.toISOString(),
        status: lesson.status,
      })),
    ]
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, 30);

    return timeline;
  },

  async linkGuardian(clientId: string, data: LinkGuardianRequest) {
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) throw notFoundError();

    let guardianId = data.guardianId;
    if (!guardianId && data.guardian) {
      const guardian = await prisma.guardian.create({
        data: {
          name: data.guardian.name,
          email: data.guardian.email ?? null,
          phone: data.guardian.phone ?? null,
          cpf: data.guardian.cpf ?? null,
        },
      });
      guardianId = guardian.id;
    }

    if (!guardianId) {
      throw {
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: "Informe guardianId ou dados do responsável.",
        httpStatus: 400,
      } satisfies ApiError;
    }

    const link = await prisma.guardianLink.upsert({
      where: {
        guardianId_clientId: { guardianId, clientId },
      },
      update: {
        authorizationSigned: data.authorizationSigned,
        documentsOnFile: data.documentsOnFile,
      },
      create: {
        guardianId,
        clientId,
        authorizationSigned: data.authorizationSigned,
        documentsOnFile: data.documentsOnFile,
      },
    });

    return {
      guardianId: link.guardianId,
      clientId: link.clientId,
      authorizationSigned: link.authorizationSigned,
      documentsOnFile: link.documentsOnFile,
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
