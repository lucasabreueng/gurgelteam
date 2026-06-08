import * as scheduleMocks from "@/lib/admin-schedule-mocks";
import { getMergedScheduleEvents } from "@/lib/schedule-runtime-store";

export const ScheduleRepositoryMock = {
  getToday: () => scheduleMocks.SCHEDULE_TODAY,
  getMonthYear: () => scheduleMocks.SCHEDULE_MONTH_YEAR,
  getMonthNumber: () => scheduleMocks.SCHEDULE_MONTH_NUMBER,
  getEvents: () => getMergedScheduleEvents(),
  getUpcomingDays: () => scheduleMocks.UPCOMING_DAYS,
  getViewTabs: () => scheduleMocks.SCHEDULE_VIEW_TABS,
  getKpis: () => scheduleMocks.SCHEDULE_KPIS,
  getAvailableKartsNow: () => scheduleMocks.AVAILABLE_KARTS_NOW,
  getOperationalSidebarAlerts: () => scheduleMocks.OPERATIONAL_SIDEBAR_ALERTS,
  getQuickActions: () => scheduleMocks.QUICK_ACTIONS,
  getKartScheduleRows: () => scheduleMocks.KART_SCHEDULE_ROWS,
  getConflicts: () => scheduleMocks.SCHEDULE_CONFLICTS,
  getInsights: () => scheduleMocks.SCHEDULE_INSIGHTS,
  getEventTypeOptions: () => scheduleMocks.EVENT_TYPE_OPTIONS,
  getEventStatusOptions: () => scheduleMocks.EVENT_STATUS_OPTIONS,
  getCategoryFilterOptions: () => scheduleMocks.CATEGORY_FILTER_OPTIONS,
  getEventTypeLabels: () => scheduleMocks.EVENT_TYPE_LABELS,
  getEventStatusLabels: () => scheduleMocks.EVENT_STATUS_LABELS,
  getDayTimelineSlots: () => scheduleMocks.DAY_TIMELINE_SLOTS,
  getTimeSlots: () => scheduleMocks.TIME_SLOTS,
  getEventRecentHistory: () => scheduleMocks.EVENT_RECENT_HISTORY,

  buildMonthCalendarCells: scheduleMocks.buildMonthCalendarCells,
  getEventsGroupedByDate: scheduleMocks.getEventsGroupedByDate,
  getEventDetail: (id: string) =>
    getMergedScheduleEvents().find((e) => e.id === id) ??
    scheduleMocks.getEventDetail(id),
  getEventsForDate: scheduleMocks.getEventsForDate,
  groupDayEventsBySlot: scheduleMocks.groupDayEventsBySlot,
  getDaySummary: scheduleMocks.getDaySummary,
  getWeekdayLongUpper: scheduleMocks.getWeekdayLongUpper,
  formatMonthYearLabel: scheduleMocks.formatMonthYearLabel,
  formatEventCategory: scheduleMocks.formatEventCategory,
  formatScheduleDateLower: scheduleMocks.formatScheduleDateLower,
  formatScheduleDateShort: scheduleMocks.formatScheduleDateShort,
  buildDayTimeline: scheduleMocks.buildDayTimeline,
  filterScheduleEvents: scheduleMocks.filterScheduleEvents,
};
