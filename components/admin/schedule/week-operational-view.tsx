"use client";

import type { ScheduleEvent, UpcomingDaySummary } from "@/lib/contracts/schedule";
import { ScheduleServiceMock } from "@/services/schedule/scheduleServiceMock";

type Props = {
  days: UpcomingDaySummary[];
  events: ScheduleEvent[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export function WeekOperationalView({
  days,
  events,
  selectedDate,
  onSelectDate,
}: Props) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {days.map((day) => {
        const dayEvents = ScheduleServiceMock.getEventsForDate(events, day.date);
        const empty = day.bookingCount === 0;
        return (
          <button
            key={day.date}
            type="button"
            onClick={() => onSelectDate(day.date)}
            className={`rounded-xl border-2 p-3 text-left transition ${
              selectedDate === day.date
                ? "border-[#0d1f3c] bg-[#0d1f3c]/5"
                : "border-[rgba(17,17,17,0.08)] bg-white hover:border-accent/25"
            }`}
          >
            <p className="text-[10px] font-bold uppercase text-neutral-500">
              {day.label}
            </p>
            {empty ? (
              <p className="mt-3 text-xs font-semibold text-neutral-400">
                Sem agendamentos
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {dayEvents.slice(0, 3).map((ev) => (
                  <li
                    key={ev.id}
                    className="rounded-lg bg-[#fafbfc] px-2 py-1.5 text-[10px] ring-1 ring-[rgba(17,17,17,0.06)]"
                  >
                    <span className="font-bold tabular-nums text-[#0d1f3c]">
                      {ev.start}
                    </span>
                    <span className="mt-0.5 block truncate font-semibold">
                      {ev.student}
                    </span>
                  </li>
                ))}
                {dayEvents.length > 3 ? (
                  <li className="text-[10px] font-bold text-neutral-500">
                    +{dayEvents.length - 3} mais
                  </li>
                ) : null}
              </ul>
            )}
          </button>
        );
      })}
    </section>
  );
}
