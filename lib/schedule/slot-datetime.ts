import type { ScheduleTimeSlot } from "@/lib/contracts/settings";

const TZ_OFFSET = "-03:00";

/** Converte data + slot da grade em ISO datetimes (America/Sao_Paulo). */
export function slotToDateTimeRange(
  date: string,
  slot: Pick<ScheduleTimeSlot, "start" | "end">,
): { startsAt: string; endsAt: string } {
  return timeRangeToIso(date, slot.start, slot.end);
}

export function timeRangeToIso(
  date: string,
  start: string,
  end: string,
): { startsAt: string; endsAt: string } {
  return {
    startsAt: `${date}T${start}:00${TZ_OFFSET}`,
    endsAt: `${date}T${end}:00${TZ_OFFSET}`,
  };
}
