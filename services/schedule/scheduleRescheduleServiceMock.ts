import { createScheduleRescheduleService } from "@/services/schedule/scheduleRescheduleService";

/** @deprecated Use getAppServices().scheduleReschedule */
export const ScheduleRescheduleServiceMock = createScheduleRescheduleService();

export type { RescheduleSlotOption } from "@/services/schedule/scheduleRescheduleService";
