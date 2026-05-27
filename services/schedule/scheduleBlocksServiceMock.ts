import { ScheduleBlocksRepositoryMock } from "@/repositories/schedule/ScheduleBlocksRepositoryMock";

export const ScheduleBlocksServiceMock = {
  getAllScheduleSlotsForDate:
    ScheduleBlocksRepositoryMock.getAllScheduleSlotsForDate,
  listScheduleBlocks: ScheduleBlocksRepositoryMock.listScheduleBlocks,
  getBlocksForDate: ScheduleBlocksRepositoryMock.getBlocksForDate,
  getBlockedSlotIdsForDate: ScheduleBlocksRepositoryMock.getBlockedSlotIdsForDate,
  isDateFullyBlocked: ScheduleBlocksRepositoryMock.isDateFullyBlocked,
  saveScheduleBlock: ScheduleBlocksRepositoryMock.saveScheduleBlock,
  removeScheduleBlock: ScheduleBlocksRepositoryMock.removeScheduleBlock,
  clearBlocksForDate: ScheduleBlocksRepositoryMock.clearBlocksForDate,
};

export type { ScheduleBlockEntry } from "@/repositories/schedule/ScheduleBlocksRepositoryMock";
