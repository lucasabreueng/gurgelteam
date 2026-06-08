import { createScheduleBlocksService } from "@/services/schedule/scheduleBlocksService";

/** @deprecated Use getAppServices().scheduleBlocks */
export const ScheduleBlocksServiceMock = createScheduleBlocksService();

export type { ScheduleBlockEntry } from "@/services/schedule/scheduleBlocksService";
