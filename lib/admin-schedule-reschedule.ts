import {
  getAllScheduleSlotsForDate,
  getBlockedSlotIdsForDate,
} from "./admin-schedule-blocks";
import { NewClassServiceMock } from "@/services/schedule/newClassServiceMock";
import {
  KART_CATEGORIES,
  type ScheduleTimeSlot,
} from "./admin-settings-mocks";
import {
  SCHEDULE_EVENTS,
  type ScheduleEvent,
} from "./admin-schedule-mocks";
import {
  formatScheduleCategoryLabels,
  slotMatchesAnyCategory,
} from "@/lib/schedule/schedule-slot-selection";

export type RescheduleSlotOption = {
  slot: ScheduleTimeSlot;
  label: string;
  available: boolean;
  reason?: string;
};

function categoryName(categoryIds: string[]): string {
  return formatScheduleCategoryLabels(categoryIds, KART_CATEGORIES);
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

/** Categorias da grade em que o piloto pode remarcar. */
export function getPilotCategoryIdsForEvent(event: ScheduleEvent): string[] {
  const student = NewClassServiceMock.getStudents().find(
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

export function getRescheduleSlotOptions(
  date: string,
  currentEventId: string,
  events: ScheduleEvent[] = SCHEDULE_EVENTS,
  pilotCategoryIds?: string[],
): RescheduleSlotOption[] {
  let slots = getAllScheduleSlotsForDate(date);
  if (pilotCategoryIds && pilotCategoryIds.length > 0) {
    slots = slots.filter((s) => slotMatchesAnyCategory(s, pilotCategoryIds));
  }
  const blocked = getBlockedSlotIdsForDate(date);

  return slots.map((slot) => {
    const label = `${slot.start} – ${slot.end} · ${categoryName(slot.categoryIds)}`;
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
}
