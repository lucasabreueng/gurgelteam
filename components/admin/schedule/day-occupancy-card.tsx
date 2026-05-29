"use client";

import type { UpcomingDaySummary } from "@/lib/contracts/schedule";
import { ScheduleServiceMock } from "@/services/schedule/scheduleServiceMock";

type Props = {
  day: UpcomingDaySummary;
  selected: boolean;
  onSelect: () => void;
};

function weekdayShortUpper(date: string): string {
  return new Date(`${date}T12:00:00`)
    .toLocaleDateString("pt-BR", { weekday: "short" })
    .replace(/\./g, "")
    .toUpperCase();
}

export function DayOccupancyCard({ day, selected, onSelect }: Props) {
  const weekdayLong = ScheduleServiceMock.getWeekdayLongUpper(day.date);
  const weekdayShort = weekdayShortUpper(day.date);
  const barWidth =
    day.bookingCount > 0 ? Math.max(day.occupancyPercent, 4) : 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`schedule-day-occupancy-card box-border flex w-full min-w-0 max-w-full flex-col gap-0.5 rounded-lg border-2 px-1 py-1 text-left transition-[border-color,background-color] duration-200 max-lg:min-h-[3.25rem] sm:rounded-xl sm:px-2 lg:h-[128px] lg:gap-0 lg:rounded-xl lg:p-3.5 ${
        selected
          ? "border-[#0d1f3c] bg-[#0d1f3c] text-white"
          : "border-[rgba(13,31,60,0.12)] bg-white hover:border-accent/30 hover:bg-[#fafbfc]"
      }`}
    >
      <p
        className={`truncate text-[8px] font-bold leading-none tracking-wide sm:text-[9px] lg:text-[11px] ${
          selected ? "text-white/90" : "text-[#0d1f3c]"
        }`}
      >
        <span className="lg:hidden">{weekdayShort}</span>
        <span className="hidden lg:inline">{weekdayLong}</span>
      </p>

      <div className="flex flex-col gap-0.5 lg:mt-auto lg:space-y-2">
        <div>
          <p className="text-sm font-bold leading-none tabular-nums lg:text-[1.65rem]">
            {day.bookingCount}
          </p>
          <p
            className={`mt-0.5 hidden text-[10px] font-semibold uppercase tracking-wide lg:block ${
              selected ? "text-white/70" : "text-neutral-500"
            }`}
          >
            agendamentos
          </p>
        </div>
        <div>
          <div
            className={`h-1 overflow-hidden rounded-full lg:h-1.5 ${
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
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <p
            className={`mt-0.5 hidden text-[10px] font-bold tabular-nums lg:block ${
              selected ? "text-white/75" : "text-neutral-600"
            }`}
          >
            {day.occupancyPercent}% ocupação
          </p>
        </div>
      </div>
    </button>
  );
}
