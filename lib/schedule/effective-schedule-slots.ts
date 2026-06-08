import type { ScheduleTimeSlot } from "@/lib/contracts/settings";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { getEffectiveScheduleSlotsForDate as getMockSlotsForDate } from "@/lib/admin-settings-mocks";
import {
  ScheduleSlotsRepositoryHttp,
  type DayScheduleSlots,
} from "@/repositories/schedule/ScheduleSlotsRepositoryHttp";

export function getEffectiveScheduleSlotsForDateSync(
  isoDate: string,
): ScheduleTimeSlot[] {
  return getMockSlotsForDate(isoDate);
}

export async function getDayScheduleForDate(
  isoDate: string,
): Promise<DayScheduleSlots> {
  if (getDataSourceMode() === "http") {
    return ScheduleSlotsRepositoryHttp.getDayScheduleForDate(isoDate);
  }
  return {
    slots: getEffectiveScheduleSlotsForDateSync(isoDate),
    configBlockedSlotIds: [],
  };
}

export async function getEffectiveScheduleSlotsForDate(
  isoDate: string,
): Promise<ScheduleTimeSlot[]> {
  const day = await getDayScheduleForDate(isoDate);
  return day.slots;
}
