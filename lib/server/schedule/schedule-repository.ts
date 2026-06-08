import type {
  PaymentStatus,
  ScheduleEventStatus,
  ScheduleEventType,
} from "@prisma/client";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import type {
  CreateScheduleEventRequest,
  RescheduleEventRequest,
  ScheduleEventsQuery,
  UpdateScheduleEventRequest,
} from "@/lib/contracts/api/v1/schedule.api.schemas";
import { prisma } from "@/lib/server/prisma";
import {
  combineNotes,
  mapScheduleEventToDTO,
  parseDateRange,
  scheduleEventInclude,
} from "@/lib/server/schedule/map-event";

function conflictError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.CONFLICT,
    message,
    httpStatus: 409,
  };
}

function notFoundError(): ApiError {
  return {
    code: API_ERROR_CODES.NOT_FOUND,
    message: "Evento não encontrado.",
    httpStatus: 404,
  };
}

async function loadCategory(categoryId?: string | null) {
  if (!categoryId) return null;
  return prisma.kartCategory.findUnique({ where: { id: categoryId } });
}

async function assertKartAvailable(
  kartId: string,
  startsAt: Date,
  endsAt: Date,
  excludeEventId?: string,
): Promise<ApiError | null> {
  const conflict = await prisma.scheduleEvent.findFirst({
    where: {
      kartId,
      id: excludeEventId ? { not: excludeEventId } : undefined,
      status: { not: "cancelado" },
      startsAt: { lt: endsAt },
      endsAt: { gt: startsAt },
    },
  });

  if (conflict) {
    return conflictError("Kart indisponível no horário solicitado.");
  }
  return null;
}

async function mapLoadedEvent(eventId: string) {
  const event = await prisma.scheduleEvent.findUnique({
    where: { id: eventId },
    include: scheduleEventInclude,
  });
  if (!event) return null;
  const category = await loadCategory(event.categoryId);
  return mapScheduleEventToDTO(event, category);
}

export const scheduleRepository = {
  async listEvents(query: ScheduleEventsQuery) {
    const range = parseDateRange(query.from, query.to);
    const events = await prisma.scheduleEvent.findMany({
      where: {
        ...(query.from || query.to ? { startsAt: range } : {}),
        ...(query.status
          ? { status: query.status as ScheduleEventStatus }
          : {}),
        ...(query.type ? { type: query.type as ScheduleEventType } : {}),
        ...(query.clientId ? { clientId: query.clientId } : {}),
        ...(query.kartId ? { kartId: query.kartId } : {}),
      },
      include: scheduleEventInclude,
      orderBy: { startsAt: "asc" },
    });

    const categoryIds = [
      ...new Set(events.map((e) => e.categoryId).filter(Boolean)),
    ] as string[];
    const categories = categoryIds.length
      ? await prisma.kartCategory.findMany({
          where: { id: { in: categoryIds } },
        })
      : [];
    const categoryById = new Map(categories.map((c) => [c.id, c]));

    return events.map((event) =>
      mapScheduleEventToDTO(
        event,
        event.categoryId ? categoryById.get(event.categoryId) : null,
      ),
    );
  },

  async getEventById(eventId: string) {
    return mapLoadedEvent(eventId);
  },

  async createEvent(
    data: CreateScheduleEventRequest,
    registeredById: string,
  ) {
    if (data.kartId) {
      const kartConflict = await assertKartAvailable(
        data.kartId,
        new Date(data.startsAt),
        new Date(data.endsAt),
      );
      if (kartConflict) throw kartConflict;
    }

    const event = await prisma.scheduleEvent.create({
      data: {
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
        type: data.type as ScheduleEventType,
        status: "pendente",
        clientId: data.clientId ?? null,
        registeredById,
        kartId: data.kartId ?? null,
        categoryId: data.categoryId ?? null,
        maxStudents: data.maxStudents ?? null,
        notes: combineNotes(data.notes, data.objective),
      },
      include: scheduleEventInclude,
    });

    const category = await loadCategory(event.categoryId);
    return mapScheduleEventToDTO(event, category);
  },

  async updateEvent(eventId: string, data: UpdateScheduleEventRequest) {
    const existing = await prisma.scheduleEvent.findUnique({
      where: { id: eventId },
    });
    if (!existing) throw notFoundError();

    const startsAt = data.startsAt
      ? new Date(data.startsAt)
      : existing.startsAt;
    const endsAt = data.endsAt ? new Date(data.endsAt) : existing.endsAt;
    const kartId = data.kartId !== undefined ? data.kartId : existing.kartId;

    if (kartId) {
      const kartConflict = await assertKartAvailable(
        kartId,
        startsAt,
        endsAt,
        eventId,
      );
      if (kartConflict) throw kartConflict;
    }

    const event = await prisma.scheduleEvent.update({
      where: { id: eventId },
      data: {
        ...(data.startsAt ? { startsAt } : {}),
        ...(data.endsAt ? { endsAt } : {}),
        ...(data.type ? { type: data.type as ScheduleEventType } : {}),
        ...(data.status
          ? { status: data.status as ScheduleEventStatus }
          : {}),
        ...(data.paymentStatus
          ? { paymentStatus: data.paymentStatus as PaymentStatus }
          : {}),
        ...(data.clientId !== undefined ? { clientId: data.clientId } : {}),
        ...(data.kartId !== undefined ? { kartId: data.kartId } : {}),
        ...(data.categoryId !== undefined
          ? { categoryId: data.categoryId }
          : {}),
        ...(data.maxStudents !== undefined
          ? { maxStudents: data.maxStudents }
          : {}),
        ...(data.notes !== undefined || data.objective !== undefined
          ? {
              notes: combineNotes(
                data.notes ?? existing.notes,
                data.objective,
              ),
            }
          : {}),
      },
      include: scheduleEventInclude,
    });

    const category = await loadCategory(event.categoryId);
    return mapScheduleEventToDTO(event, category);
  },

  async cancelEvent(eventId: string, reason?: string) {
    const existing = await prisma.scheduleEvent.findUnique({
      where: { id: eventId },
    });
    if (!existing) throw notFoundError();

    const notes = reason
      ? [existing.notes, `Cancelado: ${reason}`].filter(Boolean).join("\n")
      : existing.notes;

    const event = await prisma.scheduleEvent.update({
      where: { id: eventId },
      data: { status: "cancelado", notes },
      include: scheduleEventInclude,
    });

    const category = await loadCategory(event.categoryId);
    return mapScheduleEventToDTO(event, category);
  },

  async rescheduleEvent(eventId: string, data: RescheduleEventRequest) {
    const existing = await prisma.scheduleEvent.findUnique({
      where: { id: eventId },
    });
    if (!existing) throw notFoundError();

    const startsAt = new Date(data.startsAt);
    const endsAt = new Date(data.endsAt);
    const kartId = data.kartId ?? existing.kartId;

    if (kartId) {
      const kartConflict = await assertKartAvailable(
        kartId,
        startsAt,
        endsAt,
        eventId,
      );
      if (kartConflict) throw kartConflict;
    }

    const notes = data.reason
      ? [existing.notes, `Reagendado: ${data.reason}`].filter(Boolean).join("\n")
      : existing.notes;

    const event = await prisma.scheduleEvent.update({
      where: { id: eventId },
      data: {
        startsAt,
        endsAt,
        kartId,
        status: existing.status === "cancelado" ? "pendente" : "reagendado",
        notes,
      },
      include: scheduleEventInclude,
    });

    const category = await loadCategory(event.categoryId);
    return mapScheduleEventToDTO(event, category);
  },

  async swapKart(
    eventId: string,
    kartId: string,
    reason?: string,
  ) {
    const existing = await prisma.scheduleEvent.findUnique({
      where: { id: eventId },
    });
    if (!existing) throw notFoundError();

    const kartConflict = await assertKartAvailable(
      kartId,
      existing.startsAt,
      existing.endsAt,
      eventId,
    );
    if (kartConflict) throw kartConflict;

    const notes = reason
      ? [existing.notes, `Troca de kart: ${reason}`].filter(Boolean).join("\n")
      : existing.notes;

    const event = await prisma.scheduleEvent.update({
      where: { id: eventId },
      data: { kartId, notes },
      include: scheduleEventInclude,
    });

    const category = await loadCategory(event.categoryId);
    return mapScheduleEventToDTO(event, category);
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
