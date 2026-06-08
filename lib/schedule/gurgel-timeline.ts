import type { ScheduleEvent } from "@/lib/contracts/schedule";
import type { ScheduleTimeSlot } from "@/lib/contracts/settings";
import {
  formatScheduleDuration,
  getEffectiveScheduleSlotsForDate,
  KART_CATEGORIES,
  scheduleSlotDurationMinutes,
  SKILL_LEVELS,
} from "@/lib/admin-settings-mocks";
import {
  formatScheduleCategoryLabels,
  formatScheduleLevelLabels,
  slotMatchesAnyCategory,
  slotMatchesCategory,
  slotMatchesLevel,
} from "@/lib/schedule/schedule-slot-selection";

export type GurgelSlotStatus =
  | "available"
  | "busy"
  | "break"
  | "conflict"
  | "level_mismatch";

export type GurgelTimelineSlot = {
  slotId: string;
  time: string;
  end: string;
  durationMinutes: number;
  durationLabel: string;
  status: GurgelSlotStatus;
  title: string;
  detail?: string;
  eventId?: string;
  categoryIds: string[];
  levelIds: string[];
  categoryName: string;
  levelName: string;
};

export type BuildGurgelTimelineOptions = {
  categoryId?: string;
  /** Filtra slots que intersectam qualquer categoria do piloto. */
  categoryIds?: string[];
  studentLevelId?: string;
};

function parseHour(time: string): number {
  return parseInt(time.slice(0, 2), 10);
}

function eventAtSlot(
  events: ScheduleEvent[],
  slotStart: string,
): ScheduleEvent | undefined {
  const hour = parseHour(slotStart);
  return events.find(
    (e) => e.start === slotStart || parseHour(e.start) === hour,
  );
}

/** Grade do kartódromo com eventos e bloqueios reais ou mock. */
export function buildGurgelTimelineWithEvents(
  date: string,
  options: BuildGurgelTimelineOptions = {},
  events: ScheduleEvent[],
  blockedSlotIds: Set<string> = new Set(),
  scheduleSlotsOverride?: ScheduleTimeSlot[],
): GurgelTimelineSlot[] {
  const { categoryId, categoryIds, studentLevelId } = options;
  let scheduleSlots = scheduleSlotsOverride ?? getEffectiveScheduleSlotsForDate(date);

  if (categoryIds?.length) {
    scheduleSlots = scheduleSlots.filter((s) =>
      slotMatchesAnyCategory(s, categoryIds),
    );
  } else if (categoryId) {
    scheduleSlots = scheduleSlots.filter((s) =>
      slotMatchesCategory(s, categoryId),
    );
  }

  return scheduleSlots.map((slot) => {
    const durationMinutes = scheduleSlotDurationMinutes(slot.start, slot.end);
    const durationLabel = formatScheduleDuration(durationMinutes);
    const categoryName = formatScheduleCategoryLabels(slot.categoryIds, KART_CATEGORIES);
    const levelName = formatScheduleLevelLabels(slot.levelIds, SKILL_LEVELS);

    const base = {
      slotId: slot.id,
      time: slot.start,
      end: slot.end,
      durationMinutes,
      durationLabel,
      categoryIds: slot.categoryIds,
      levelIds: slot.levelIds,
      categoryName,
      levelName,
    };

    if (blockedSlotIds.has(slot.id)) {
      return {
        ...base,
        status: "break" as const,
        title: "Bloqueado",
        detail: "Horário indisponível",
      };
    }

    const event = eventAtSlot(events, slot.start);
    if (event) {
      return {
        ...base,
        status: "busy" as const,
        title: "Ocupado",
        detail: event.student,
        eventId: event.id,
      };
    }

    const levelMismatch =
      Boolean(studentLevelId) && !slotMatchesLevel(slot, studentLevelId!);

    return {
      ...base,
      status: levelMismatch ? ("level_mismatch" as const) : ("available" as const),
      title: levelMismatch ? "Outro nível" : "Disponível",
    };
  });
}

export function findGurgelTimelineSlot(
  slots: GurgelTimelineSlot[],
  time: string,
): GurgelTimelineSlot | undefined {
  return slots.find((s) => s.time === time);
}

export function findDefaultGurgelSlot(
  slots: GurgelTimelineSlot[],
): GurgelTimelineSlot | undefined {
  return slots.find(
    (s) => s.status === "available" || s.status === "level_mismatch",
  );
}

export function isSlotAvailableForBooking(
  slot: GurgelTimelineSlot,
  levelOverrideTimes: Set<string>,
): boolean {
  return (
    slot.status === "available" ||
    (slot.status === "level_mismatch" && levelOverrideTimes.has(slot.time))
  );
}
