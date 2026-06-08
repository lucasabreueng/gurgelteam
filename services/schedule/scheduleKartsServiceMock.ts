import { createScheduleKartsService } from "@/services/schedule/scheduleKartsService";

/** @deprecated Use getAppServices().scheduleKarts */
export const ScheduleKartsServiceMock = createScheduleKartsService();

export type { KartSwapOption } from "@/services/schedule/scheduleKartsService";
