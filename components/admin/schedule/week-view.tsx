"use client";

import type { ScheduleEvent, ScheduleViewKey } from "@/lib/contracts/schedule";
import { MonthWeekGrid } from "./month-week-grid";

type Props = {
  events: ScheduleEvent[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  view: ScheduleViewKey;
  onViewChange: (view: ScheduleViewKey) => void;
};

export function WeekView({
  events,
  selectedDate,
  onSelectDate,
  view,
  onViewChange,
}: Props) {
  return (
    <div className="h-full min-h-0">
      <MonthWeekGrid
      events={events}
      selectedDate={selectedDate}
      onSelectDate={onSelectDate}
      view={view}
      onViewChange={onViewChange}
      />
    </div>
  );
}
