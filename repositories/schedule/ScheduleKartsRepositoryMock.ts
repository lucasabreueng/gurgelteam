import type { KartSwapOption } from "@/lib/contracts/schedule/karts";
import type { ScheduleEvent } from "@/lib/contracts/schedule";
import { ScheduleRepositoryMock } from "@/repositories/schedule/ScheduleRepositoryMock";

function getKartReservationAtSlot(
  date: string,
  time: string,
  excludeEventId: string,
): Map<number, ScheduleEvent> {
  const map = new Map<number, ScheduleEvent>();
  for (const e of ScheduleRepositoryMock.getEvents()) {
    if (e.date !== date || e.id === excludeEventId || e.kartNumber <= 0) continue;
    if (e.start === time || e.start.startsWith(time.slice(0, 2))) {
      map.set(e.kartNumber, e);
    }
  }
  return map;
}

export const ScheduleKartsRepositoryMock = {
  getKartReservationAtSlot,
  getKartSwapOptions(
    date: string,
    time: string,
    excludeEventId: string,
  ): KartSwapOption[] {
    const reserved = getKartReservationAtSlot(date, time, excludeEventId);
    const availableNow = ScheduleRepositoryMock.getAvailableKartsNow();
    const numbers = new Set<number>();

    for (const k of availableNow) numbers.add(k.number);
    for (const row of [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 22]) {
      numbers.add(row);
    }

    return [...numbers]
      .sort((a, b) => a - b)
      .map((number) => {
        const meta = availableNow.find((k) => k.number === number);
        const conflict = reserved.get(number);
        return {
          number,
          label: conflict
            ? `Kart ${number} · reservado (${conflict.student})`
            : `Kart ${number}${meta?.category ? ` · ${meta.category}` : ""}`,
          category: meta?.category,
          reservedBy: conflict?.student,
        };
      });
  },
};
