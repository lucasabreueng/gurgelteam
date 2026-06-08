import { ScheduleRepositoryMock } from "@/repositories/schedule/ScheduleRepositoryMock";
import type { ScheduleMetaDTO } from "@/lib/contracts/schedule/schedule-api.types";

/** Monta payload de meta para rotas API (fonte mock até existir backend real). */
export function buildScheduleMetaDTO(): ScheduleMetaDTO {
  return {
    today: ScheduleRepositoryMock.getToday(),
    monthYear: ScheduleRepositoryMock.getMonthYear(),
    monthNumber: ScheduleRepositoryMock.getMonthNumber(),
    viewTabs: [...ScheduleRepositoryMock.getViewTabs()],
    kpis: [...ScheduleRepositoryMock.getKpis()],
    availableKartsNow: [...ScheduleRepositoryMock.getAvailableKartsNow()],
    operationalSidebarAlerts: [
      ...ScheduleRepositoryMock.getOperationalSidebarAlerts(),
    ],
    quickActions: [...ScheduleRepositoryMock.getQuickActions()],
    kartScheduleRows: [...ScheduleRepositoryMock.getKartScheduleRows()],
    conflicts: [...ScheduleRepositoryMock.getConflicts()],
    insights: [...ScheduleRepositoryMock.getInsights()],
    eventTypeOptions: [...ScheduleRepositoryMock.getEventTypeOptions()],
    eventStatusOptions: [...ScheduleRepositoryMock.getEventStatusOptions()],
    categoryFilterOptions: [
      ...ScheduleRepositoryMock.getCategoryFilterOptions(),
    ],
    eventTypeLabels: { ...ScheduleRepositoryMock.getEventTypeLabels() },
    eventStatusLabels: { ...ScheduleRepositoryMock.getEventStatusLabels() },
    dayTimelineSlots: [...ScheduleRepositoryMock.getDayTimelineSlots()],
    timeSlots: [...ScheduleRepositoryMock.getTimeSlots()],
    eventRecentHistory: [...ScheduleRepositoryMock.getEventRecentHistory()],
  };
}
