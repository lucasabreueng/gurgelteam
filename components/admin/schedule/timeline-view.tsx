"use client";

import type { ScheduleEvent, ScheduleViewKey } from "@/lib/contracts/schedule";
import { OperationalTimeline } from "./operational-timeline";

type Props = {
  selectedDate: string;
  dateLabel: string;
  events: ScheduleEvent[];
  onEventClick: (id: string) => void;
  onCreateClass?: (time?: string) => void;
  onBlockConfirmed?: (message: string, isError?: boolean) => void;
  onOpenBlockDrawer?: () => void;
  blocksRefreshToken?: number;
  view: ScheduleViewKey;
  onViewChange: (view: ScheduleViewKey) => void;
};

export function TimelineView(props: Props) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      <OperationalTimeline {...props} />
    </div>
  );
}
