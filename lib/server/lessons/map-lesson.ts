import type {
  Client,
  LessonSession,
  ScheduleEvent,
  User,
  Kart,
} from "@prisma/client";

import { EVENT_TYPE_LABELS } from "@/lib/admin-schedule-mocks";
import type {
  LessonRegistrationPayloadApiDTO,
  LessonSessionApiDTO,
} from "@/lib/contracts/api/v1/lessons.api.schemas";
import type { ScheduleEventType } from "@/lib/contracts/enums";

type LessonStatusValue = LessonSessionApiDTO["status"];

function parseRegistrationPayload(
  raw: unknown,
): LessonSessionApiDTO["registration"] {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as LessonRegistrationPayloadApiDTO;
  if (!Array.isArray(payload.laps) || !payload.notes || !payload.method) {
    return null;
  }
  return {
    laps: payload.laps,
    notes: payload.notes,
    method: payload.method,
    telemetrySessionId: payload.telemetrySessionId ?? null,
    registeredAt: payload.registeredAt ?? new Date().toISOString(),
  };
}

export const LESSON_SCHEDULE_TYPES = [
  "aula_individual",
  "aula_grupo",
  "treino_livre",
  "treino_avancado",
] as const;

export type LessonScheduleEventType = (typeof LESSON_SCHEDULE_TYPES)[number];

export type LessonSessionWithRelations = LessonSession & {
  client?: Client | null;
  scheduleEvent: ScheduleEvent & {
    kart?: Kart | null;
    registeredBy?: User | null;
  };
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

export function mapScheduleStatusToLesson(
  scheduleStatus: string,
  lessonStatus?: string,
): LessonStatusValue {
  if (lessonStatus === "concluida" || lessonStatus === "cancelada") {
    return lessonStatus as LessonStatusValue;
  }
  if (scheduleStatus === "finalizado") return "pendente_registro" as LessonStatusValue;
  if (scheduleStatus === "em_andamento") return "em_andamento" as LessonStatusValue;
  if (scheduleStatus === "cancelado") return "cancelada" as LessonStatusValue;
  return "aguardando" as LessonStatusValue;
}

export function mapLessonSessionToDTO(
  session: LessonSessionWithRelations,
): LessonSessionApiDTO {
  const event = session.scheduleEvent;
  return {
    id: session.id,
    scheduleEventId: session.scheduleEventId,
    clientId: session.clientId,
    studentName: session.client?.name ?? "—",
    date: formatDate(event.startsAt),
    start: formatTime(event.startsAt),
    end: formatTime(event.endsAt),
    category: session.categoryLabel,
    typeLabel: session.typeLabel,
    registeredByName: session.registeredByName,
    kartNumber: session.kartNumber,
    status: session.status as LessonStatusValue,
    objective: session.objective,
    previousNote: session.previousNote,
    registration: parseRegistrationPayload(session.registrationPayload),
  };
}

export function resolveRegisteredByName(
  registeredBy?: User | null,
): string {
  if (!registeredBy) return "Gurgel Team";
  return `${registeredBy.firstName} ${registeredBy.lastName}`.trim();
}

export function resolveTypeLabel(type: string): string {
  return EVENT_TYPE_LABELS[type as ScheduleEventType] ?? type;
}

export const lessonSessionInclude = {
  client: true,
  scheduleEvent: {
    include: {
      kart: true,
      registeredBy: true,
    },
  },
} as const;

export function parseLapTimeMs(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;

  if (normalized.includes(":")) {
    const [minPart, secPart] = normalized.split(":");
    const minutes = Number.parseInt(minPart ?? "0", 10);
    const seconds = Number.parseFloat(secPart ?? "0");
    if (Number.isNaN(minutes) || Number.isNaN(seconds)) return null;
    return Math.round((minutes * 60 + seconds) * 1000);
  }

  const seconds = Number.parseFloat(normalized);
  if (Number.isNaN(seconds)) return null;
  return Math.round(seconds * 1000);
}

export function dayBounds(date: string) {
  return {
    gte: new Date(`${date}T00:00:00.000-03:00`),
    lte: new Date(`${date}T23:59:59.999-03:00`),
  };
}
