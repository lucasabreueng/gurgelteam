import type { ScheduleEvent } from "@/lib/contracts/schedule";
import type { ScheduleTimeSlot } from "@/lib/contracts/settings";
import type { TimelineRow } from "@/lib/admin-schedule-mocks";
import { getEventsForDate } from "@/lib/admin-schedule-mocks";
import { formatScheduleCategoryLabels, formatScheduleLevelLabels } from "@/lib/schedule/schedule-slot-selection";
import { KART_CATEGORIES, SKILL_LEVELS } from "@/lib/admin-settings-mocks";

function eventsAtSlotStart(
  dayEvents: ScheduleEvent[],
  slotStart: string,
  used: Set<string>,
): ScheduleEvent[] {
  return dayEvents.filter((event) => {
    if (used.has(event.id)) return false;
    return event.start === slotStart;
  });
}

/**
 * Monta a timeline do dia a partir da grade efetiva (configuração / API).
 * Só exibe horários cadastrados na grade semanal ou data específica.
 */
export function buildDayTimelineFromSlots(
  date: string,
  events: ScheduleEvent[],
  slots: ScheduleTimeSlot[],
): TimelineRow[] {
  const dayEvents = getEventsForDate(events, date);
  const used = new Set<string>();
  const rows: TimelineRow[] = [];

  const sortedSlots = [...slots].sort((a, b) => a.start.localeCompare(b.start));

  for (const slot of sortedSlots) {
    const atSlot = eventsAtSlotStart(dayEvents, slot.start, used);

    if (atSlot.length > 0) {
      atSlot.forEach((event) => used.add(event.id));
      rows.push({ kind: "event", time: atSlot[0].start, events: atSlot });
      continue;
    }

    rows.push({
      kind: "free",
      time: slot.start,
      category: formatScheduleCategoryLabels(slot.categoryIds, KART_CATEGORIES),
      level: formatScheduleLevelLabels(slot.levelIds, SKILL_LEVELS),
    });
  }

  for (const event of dayEvents) {
    if (used.has(event.id)) continue;
    used.add(event.id);
    rows.push({ kind: "event", time: event.start, events: [event] });
  }

  return rows.sort((a, b) => a.time.localeCompare(b.time));
}
