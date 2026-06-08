/**
 * Funções puras da agenda (sem I/O). Usadas em mock e HTTP.
 */
export {
  buildMonthCalendarCells,
  getEventsGroupedByDate,
  getEventsForDate,
  groupDayEventsBySlot,
  getDaySummary,
  getWeekdayLongUpper,
  formatMonthYearLabel,
  formatEventCategory,
  formatScheduleDateLower,
  formatScheduleDateShort,
  buildDayTimeline,
  filterScheduleEvents,
  getEventDetail,
} from "@/lib/admin-schedule-mocks";
export { buildDayTimelineFromSlots } from "@/lib/schedule/build-day-timeline";
