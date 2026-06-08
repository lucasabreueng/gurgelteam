/** Tipos e labels da agenda — superfície de contrato (dados via ScheduleServiceMock). */
export type {
  ScheduleEventType,
  ScheduleEventStatus,
  PaymentStatus,
  KartScheduleStatus,
} from "../enums";

export type {
  ScheduleViewKey,
  UpcomingDaySummary,
  TimelineRow,
  AvailableKartItem,
  OperationalSidebarAlert,
  MonthCalendarCell,
  ScheduleKpi,
  ScheduleEvent,
  KartScheduleRow,
  ScheduleConflict,
  ScheduleInsight,
  DayEventSlotGroup,
} from "@/lib/admin-schedule-mocks";

export type {
  GurgelSlotStatus,
  KartOwnershipMode,
  NewClassStudentOption,
  GurgelTimelineSlot,
  BuildGurgelTimelineOptions,
} from "./new-class";

export type { ScheduleBlockEntry } from "@/repositories/schedule/ScheduleBlocksRepositoryMock";
export type { RescheduleSlotOption } from "@/repositories/schedule/ScheduleRescheduleRepositoryMock";
export type { KartSwapOption } from "./karts";
