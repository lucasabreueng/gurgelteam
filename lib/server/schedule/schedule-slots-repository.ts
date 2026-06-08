import type { WeekDayKey } from "@/lib/admin-settings-mocks";

import type { ScheduleTimeSlot } from "@/lib/contracts/settings";

import { mapScheduleSlotRecordToUi } from "@/lib/schedule/map-schedule-slot-dto";

import { prisma } from "@/lib/server/prisma";

import { isoDateToDbDate } from "@/lib/server/schedule/schedule-hours-utils";

const WEEK_DAY_KEYS: WeekDayKey[] = [
  "dom",
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
  "sab",
];

function dayOfWeekFromIsoDate(isoDate: string): number | null {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.getDay();
}

async function loadRawSlotsForDate(isoDate: string): Promise<ScheduleTimeSlot[]> {
  const dbDate = isoDateToDbDate(isoDate);

  const specific = await prisma.specificDateSchedule.findUnique({
    where: { scheduleDate: dbDate },
    include: {
      slots: {
        orderBy: [{ sortOrder: "asc" }, { startTime: "asc" }],
      },
    },
  });

  if (specific) {
    return specific.slots.map((row) =>
      mapScheduleSlotRecordToUi({
        id: row.id,
        startTime: row.startTime,
        endTime: row.endTime,
        categoryIds: row.categoryIds,
        levelIds: row.levelIds,
      }),
    );
  }

  const dayOfWeek = dayOfWeekFromIsoDate(isoDate);
  if (dayOfWeek === null) return [];

  const rows = await prisma.weekScheduleSlot.findMany({
    where: { dayOfWeek },
    orderBy: [{ sortOrder: "asc" }, { startTime: "asc" }],
  });

  return rows.map((row) =>
    mapScheduleSlotRecordToUi({
      id: row.id,
      startTime: row.startTime,
      endTime: row.endTime,
      categoryIds: row.categoryIds,
      levelIds: row.levelIds,
    }),
  );
}

async function loadConfigBlockedSlotIds(isoDate: string): Promise<string[]> {
  const dbDate = isoDateToDbDate(isoDate);
  const exceptions = await prisma.scheduleException.findMany({
    where: { exceptionDate: dbDate },
  });
  return [...new Set(exceptions.flatMap((exception) => exception.slotIds))];
}

export type DayScheduleForDate = {
  slots: ScheduleTimeSlot[];
  configBlockedSlotIds: string[];
};

export const scheduleSlotsRepository = {
  async getDayScheduleForDate(isoDate: string): Promise<DayScheduleForDate> {
    const [slots, configBlockedSlotIds] = await Promise.all([
      loadRawSlotsForDate(isoDate),
      loadConfigBlockedSlotIds(isoDate),
    ]);

    return {
      slots: slots.sort((a, b) => a.start.localeCompare(b.start)),
      configBlockedSlotIds,
    };
  },

  /** @deprecated Prefer `getDayScheduleForDate` — retorna só slots (grade completa). */
  async getSlotsForDate(isoDate: string): Promise<ScheduleTimeSlot[]> {
    const { slots } = await this.getDayScheduleForDate(isoDate);
    return slots;
  },

  weekDayKeyFromDate(isoDate: string): WeekDayKey | null {
    const dayOfWeek = dayOfWeekFromIsoDate(isoDate);
    if (dayOfWeek === null) return null;
    return WEEK_DAY_KEYS[dayOfWeek] ?? null;
  },
};
