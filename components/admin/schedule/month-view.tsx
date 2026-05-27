"use client";

import type { ScheduleEvent } from "@/lib/contracts/schedule";

type Props = { events: ScheduleEvent[]; onEventClick: (id: string) => void };

export function MonthView({ events, onEventClick }: Props) {
  const cells = Array.from({ length: 35 }, (_, i) => i + 1);
  const countByDay = (d: number) =>
    d === 21 ? events.length : d % 7 === 0 ? 2 : d % 3 === 0 ? 1 : 0;

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
      <p className="text-sm font-bold text-[#0d1f3c]">Maio 2026</p>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-neutral-500">
        {["S", "T", "Q", "Q", "S", "S", "D"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const count = countByDay(d);
          const isToday = d === 21;
          return (
            <button
              key={d}
              type="button"
              onClick={() => count > 0 && onEventClick(events[0]?.id ?? "")}
              className={`min-h-[72px] rounded-lg p-1.5 text-left transition ${
                isToday
                  ? "bg-[#0d1f3c] text-white ring-2 ring-accent"
                  : "bg-[#fafbfc] hover:bg-white hover:ring-1 hover:ring-accent/20"
              }`}
            >
              <span className="text-xs font-bold">{d}</span>
              {count > 0 ? (
                <span
                  className={`mt-1 block text-[9px] font-bold ${
                    isToday ? "text-white/80" : "text-accent"
                  }`}
                >
                  {count} eventos
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
