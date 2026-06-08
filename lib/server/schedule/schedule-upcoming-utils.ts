import { addDays, format, parseISO } from "date-fns";

import { TIME_SLOTS } from "@/lib/admin-schedule-mocks";
import { prisma } from "@/lib/server/prisma";
import {
  dbDateToIsoDate,
  isoDateToDbDate,
} from "@/lib/server/schedule/schedule-hours-utils";

function dayOfWeekFromIsoDate(isoDate: string): number | null {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.getDay();
}

type BookingCountRow = {
  event_date: Date;
  count: bigint;
};

/** Contagem de eventos ativos por data (fuso America/Sao_Paulo) em uma única query. */
export async function loadBookingCountByDate(
  from: string,
  days: number,
): Promise<Map<string, number>> {
  const start = parseISO(from);
  const endDateStr = format(addDays(start, days - 1), "yyyy-MM-dd");
  const rangeStart = new Date(`${from}T00:00:00.000-03:00`);
  const rangeEnd = new Date(`${endDateStr}T23:59:59.999-03:00`);

  // Alinhado a AGENDA_NON_OPERATIONAL_STATUSES em schedule-event-filters.ts
  const rows = await prisma.$queryRaw<BookingCountRow[]>`
    SELECT
      (starts_at AT TIME ZONE 'America/Sao_Paulo')::date AS event_date,
      COUNT(*)::bigint AS count
    FROM schedule_events
    WHERE starts_at >= ${rangeStart}
      AND starts_at <= ${rangeEnd}
      AND status NOT IN ('cancelado', 'reagendado', 'finalizado')
    GROUP BY 1
  `;

  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(dbDateToIsoDate(row.event_date), Number(row.count));
  }
  return map;
}

/** Capacidade efetiva de slots por data (grade semanal / específica − exceções). */
export async function loadSlotCapacityByDateRange(
  from: string,
  days: number,
): Promise<Map<string, number>> {
  const start = parseISO(from);
  const dateKeys = Array.from({ length: days }, (_, i) =>
    format(addDays(start, i), "yyyy-MM-dd"),
  );
  const endDateStr = dateKeys[dateKeys.length - 1]!;

  const [weekSlots, specificSchedules, exceptions] = await Promise.all([
    prisma.weekScheduleSlot.findMany({ select: { id: true, dayOfWeek: true } }),
    prisma.specificDateSchedule.findMany({
      where: {
        scheduleDate: {
          gte: isoDateToDbDate(from),
          lte: isoDateToDbDate(endDateStr),
        },
      },
      include: { slots: { select: { id: true } } },
    }),
    prisma.scheduleException.findMany({
      where: {
        exceptionDate: {
          gte: isoDateToDbDate(from),
          lte: isoDateToDbDate(endDateStr),
        },
      },
    }),
  ]);

  const weekSlotsByDow = new Map<number, string[]>();
  for (const slot of weekSlots) {
    const list = weekSlotsByDow.get(slot.dayOfWeek) ?? [];
    list.push(slot.id);
    weekSlotsByDow.set(slot.dayOfWeek, list);
  }

  const specificSlotIdsByDate = new Map<string, string[]>();
  for (const schedule of specificSchedules) {
    specificSlotIdsByDate.set(
      dbDateToIsoDate(schedule.scheduleDate),
      schedule.slots.map((slot) => slot.id),
    );
  }

  const blockedByDate = new Map<string, Set<string>>();
  for (const exception of exceptions) {
    const dateKey = dbDateToIsoDate(exception.exceptionDate);
    const blocked = blockedByDate.get(dateKey) ?? new Set<string>();
    for (const slotId of exception.slotIds) {
      blocked.add(slotId);
    }
    blockedByDate.set(dateKey, blocked);
  }

  const fallbackCapacity = TIME_SLOTS.length;
  const result = new Map<string, number>();

  for (const date of dateKeys) {
    const specificIds = specificSlotIdsByDate.get(date);
    let slotIds: string[];

    if (specificIds) {
      slotIds = specificIds;
    } else {
      const dow = dayOfWeekFromIsoDate(date);
      slotIds = dow === null ? [] : (weekSlotsByDow.get(dow) ?? []);
    }

    const blocked = blockedByDate.get(date) ?? new Set<string>();
    const capacity = slotIds.filter((id) => !blocked.has(id)).length;
    result.set(date, capacity > 0 ? capacity : fallbackCapacity);
  }

  return result;
}
