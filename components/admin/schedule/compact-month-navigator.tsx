"use client";

import { useScheduleUpcomingDays } from "@/lib/query/hooks/use-schedule";

type Props = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

/** Mini calendário — apenas navegação, não é o foco da página */
export function CompactMonthNavigator({
  selectedDate,
  onSelectDate,
}: Props) {
  const { data: upcomingDays = [] } = useScheduleUpcomingDays();
  const mayDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const datesWithBookings = new Set(upcomingDays.map((d) => d.date));

  return (
    <section className="rounded-xl border border-[rgba(17,17,17,0.06)] bg-[#fafbfc] p-3">
      <p className="text-center text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        Maio 2026
      </p>
      <div className="mt-2 grid grid-cols-7 gap-0.5 text-center text-[9px] font-bold text-neutral-400">
        {(
          [
            { id: "seg", label: "S" },
            { id: "ter", label: "T" },
            { id: "qua", label: "Q" },
            { id: "qui", label: "Q" },
            { id: "sex", label: "S" },
            { id: "sab", label: "S" },
            { id: "dom", label: "D" },
          ] as const
        ).map(({ id, label }) => (
          <span key={id}>{label}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-0.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {mayDays.map((d) => {
          const iso = `2026-05-${String(d).padStart(2, "0")}`;
          const hasBookings = datesWithBookings.has(iso);
          const selected = selectedDate === iso;
          const inRange = upcomingDays.some((u) => u.date === iso);
          return (
            <button
              key={d}
              type="button"
              disabled={!inRange}
              onClick={() => onSelectDate(iso)}
              className={`relative flex h-7 items-center justify-center rounded-md text-[10px] font-semibold transition ${
                selected
                  ? "bg-accent text-white"
                  : inRange
                    ? "text-[#0d1f3c] hover:bg-white"
                    : "text-neutral-300"
              }`}
            >
              {d}
              {hasBookings && !selected ? (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-accent" />
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
