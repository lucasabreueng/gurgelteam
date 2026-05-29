"use client";

import type { UpcomingDaySummary } from "@/lib/contracts/schedule";
import { DayOccupancyCard } from "./day-occupancy-card";

type Props = {
  days: UpcomingDaySummary[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export function UpcomingDaysStrip({
  days,
  selectedDate,
  onSelectDate,
}: Props) {
  return (
    <section className="w-full min-w-0 max-w-full overflow-x-clip overflow-y-visible">
      <ul className="schedule-days-strip grid w-full gap-0.5 sm:gap-1.5 lg:gap-3">
        {days.map((day) => (
          <li key={day.date} className="min-w-0">
            <DayOccupancyCard
              day={day}
              selected={selectedDate === day.date}
              onSelect={() => onSelectDate(day.date)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
