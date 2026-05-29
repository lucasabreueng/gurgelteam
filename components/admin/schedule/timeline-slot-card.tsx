"use client";

import type { ScheduleEvent } from "@/lib/contracts/schedule";
import { ScheduleServiceMock } from "@/services/schedule/scheduleServiceMock";

type Props = {
  time: string;
  events: ScheduleEvent[];
  onEventClick: (id: string) => void;
};

export function TimelineSlotCard({ time, events, onEventClick }: Props) {
  const categories = [
    ...new Set(
      events
        .map((event) => ScheduleServiceMock.formatEventCategory(event.category))
        .filter((category) => category !== "—")
    ),
  ];
  const sharedCategory = categories.length === 1 ? categories[0] : null;

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-3 shadow-sm">
      <p className="break-words text-sm font-black text-[#0d1f3c]">
        <span className="tabular-nums">{time}</span>
        {sharedCategory ? (
          <>
            <span className="mx-1.5 font-bold text-neutral-400">·</span>
            <span className="font-bold text-accent">{sharedCategory}</span>
          </>
        ) : null}
      </p>
      <ul className="mt-2 space-y-1">
        {events.map((event) => {
          const category = ScheduleServiceMock.formatEventCategory(
            event.category,
          );

          return (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => onEventClick(event.id)}
                className="w-full text-left text-sm font-bold text-[#0d1f3c] transition hover:text-accent"
              >
                {event.student}
                {!sharedCategory && category !== "—" ? (
                  <span className="ml-1.5 font-semibold text-accent">
                    · {category}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
