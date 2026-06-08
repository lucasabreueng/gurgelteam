import type { ScheduleEvent } from "@/lib/contracts/schedule";
import { buildRescheduleSlotOptions } from "@/lib/schedule/reschedule-slot-options";
import { NewClassRepositoryMock } from "@/repositories/schedule/NewClassRepositoryMock";
import { ScheduleBlocksRepositoryMock } from "@/repositories/schedule/ScheduleBlocksRepositoryMock";
import { ScheduleRepositoryMock } from "@/repositories/schedule/ScheduleRepositoryMock";

export type { RescheduleSlotOption } from "@/lib/schedule/reschedule-slot-options";

function eventCategoryToSlotIds(category?: string): string[] {
  if (!category) return [];
  const normalized = category.toLowerCase();
  const map: Record<string, string[]> = {
    "125cc": ["125cc"],
    cadete: ["mirim-cadete"],
    f400: ["f400"],
    competicao: ["f400", "125cc"],
    rental: ["mirim-cadete", "f400", "125cc"],
  };
  return map[normalized] ?? [];
}

function getPilotCategoryIdsForEvent(event: ScheduleEvent): string[] {
  const student = NewClassRepositoryMock.getStudents().find(
    (s) => s.name.toLowerCase() === event.student.toLowerCase(),
  );
  if (student?.allowedCategoryIds.length) {
    return student.allowedCategoryIds;
  }
  return eventCategoryToSlotIds(event.category);
}

export const ScheduleRescheduleRepositoryMock = {
  getPilotCategoryIdsForEvent,

  getRescheduleSlotOptions(
    date: string,
    currentEventId: string,
    events: ScheduleEvent[] = ScheduleRepositoryMock.getEvents(),
    pilotCategoryIds?: string[],
  ) {
    const slots = ScheduleBlocksRepositoryMock.getAllScheduleSlotsForDate(date);
    const blockedSlotIds =
      ScheduleBlocksRepositoryMock.getBlockedSlotIdsForDate(date);

    return buildRescheduleSlotOptions({
      date,
      currentEventId,
      events,
      slots,
      blockedSlotIds,
      pilotCategoryIds,
    });
  },
};
