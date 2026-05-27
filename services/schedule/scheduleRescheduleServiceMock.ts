import { ScheduleRescheduleRepositoryMock } from "@/repositories/schedule/ScheduleRescheduleRepositoryMock";

export const ScheduleRescheduleServiceMock = {
  getPilotCategoryIdsForEvent:
    ScheduleRescheduleRepositoryMock.getPilotCategoryIdsForEvent,
  getRescheduleSlotOptions: ScheduleRescheduleRepositoryMock.getRescheduleSlotOptions,
};

export type { RescheduleSlotOption } from "@/repositories/schedule/ScheduleRescheduleRepositoryMock";
