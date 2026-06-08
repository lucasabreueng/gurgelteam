import type { KartStatus as PrismaKartStatus } from "@prisma/client";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import type {
  AssignKartToClientRequest,
  CreateKartRequest,
  KartsQuery,
  UpdateKartRequest,
  UpdateKartStatusRequest,
} from "@/lib/contracts/api/v1/karts.api.schemas";
import { prisma } from "@/lib/server/prisma";
import {
  kartDetailInclude,
  mapKartToDetail,
} from "@/lib/server/karts/map-kart-detail";
import {
  kartInclude,
  mapKartToDTO,
} from "@/lib/server/karts/map-kart";
import { persistKartPhotoUrl } from "@/lib/server/karts/save-kart-photo";

function notFoundError(): ApiError {
  return {
    code: API_ERROR_CODES.NOT_FOUND,
    message: "Kart não encontrado.",
    httpStatus: 404,
  };
}

function conflictError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.CONFLICT,
    message,
    httpStatus: 409,
  };
}

function parseMaintenanceDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  return new Date(`${iso}T12:00:00.000Z`);
}

async function loadKart(kartId: string) {
  return prisma.kart.findUnique({
    where: { id: kartId },
    include: kartInclude,
  });
}

async function assertNoActiveScheduleConflict(
  kartId: string,
  targetStatus: string,
): Promise<ApiError | null> {
  if (targetStatus !== "manutencao" && targetStatus !== "indisponivel") {
    return null;
  }

  const activeEvent = await prisma.scheduleEvent.findFirst({
    where: {
      kartId,
      status: { notIn: ["cancelado", "finalizado"] },
      endsAt: { gt: new Date() },
    },
  });

  if (activeEvent) {
    return conflictError(
      "Kart possui evento ativo na agenda. Cancele ou reagende antes de bloquear.",
    );
  }

  return null;
}

export const kartsRepository = {
  async list(query: KartsQuery) {
    const karts = await prisma.kart.findMany({
      where: {
        ...(query.status ? { status: query.status as PrismaKartStatus } : {}),
        ...(query.categoryId ? { categoryId: query.categoryId } : {}),
        ...(query.ownership ? { ownership: query.ownership } : {}),
        ...(query.clientId ? { clientId: query.clientId } : {}),
      },
      include: kartInclude,
      orderBy: { number: "asc" },
    });

    return karts.map(mapKartToDTO);
  },

  async getById(kartId: string) {
    const kart = await loadKart(kartId);
    if (!kart) return null;
    return mapKartToDTO(kart);
  },

  async getDetailById(kartId: string) {
    const kart = await prisma.kart.findUnique({
      where: { id: kartId },
      include: kartDetailInclude,
    });
    if (!kart) return null;
    return mapKartToDetail(kart);
  },

  async updateStatus(kartId: string, data: UpdateKartStatusRequest) {
    const existing = await loadKart(kartId);
    if (!existing) throw notFoundError();

    const conflict = await assertNoActiveScheduleConflict(
      kartId,
      data.status,
    );
    if (conflict) throw conflict;

    const kart = await prisma.kart.update({
      where: { id: kartId },
      data: {
        status: data.status as PrismaKartStatus,
      },
      include: kartInclude,
    });

    if (data.status === "manutencao") {
      const openOrder = await prisma.maintenanceOrder.findFirst({
        where: {
          kartId,
          status: { in: ["pendente", "em_andamento"] },
        },
      });

      if (!openOrder) {
        await prisma.maintenanceOrder.create({
          data: {
            kartId,
            status: "pendente",
            title: data.reason?.trim() || "Manutenção via frota",
            description: data.reason ?? null,
            detectedAt: new Date(),
          },
        });
      }
    }

    return mapKartToDTO(kart);
  },

  async assignClient(kartId: string, data: AssignKartToClientRequest) {
    const existing = await loadKart(kartId);
    if (!existing) throw notFoundError();

    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
    });
    if (!client) {
      throw {
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Cliente não encontrado.",
        httpStatus: 404,
      } satisfies ApiError;
    }

    const kart = await prisma.kart.update({
      where: { id: kartId },
      data: {
        clientId: data.clientId,
        ownership: "client",
      },
      include: kartInclude,
    });

    return mapKartToDTO(kart);
  },

  async create(data: CreateKartRequest) {
    const existingNumber = await prisma.kart.findUnique({
      where: { number: data.number },
    });
    if (existingNumber) {
      throw conflictError(`Já existe um kart com o número ${data.number}.`);
    }

    if (data.ownership === "client" && data.clientId) {
      const client = await prisma.client.findUnique({
        where: { id: data.clientId },
      });
      if (!client) {
        throw notFoundError();
      }
    }

    const photoUrl = await persistKartPhotoUrl(data.photoUrl);

    const kart = await prisma.kart.create({
      data: {
        number: data.number,
        categoryId: data.categoryId,
        ownership: data.ownership,
        clientId: data.ownership === "client" ? data.clientId ?? null : null,
        motorRef: data.motorRef,
        chassisRef: data.chassisRef,
        photoUrl,
        engineHours: data.engineHours ?? 0,
        lastMaintenanceAt: parseMaintenanceDate(data.lastMaintenanceAt),
        status: "disponivel",
      },
      include: kartInclude,
    });

    return mapKartToDTO(kart);
  },

  async update(kartId: string, data: UpdateKartRequest) {
    const existing = await loadKart(kartId);
    if (!existing) throw notFoundError();

    if (data.number != null && data.number !== existing.number) {
      const duplicate = await prisma.kart.findUnique({
        where: { number: data.number },
      });
      if (duplicate && duplicate.id !== kartId) {
        throw conflictError(`Já existe um kart com o número ${data.number}.`);
      }
    }

    const ownership = data.ownership ?? existing.ownership;
    const clientId =
      ownership === "client"
        ? data.clientId ?? existing.clientId
        : null;

    if (ownership === "client" && !clientId) {
      throw {
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: "Cliente obrigatório para kart de cliente.",
        httpStatus: 400,
      } satisfies ApiError;
    }

    const photoUrl =
      data.photoUrl !== undefined
        ? await persistKartPhotoUrl(data.photoUrl)
        : undefined;

    const kart = await prisma.kart.update({
      where: { id: kartId },
      data: {
        ...(data.number != null ? { number: data.number } : {}),
        ...(data.categoryId ? { categoryId: data.categoryId } : {}),
        ...(data.ownership ? { ownership: data.ownership } : {}),
        clientId,
        ...(data.motorRef ? { motorRef: data.motorRef } : {}),
        ...(data.chassisRef ? { chassisRef: data.chassisRef } : {}),
        ...(photoUrl !== undefined ? { photoUrl } : {}),
        ...(data.engineHours != null ? { engineHours: data.engineHours } : {}),
        ...(data.lastMaintenanceAt !== undefined
          ? { lastMaintenanceAt: parseMaintenanceDate(data.lastMaintenanceAt) }
          : {}),
      },
      include: kartInclude,
    });

    return mapKartToDTO(kart);
  },

  async remove(kartId: string): Promise<void> {
    const existing = await loadKart(kartId);
    if (!existing) throw notFoundError();

    const activeEvent = await prisma.scheduleEvent.findFirst({
      where: {
        kartId,
        status: { notIn: ["cancelado", "finalizado"] },
        endsAt: { gt: new Date() },
      },
    });
    if (activeEvent) {
      throw conflictError(
        "Kart possui agendamento ativo. Cancele ou remova o evento antes de excluir.",
      );
    }

    const openOrder = await prisma.maintenanceOrder.findFirst({
      where: {
        kartId,
        status: { in: ["pendente", "em_andamento"] },
      },
    });
    if (openOrder) {
      throw conflictError(
        "Kart possui ordem de manutenção aberta. Conclua ou cancele antes de excluir.",
      );
    }

    await prisma.kart.delete({ where: { id: kartId } });
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
