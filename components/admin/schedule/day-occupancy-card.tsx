"use client";

import type { UpcomingDaySummary } from "@/lib/contracts/schedule";
import { ScheduleServiceMock } from "@/services/schedule/scheduleServiceMock";

type Props = {
  day: UpcomingDaySummary;
  selected: boolean;
  onSelect: () => void;
};

export function DayOccupancyCard({ day, selected, onSelect }: Props) {
  const empty = day.bookingCount === 0;
  const weekday = ScheduleServiceMock.getWeekdayLongUpper(day.date);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex h-[128px] w-full min-w-0 flex-col rounded-xl border p-3.5 text-left transition-all duration-200 ${
        selected
          ? "border-[#0d1f3c] bg-[#0d1f3c] text-white shadow-[0_6px_20px_rgba(13,31,60,0.2)]"
          : "border-[rgba(13,31,60,0.2)] bg-white hover:border-accent/30 hover:bg-[#fafbfc]"
      }`}
    >
      <p
        className={`text-[10px] font-bold leading-tight tracking-wide sm:text-[11px] ${
          selected ? "text-white/90" : "text-[#0d1f3c]"
        }`}
      >
        {weekday}
      </p>

      {empty ? (
        <p
          className={`mt-auto text-sm font-semibold ${
            selected ? "text-white/85" : "text-neutral-500"
          }`}
        >
          Sem agendamentos
        </p>
      ) : (
        <div className="mt-auto space-y-2">
          <div>
            <p className="text-2xl font-bold leading-none tabular-nums sm:text-[1.65rem]">
              {day.bookingCount}
            </p>
            <p
              className={`mt-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                selected ? "text-white/70" : "text-neutral-500"
              }`}
            >
              agendamentos
            </p>
          </div>
          <div>
            <div
              className={`h-1.5 overflow-hidden rounded-full ${
                selected ? "bg-white/20" : "bg-neutral-100"
              }`}
            >
              <div
                className={`h-full rounded-full transition-all ${
                  selected
                    ? "bg-emerald-400"
                    : day.occupancyPercent >= 85
                      ? "bg-amber-500"
                      : day.occupancyPercent >= 70
                        ? "bg-amber-400"
                        : "bg-emerald-500"
                }`}
                style={{ width: `${Math.max(day.occupancyPercent, 4)}%` }}
              />
            </div>
            <p
              className={`mt-1 text-[10px] font-bold tabular-nums ${
                selected ? "text-white/75" : "text-neutral-600"
              }`}
            >
              {day.occupancyPercent}% ocupação
            </p>
          </div>
        </div>
      )}
    </button>
  );
}
