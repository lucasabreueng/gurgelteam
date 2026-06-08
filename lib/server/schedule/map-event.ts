import type {
  Kart,
  KartCategory,
  Client,
  ScheduleEvent,
  User,
} from "@prisma/client";

import {
  EVENT_STATUS_LABELS,
  EVENT_TYPE_LABELS,
} from "@/lib/admin-schedule-mocks";
import type { ScheduleEventDTO } from "@/lib/contracts/api/v1/schedule.api.schemas";
import type {
  PaymentStatus,
  ScheduleEventStatus,
  ScheduleEventType,
} from "@/lib/contracts/enums";

export type ScheduleEventRelations = ScheduleEvent & {
  client?: Client | null;
  registeredBy?: User | null;
  kart?: (Kart & { category?: KartCategory | null }) | null;
  category?: KartCategory | null;
};

export function toIsoDateTime(date: Date): string {
  return date.toISOString();
}

export function mapScheduleEventToDTO(
  event: ScheduleEventRelations,
  category?: KartCategory | null,
): ScheduleEventDTO {
  const resolvedCategory = category ?? event.category ?? event.kart?.category;
  const registeredByName = event.registeredBy
    ? `${event.registeredBy.firstName} ${event.registeredBy.lastName}`.trim()
    : null;

  return {
    id: event.id,
    startsAt: toIsoDateTime(event.startsAt),
    endsAt: toIsoDateTime(event.endsAt),
    type: event.type as ScheduleEventType,
    typeLabel: EVENT_TYPE_LABELS[event.type as ScheduleEventType],
    status: event.status as ScheduleEventStatus,
    clientId: event.clientId,
    clientName: event.client?.name ?? null,
    registeredById: event.registeredById,
    registeredByName,
    kartId: event.kartId,
    kartNumber: event.kart?.number ?? null,
    categoryId: event.categoryId,
    categoryLabel: resolvedCategory?.name ?? null,
    paymentStatus: (event.paymentStatus as PaymentStatus | null) ?? null,
    maxStudents: event.maxStudents,
    notes: event.notes,
    createdAt: toIsoDateTime(event.createdAt),
    updatedAt: toIsoDateTime(event.updatedAt),
  };
}

export function getEventStatusLabel(status: ScheduleEventStatus): string {
  return EVENT_STATUS_LABELS[status];
}

export function getEventTypeLabel(type: ScheduleEventType): string {
  return EVENT_TYPE_LABELS[type];
}

export function combineNotes(
  notes?: string | null,
  objective?: string | null,
): string | null {
  const parts = [notes?.trim(), objective?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join("\n") : null;
}

export const scheduleEventInclude = {
  client: true,
  registeredBy: true,
  kart: { include: { category: true } },
} as const;

export function parseDateRange(from?: string, to?: string) {
  const startsAt: { gte?: Date; lte?: Date } = {};
  if (from) {
    startsAt.gte = new Date(`${from}T00:00:00.000-03:00`);
  }
  if (to) {
    startsAt.lte = new Date(`${to}T23:59:59.999-03:00`);
  }
  return startsAt;
}

export function toScheduleTimestamp(date: string, time: string): Date {
  return new Date(`${date}T${time}:00.000-03:00`);
}
