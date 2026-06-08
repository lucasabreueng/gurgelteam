import type { ScheduleEvent } from "@/lib/contracts/schedule";
import type { ScheduleTimeSlot } from "@/lib/contracts/settings";
import { SettingsRepositoryMock } from "@/repositories/settings/SettingsRepositoryMock";
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
  return formatScheduleCategoryLabels(
    categoryIds,
    SettingsRepositoryMock.getKartCategories(),
  );
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

export function buildRescheduleSlotOptions(input: {
  date: string;
  currentEventId: string;
  events: ScheduleEvent[];
  slots: ScheduleTimeSlot[];
  blockedSlotIds: Set<string>;
  pilotCategoryIds?: string[];
}): RescheduleSlotOption[] {
  const currentEvent = input.events.find((e) => e.id === input.currentEventId);

  let slots = input.slots;
  if (input.pilotCategoryIds && input.pilotCategoryIds.length > 0) {
    slots = slots.filter((s) => slotMatchesAnyCategory(s, input.pilotCategoryIds!));
  }

  return slots
    .filter((slot) => {
      if (!currentEvent) return true;
      return !(
        input.date === currentEvent.date && slot.start === currentEvent.start
      );
    })
    .map((slot) => {
      const label = `${slot.start} – ${slot.end} · ${categoryName(slot.categoryIds)}`;
      if (input.blockedSlotIds.has(slot.id)) {
        return { slot, label, available: false, reason: "Horário bloqueado" };
      }
      const atSlot = eventsAtSlot(input.events, input.date, slot.start).filter(
        (e) => e.id !== input.currentEventId,
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
