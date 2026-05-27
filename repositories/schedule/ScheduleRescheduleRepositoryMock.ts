import type { ScheduleEvent } from "@/lib/contracts/schedule";
import type { ScheduleTimeSlot } from "@/lib/contracts/settings";
import { NewClassRepositoryMock } from "@/repositories/schedule/NewClassRepositoryMock";
import { ScheduleBlocksRepositoryMock } from "@/repositories/schedule/ScheduleBlocksRepositoryMock";
import { ScheduleRepositoryMock } from "@/repositories/schedule/ScheduleRepositoryMock";
import { SettingsRepositoryMock } from "@/repositories/settings/SettingsRepositoryMock";

export type RescheduleSlotOption = {
  slot: ScheduleTimeSlot;
  label: string;
  available: boolean;
  reason?: string;
};

function categoryName(categoryId: string): string {
  return (
    SettingsRepositoryMock.getKartCategories().find((c) => c.id === categoryId)
      ?.name ?? categoryId
  );
}

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

function eventsAtSlot(
  events: ScheduleEvent[],
  date: string,
  slotStart: string,
): ScheduleEvent[] {
  const hour = slotStart.slice(0, 2);
  return events.filter(
    (e) =>
      e.date === date &&
      (e.start === slotStart || e.start.startsWith(`${hour}:`)),
  );
}

export const ScheduleRescheduleRepositoryMock = {
  getPilotCategoryIdsForEvent,
  getRescheduleSlotOptions(
    date: string,
    currentEventId: string,
    events: ScheduleEvent[] = ScheduleRepositoryMock.getEvents(),
    pilotCategoryIds?: string[],
  ): RescheduleSlotOption[] {
    let slots = ScheduleBlocksRepositoryMock.getAllScheduleSlotsForDate(date);
    if (pilotCategoryIds && pilotCategoryIds.length > 0) {
      const allowed = new Set(pilotCategoryIds);
      slots = slots.filter((s) => allowed.has(s.categoryId));
    }
    const blocked = ScheduleBlocksRepositoryMock.getBlockedSlotIdsForDate(date);

    return slots.map((slot) => {
      const label = `${slot.start} – ${slot.end} · ${categoryName(slot.categoryId)}`;
      if (blocked.has(slot.id)) {
        return { slot, label, available: false, reason: "Horário bloqueado" };
      }
      const atSlot = eventsAtSlot(events, date, slot.start).filter(
        (e) => e.id !== currentEventId,
      );
      if (atSlot.length > 0) {
        return {
          slot,
          label,
          available: false,
          reason: `Ocupado (${atSlot.map((e) => e.student).join(", ")})`,
        };
      }
      return { slot, label, available: true };
    });
  },
};
