"use client";

import type { ScheduleEvent, ScheduleViewKey } from "@/lib/contracts/schedule";
import { OperationalTimeline } from "./operational-timeline";

type Props = {
  selectedDate: string;
  dateLabel: string;
  events: ScheduleEvent[];
  onEventClick: (id: string) => void;
  onCreateClass?: (time?: string) => void;
  onBlockConfirmed?: (message: string) => void;
  onOpenBlockDrawer?: () => void;
  view: ScheduleViewKey;
  onViewChange: (view: ScheduleViewKey) => void;
};

export function TimelineView(props: Props) {
  return <OperationalTimeline {...props} />;
}
