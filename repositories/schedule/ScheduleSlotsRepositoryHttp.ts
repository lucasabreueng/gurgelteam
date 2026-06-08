import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { scheduleApiPaths } from "@/lib/api/schedule-api-paths";
import type { ScheduleSlotsForDateDTO } from "@/lib/contracts/api/v1/schedule.api.schemas";
import type { ScheduleTimeSlot } from "@/lib/contracts/settings";

export type DayScheduleSlots = {
  slots: ScheduleTimeSlot[];
  configBlockedSlotIds: string[];
};

export const ScheduleSlotsRepositoryHttp = {
  async getDayScheduleForDate(isoDate: string): Promise<DayScheduleSlots> {
    const res = await apiFetch<ScheduleSlotsForDateDTO>(
      `${scheduleApiPaths.slots}?date=${encodeURIComponent(isoDate)}`,
    );
    const data = unwrapApiResponse(res);
    return {
      slots: data.slots,
      configBlockedSlotIds: data.configBlockedSlotIds ?? [],
    };
  },

  async getSlotsForDate(isoDate: string): Promise<ScheduleTimeSlot[]> {
    const day = await ScheduleSlotsRepositoryHttp.getDayScheduleForDate(isoDate);
    return day.slots;
  },
};
