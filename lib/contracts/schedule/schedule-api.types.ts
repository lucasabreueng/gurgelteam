import type {
  AvailableInstructorItem,
  AvailableKartItem,
  OperationalSidebarAlert,
  ScheduleConflict,
  ScheduleEvent,
  ScheduleInsight,
  ScheduleKpi,
  ScheduleViewKey,
  UpcomingDaySummary,
} from "@/lib/contracts/schedule";

/** Metadados e listas estáticas da tela de agenda (modo HTTP). */
export type ScheduleMetaDTO = {
  today: string;
  monthYear: number;
  monthNumber: number;
  viewTabs: { key: ScheduleViewKey; label: string }[];
  kpis: ScheduleKpi[];
  availableKartsNow: AvailableKartItem[];
  availableInstructorsNow: AvailableInstructorItem[];
  operationalSidebarAlerts: OperationalSidebarAlert[];
  quickActions: { id: string; label: string; action: string }[];
  instructors: { id: string; name: string; avatar?: string }[];
  kartScheduleRows: unknown[];
  conflicts: ScheduleConflict[];
  insights: ScheduleInsight[];
  eventTypeOptions: { value: string; label: string }[];
  eventStatusOptions: { value: string; label: string }[];
  instructorFilterOptions: { value: string; label: string }[];
  categoryFilterOptions: { value: string; label: string }[];
  eventTypeLabels: Record<string, string>;
  eventStatusLabels: Record<string, string>;
  dayTimelineSlots: string[];
  timeSlots: string[];
  eventRecentHistory: unknown[];
};

export type ScheduleEventsResponseDTO = ScheduleEvent[];

export type ScheduleUpcomingDaysResponseDTO = UpcomingDaySummary[];
