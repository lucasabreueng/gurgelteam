import type { Prisma } from "@prisma/client";

import type {
  ScheduleException,
  SpecificDateSchedule,
  WeekDaySchedule,
} from "@/lib/admin-settings-mocks";
import { mapScheduleSlotRecordToUi } from "@/lib/schedule/map-schedule-slot-dto";
import {
  resolveCategoryIdsForDb,
  resolveLevelIdsForDb,
} from "@/lib/schedule/schedule-slot-selection";
import { prisma } from "@/lib/server/prisma";
import {
  dbDateToIsoDate,
  isoDateToDbDate,
  resolvePersistedId,
} from "@/lib/server/schedule/schedule-hours-utils";
import { weekScheduleRepository } from "@/lib/server/schedule/week-schedule-repository";

export type ScheduleHoursConfig = {
  days: WeekDaySchedule[];
  specificDates: SpecificDateSchedule[];
  exceptions: ScheduleException[];
};

type Tx = Prisma.TransactionClient;

async function listSpecificDateSchedules(
  tx: Tx | typeof prisma = prisma,
): Promise<SpecificDateSchedule[]> {
  const rows = await tx.specificDateSchedule.findMany({
    include: {
      slots: {
        orderBy: [{ sortOrder: "asc" }, { startTime: "asc" }],
      },
    },
    orderBy: { scheduleDate: "asc" },
  });

  return rows.map((row) => ({
    id: row.id,
    date: dbDateToIsoDate(row.scheduleDate),
    slots: row.slots.map((slot) =>
      mapScheduleSlotRecordToUi({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        categoryIds: slot.categoryIds,
        levelIds: slot.levelIds,
      }),
    ),
  }));
}

async function listScheduleExceptions(
  tx: Tx | typeof prisma = prisma,
): Promise<ScheduleException[]> {
  const rows = await tx.scheduleException.findMany({
    orderBy: [{ exceptionDate: "asc" }, { id: "asc" }],
  });

  return rows.map((row) => ({
    id: row.id,
    date: dbDateToIsoDate(row.exceptionDate),
    slotIds: [...row.slotIds],
    reason: row.reason ?? "",
  }));
}

async function replaceSpecificDateSchedules(
  specificDates: SpecificDateSchedule[],
  tx: Tx,
): Promise<void> {
  await tx.specificDateScheduleSlot.deleteMany();
  await tx.specificDateSchedule.deleteMany();

  for (const schedule of specificDates) {
    const scheduleId = resolvePersistedId(schedule.id);
    await tx.specificDateSchedule.create({
      data: {
        id: scheduleId,
        scheduleDate: isoDateToDbDate(schedule.date),
        slots: {
          create: schedule.slots.map((slot, sortOrder) => ({
            id: resolvePersistedId(slot.id),
            startTime: slot.start,
            endTime: slot.end,
            categoryIds: resolveCategoryIdsForDb(slot.categoryIds),
            levelIds: resolveLevelIdsForDb(slot.levelIds),
            sortOrder,
          })),
        },
      },
    });
  }
}

async function replaceScheduleExceptions(
  exceptions: ScheduleException[],
  tx: Tx,
): Promise<void> {
  await tx.scheduleException.deleteMany();

  if (exceptions.length === 0) return;

  await tx.scheduleException.createMany({
    data: exceptions.map((exception) => ({
      id: resolvePersistedId(exception.id),
      exceptionDate: isoDateToDbDate(exception.date),
      slotIds: exception.slotIds,
      reason: exception.reason,
    })),
  });
}

export const scheduleHoursRepository = {
  async getConfig(): Promise<ScheduleHoursConfig> {
    const [days, specificDates, exceptions] = await Promise.all([
      weekScheduleRepository.getWeekSchedule(),
      listSpecificDateSchedules(),
      listScheduleExceptions(),
    ]);
    return { days, specificDates, exceptions };
  },

  async replaceConfig(config: ScheduleHoursConfig): Promise<ScheduleHoursConfig> {
    await prisma.$transaction(async (tx) => {
      await weekScheduleRepository.replaceWeekSchedule(config.days, tx);
      await replaceSpecificDateSchedules(config.specificDates, tx);
      await replaceScheduleExceptions(config.exceptions, tx);
    });
    return scheduleHoursRepository.getConfig();
  },

  listSpecificDateSchedules,
  listScheduleExceptions,
};
