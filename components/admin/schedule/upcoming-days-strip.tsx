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
    <section className="w-full">
      <ul className="grid w-full grid-cols-7 gap-1.5 sm:gap-3">
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
