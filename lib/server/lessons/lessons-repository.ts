import type { LessonStatus as PrismaLessonStatus } from "@prisma/client";

import { addDays, format } from "date-fns";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import type {
  LessonRegistrationQuery,
  LessonRegistrationRequest,
} from "@/lib/contracts/api/v1/lessons.api.schemas";
import { prisma } from "@/lib/server/prisma";
import {
  dayBounds,
  LESSON_SCHEDULE_TYPES,
  lessonSessionInclude,
  mapLessonSessionToDTO,
  mapScheduleStatusToLesson,
  parseLapTimeMs,
  resolveRegisteredByName,
  resolveTypeLabel,
} from "@/lib/server/lessons/map-lesson";

function notFoundError(): ApiError {
  return {
    code: API_ERROR_CODES.NOT_FOUND,
    message: "Sessão de aula não encontrada.",
    httpStatus: 404,
  };
}

function businessRuleError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.BUSINESS_RULE,
    message,
    httpStatus: 422,
  };
}

async function loadCategoryLabels(
  categoryIds: string[],
): Promise<Map<string, string>> {
  if (!categoryIds.length) return new Map();
  const categories = await prisma.kartCategory.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true },
  });
  return new Map(categories.map((c) => [c.id, c.name]));
}

async function syncLessonSessionsForDateRange(
  fromDate: string,
  days: number,
): Promise<void> {
  const start = new Date(`${fromDate}T12:00:00`);
  const endDate = format(addDays(start, days - 1), "yyyy-MM-dd");
  const rangeStart = dayBounds(fromDate).gte;
  const rangeEnd = dayBounds(endDate).lte;

  const events = await prisma.scheduleEvent.findMany({
    where: {
      startsAt: { gte: rangeStart, lte: rangeEnd },
      type: { in: [...LESSON_SCHEDULE_TYPES] },
    },
    include: {
      client: true,
      kart: true,
      registeredBy: true,
    },
  });

  if (!events.length) return;

  const categoryIds = [
    ...new Set(events.map((e) => e.categoryId).filter(Boolean)),
  ] as string[];
  const categoryById = await loadCategoryLabels(categoryIds);

  await prisma.$transaction(
    events.map((event) => {
      const categoryLabel = event.categoryId
        ? (categoryById.get(event.categoryId) ?? "—")
        : "—";
      const status = mapScheduleStatusToLesson(event.status);

      return prisma.lessonSession.upsert({
        where: { scheduleEventId: event.id },
        update: {
          clientId: event.clientId,
          categoryLabel,
          typeLabel: resolveTypeLabel(event.type),
          kartNumber: event.kart?.number ?? 0,
          objective: event.notes,
        },
        create: {
          scheduleEventId: event.id,
          clientId: event.clientId,
          status: status as PrismaLessonStatus,
          categoryLabel,
          typeLabel: resolveTypeLabel(event.type),
          registeredByName: resolveRegisteredByName(event.registeredBy),
          kartNumber: event.kart?.number ?? 0,
          objective: event.notes,
        },
      });
    }),
  );
}

export async function syncLessonSessionsForDate(date: string): Promise<void> {
  await syncLessonSessionsForDateRange(date, 1);
}

function matchesStatusFilter(
  status: string,
  filter: LessonRegistrationQuery["statusFilter"],
): boolean {
  if (!filter) return true;
  if (filter === "pendentes") {
    return status === "aguardando" || status === "pendente_registro";
  }
  if (filter === "em_andamento") return status === "em_andamento";
  if (filter === "concluidas") return status === "concluida";
  return true;
}

export const lessonsRepository = {
  async listSessions(query: LessonRegistrationQuery) {
    const days = query.days ?? 1;
    await syncLessonSessionsForDateRange(query.date, days);

    const endDate =
      days > 1
        ? format(addDays(new Date(`${query.date}T12:00:00`), days - 1), "yyyy-MM-dd")
        : query.date;
    const rangeStart = dayBounds(query.date).gte;
    const rangeEnd = dayBounds(endDate).lte;

    const sessions = await prisma.lessonSession.findMany({
      where: {
        scheduleEvent: {
          startsAt: { gte: rangeStart, lte: rangeEnd },
        },
        ...(query.category
          ? { categoryLabel: { equals: query.category, mode: "insensitive" } }
          : {}),
        ...(query.search.trim()
          ? {
              OR: [
                {
                  client: {
                    name: {
                      contains: query.search.trim(),
                      mode: "insensitive",
                    },
                  },
                },
                {
                  typeLabel: {
                    contains: query.search.trim(),
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      include: lessonSessionInclude,
      orderBy: { scheduleEvent: { startsAt: "asc" } },
    });

    return sessions
      .map(mapLessonSessionToDTO)
      .filter((session) => matchesStatusFilter(session.status, query.statusFilter));
  },

  async getSessionById(sessionId: string) {
    const session = await prisma.lessonSession.findUnique({
      where: { id: sessionId },
      include: lessonSessionInclude,
    });
    if (!session) return null;
    return mapLessonSessionToDTO(session);
  },

  async startSession(sessionId: string, kartId?: string) {
    const session = await prisma.lessonSession.findUnique({
      where: { id: sessionId },
      include: lessonSessionInclude,
    });
    if (!session) throw notFoundError();

    if (session.status === "concluida") {
      throw businessRuleError("Aula já concluída.");
    }

    if (kartId) {
      await prisma.scheduleEvent.update({
        where: { id: session.scheduleEventId },
        data: { kartId },
      });
      const kart = await prisma.kart.findUnique({ where: { id: kartId } });
      if (kart) {
        await prisma.lessonSession.update({
          where: { id: sessionId },
          data: { kartNumber: kart.number },
        });
      }
    }

    await prisma.scheduleEvent.update({
      where: { id: session.scheduleEventId },
      data: { status: "em_andamento" },
    });

    const updated = await prisma.lessonSession.update({
      where: { id: sessionId },
      data: { status: "em_andamento" },
      include: lessonSessionInclude,
    });

    return mapLessonSessionToDTO(updated);
  },

  async registerSession(sessionId: string, data: LessonRegistrationRequest) {
    const session = await prisma.lessonSession.findUnique({
      where: { id: sessionId },
      include: lessonSessionInclude,
    });
    if (!session) throw notFoundError();

    if (!data.laps.length) {
      throw businessRuleError("Informe ao menos uma volta.");
    }

    const hasNotes = Object.values(data.notes).some((value) => value.trim());
    if (!hasNotes) {
      throw businessRuleError("Preencha ao menos um campo de observações.");
    }

    const payload = {
      laps: data.laps,
      notes: data.notes,
      method: data.method,
      telemetrySessionId: data.telemetrySessionId ?? null,
      registeredAt: new Date().toISOString(),
    };

    const updated = await prisma.lessonSession.update({
      where: { id: sessionId },
      data: {
        status: "concluida",
        registrationPayload: payload,
        previousNote: data.notes.general || data.notes.recommendations || null,
      },
      include: lessonSessionInclude,
    });

    await prisma.scheduleEvent.update({
      where: { id: session.scheduleEventId },
      data: { status: "finalizado" },
    });

    if (session.clientId) {
      const lapTimes = data.laps
        .map((lap) => parseLapTimeMs(lap.total))
        .filter((value): value is number => value !== null);
      const bestLapMs =
        lapTimes.length > 0 ? Math.min(...lapTimes) : null;

      const client = await prisma.client.findUnique({
        where: { id: session.clientId },
      });

      if (client) {
        await prisma.client.update({
          where: { id: session.clientId },
          data: {
            totalSessions: client.totalSessions + 1,
            ...(bestLapMs &&
            (client.bestLapMs == null || bestLapMs < client.bestLapMs)
              ? { bestLapMs }
              : {}),
          },
        });
      }
    }

    return {
      sessionId: updated.id,
      status: updated.status,
      lapsCount: data.laps.length,
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
