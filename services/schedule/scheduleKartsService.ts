import type { KartSwapOption } from "@/lib/contracts/schedule/karts";
import type { ScheduleEvent } from "@/lib/contracts/schedule";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { KartsRepositoryHttp } from "@/repositories/karts/KartsRepositoryHttp";
import { ScheduleKartsRepositoryMock } from "@/repositories/schedule/ScheduleKartsRepositoryMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

function buildSwapOptionsFromEvents(
  date: string,
  time: string,
  excludeEventId: string,
  events: ScheduleEvent[],
  fleet: { id: string; number: number; categoryName?: string }[],
): KartSwapOption[] {
  const reserved = new Map<number, ScheduleEvent>();
  const hour = time.slice(0, 2);

  for (const e of events) {
    if (e.date !== date || e.id === excludeEventId || e.kartNumber <= 0) {
      continue;
    }
    if (e.start === time || e.start.startsWith(`${hour}:`)) {
      reserved.set(e.kartNumber, e);
    }
  }

  const numbers = new Set<number>();
  for (const k of fleet) numbers.add(k.number);
  for (const n of reserved.keys()) numbers.add(n);

  return [...numbers]
    .sort((a, b) => a - b)
    .map((number) => {
      const meta = fleet.find((k) => k.number === number);
      const conflict = reserved.get(number);
      return {
        number,
        kartId: meta?.id,
        label: conflict
          ? `Kart ${number} · reservado (${conflict.student})`
          : `Kart ${number}${meta?.categoryName ? ` · ${meta.categoryName}` : ""}`,
        category: meta?.categoryName,
        reservedBy: conflict?.student,
      };
    });
}

export function createScheduleKartsService() {
  return {
    getKartSwapOptions(
      date: string,
      time: string,
      excludeEventId: string,
      events: ScheduleEvent[] = [],
    ) {
      if (isHttpMode()) {
        return KartsRepositoryHttp.getFleet().then((fleet) =>
          buildSwapOptionsFromEvents(date, time, excludeEventId, events, fleet),
        );
      }
      return Promise.resolve(
        ScheduleKartsRepositoryMock.getKartSwapOptions(
          date,
          time,
          excludeEventId,
        ),
      );
    },

    getKartReservationAtSlot(
      date: string,
      time: string,
      excludeEventId: string,
    ) {
      return Promise.resolve(
        ScheduleKartsRepositoryMock.getKartReservationAtSlot(
          date,
          time,
          excludeEventId,
        ),
      );
    },
  };
}

export type ScheduleKartsService = ReturnType<typeof createScheduleKartsService>;

export type { KartSwapOption };
