import { getDataSourceMode } from "@/lib/data-source/mode";
import {
  buildRescheduleSlotOptions,
  type RescheduleSlotOption,
} from "@/lib/schedule/reschedule-slot-options";
import { slotToDateTimeRange } from "@/lib/schedule/slot-datetime";
import type { ScheduleEvent } from "@/lib/contracts/schedule";
import type { ScheduleTimeSlot } from "@/lib/contracts/settings";
import { ScheduleBlocksRepositoryMock } from "@/repositories/schedule/ScheduleBlocksRepositoryMock";
import { ScheduleRepositoryHttp } from "@/repositories/schedule/ScheduleRepositoryHttp";
import { ScheduleRescheduleRepositoryMock } from "@/repositories/schedule/ScheduleRescheduleRepositoryMock";
import { createScheduleBlocksService } from "@/services/schedule/scheduleBlocksService";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

const scheduleBlocks = createScheduleBlocksService();

export function createScheduleRescheduleService() {
  return {
    getPilotCategoryIdsForEvent(event: ScheduleEvent): string[] {
      return ScheduleRescheduleRepositoryMock.getPilotCategoryIdsForEvent(event);
    },

    async getRescheduleSlotOptions(
      date: string,
      currentEventId: string,
      events: ScheduleEvent[],
      pilotCategoryIds?: string[],
    ): Promise<RescheduleSlotOption[]> {
      const [slots, blockedSlotIds] = await Promise.all([
        scheduleBlocks.getAllScheduleSlotsForDate(date),
        scheduleBlocks.getBlockedSlotIdsForDate(date),
      ]);

      return buildRescheduleSlotOptions({
        date,
        currentEventId,
        events,
        slots,
        blockedSlotIds,
        pilotCategoryIds,
      });
    },

    async rescheduleEvent(
      eventId: string,
      date: string,
      slot: ScheduleTimeSlot,
    ): Promise<ScheduleEvent | undefined> {
      if (isHttpMode()) {
        const { startsAt, endsAt } = slotToDateTimeRange(date, slot);
        return ScheduleRepositoryHttp.rescheduleEvent(eventId, {
          startsAt,
          endsAt,
        });
      }

      return undefined;
    },
  };
}

export type ScheduleRescheduleService = ReturnType<
  typeof createScheduleRescheduleService
>;

export type { RescheduleSlotOption };
