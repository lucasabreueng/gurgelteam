"use client";

import type { ScheduleEvent, ScheduleViewKey } from "@/lib/contracts/schedule";
import { MonthWeekGrid } from "./month-week-grid";

type Props = {
  events: ScheduleEvent[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onDayOpen?: (date: string) => void;
  view: ScheduleViewKey;
  onViewChange: (view: ScheduleViewKey) => void;
};

export function WeekView({
  events,
  selectedDate,
  onSelectDate,
  onDayOpen,
  view,
  onViewChange,
}: Props) {
  return (
    <div className="w-full min-w-0 max-w-full">
      <MonthWeekGrid
        events={events}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        onDayOpen={onDayOpen}
        view={view}
        onViewChange={onViewChange}
      />
    </div>
  );
}
