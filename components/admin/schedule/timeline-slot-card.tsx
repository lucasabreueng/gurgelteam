"use client";

import type { ScheduleEvent } from "@/lib/contracts/schedule";
import { getAppServices } from "@/lib/data-source/app-services";
import { adminCardClass } from "@/lib/design";

type Props = {
  time: string;
  events: ScheduleEvent[];
  onEventClick: (id: string) => void;
};

export function TimelineSlotCard({ time, events, onEventClick }: Props) {
  const schedule = getAppServices().schedule;
  const categories = [
    ...new Set(
      events
        .map((event) => schedule.formatEventCategory(event.category))
        .filter((category) => category !== "—"),
    ),
  ];
  const sharedCategory = categories.length === 1 ? categories[0] : null;

  return (
    <div className={`${adminCardClass} w-full min-w-0 max-w-full overflow-hidden p-3`}>
      <p className="break-words text-sm font-black text-[var(--ds-text-primary)]">
        <span className="tabular-nums">{time}</span>
        {sharedCategory ? (
          <>
            <span className="mx-1.5 font-bold text-[var(--ds-text-muted)]">·</span>
            <span className="font-bold text-accent">{sharedCategory}</span>
          </>
        ) : null}
      </p>
      <ul className="mt-2 space-y-1">
        {events.map((event) => {
          const category = schedule.formatEventCategory(event.category);

          return (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => onEventClick(event.id)}
                className="w-full text-left text-sm font-bold text-[var(--ds-text-primary)] transition hover:text-accent"
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
