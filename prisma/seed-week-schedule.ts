import type { PrismaClient } from "@prisma/client";

import {
  WEEK_SCHEDULE,
  type WeekDayKey,
} from "../lib/admin-settings-mocks";
import {
  resolveCategoryIdsForDb,
  resolveLevelIdsForDb,
} from "../lib/schedule/schedule-slot-selection";

const DAY_KEY_TO_INDEX: Record<WeekDayKey, number> = {
  dom: 0,
  seg: 1,
  ter: 2,
  qua: 3,
  qui: 4,
  sex: 5,
  sab: 6,
};

function slotSeedId(dayOfWeek: number, sortOrder: number): string {
  const suffix = (dayOfWeek * 100 + sortOrder).toString(16).padStart(12, "0");
  return `00000000-0000-4000-8000-${suffix}`;
}

export async function seedWeekScheduleData(
  prisma: PrismaClient,
): Promise<void> {
  await prisma.weekScheduleSlot.deleteMany();

  const rows = WEEK_SCHEDULE.flatMap((day) =>
    day.slots.map((slot, sortOrder) => ({
      id: slotSeedId(DAY_KEY_TO_INDEX[day.dayKey], sortOrder),
      dayOfWeek: DAY_KEY_TO_INDEX[day.dayKey],
      startTime: slot.start,
      endTime: slot.end,
      categoryIds: resolveCategoryIdsForDb(slot.categoryIds),
      levelIds: resolveLevelIdsForDb(slot.levelIds),
      sortOrder,
    })),
  );

  if (rows.length === 0) return;

  await prisma.weekScheduleSlot.createMany({ data: rows });
}
