import { getDataSourceMode } from "@/lib/data-source/mode";
import type { ScheduleEvent } from "@/lib/contracts/schedule";
import type { ScheduleMetaDTO } from "@/lib/contracts/schedule/schedule-api.types";
import * as schedulePure from "@/lib/schedule/schedule-pure";
import { buildScheduleMetaDTO } from "@/repositories/schedule/schedule-api-handlers";
import { ScheduleRepositoryHttp } from "@/repositories/schedule/ScheduleRepositoryHttp";
import { ScheduleRepositoryMock } from "@/repositories/schedule/ScheduleRepositoryMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

function createDataAccess() {
  return {
    getEvents(): Promise<ScheduleEvent[]> {
      return isHttpMode()
        ? ScheduleRepositoryHttp.fetchEvents()
        : Promise.resolve(ScheduleRepositoryMock.getEvents());
    },
    getUpcomingDays() {
      return isHttpMode()
        ? ScheduleRepositoryHttp.fetchUpcomingDays()
        : Promise.resolve(ScheduleRepositoryMock.getUpcomingDays());
    },
    getMeta(): Promise<ScheduleMetaDTO> {
      return isHttpMode()
        ? ScheduleRepositoryHttp.fetchMeta()
        : Promise.resolve(buildScheduleMetaDTO());
    },
    getEventDetail(eventId: string): Promise<ScheduleEvent | undefined> {
      return isHttpMode()
        ? ScheduleRepositoryHttp.fetchEventById(eventId)
        : Promise.resolve(ScheduleRepositoryMock.getEventDetail(eventId));
    },
    async getDefaultDate(): Promise<string> {
      if (isHttpMode()) {
        const meta = await ScheduleRepositoryHttp.fetchMeta();
        return meta.today;
      }
      return ScheduleRepositoryMock.getToday();
    },
  };
}

/** Acesso síncrono a meta/listas — apenas em modo mock. */
function mockMetaAccessor<T>(feature: string, fn: () => T): T {
  if (isHttpMode()) {
    throw new Error(
      `[schedule] ${feature}: em modo HTTP use useScheduleMeta() ou getMeta().`,
    );
  }
  return fn();
}

export function createScheduleService() {
  const data = createDataAccess();

  return {
    ...data,

    buildMonthCalendarCells: schedulePure.buildMonthCalendarCells,
    getEventsGroupedByDate: schedulePure.getEventsGroupedByDate,
    getEventsForDate: schedulePure.getEventsForDate,
    groupDayEventsBySlot: schedulePure.groupDayEventsBySlot,
    getDaySummary: schedulePure.getDaySummary,
    getWeekdayLongUpper: schedulePure.getWeekdayLongUpper,
    formatMonthYearLabel: schedulePure.formatMonthYearLabel,
    formatEventCategory: schedulePure.formatEventCategory,
    formatDateLower: schedulePure.formatScheduleDateLower,
    formatDateShort: schedulePure.formatScheduleDateShort,
    buildDayTimeline: schedulePure.buildDayTimeline,
    filterEvents: schedulePure.filterScheduleEvents,
    getEventDetailFromList: (
      events: ScheduleEvent[],
      eventId: string,
    ): ScheduleEvent | undefined =>
      events.find((e) => e.id === eventId) ??
      schedulePure.getEventDetail(eventId),

    getMonthYear: () =>
      mockMetaAccessor("getMonthYear", () =>
        ScheduleRepositoryMock.getMonthYear(),
      ),
    getMonthNumber: () =>
      mockMetaAccessor("getMonthNumber", () =>
        ScheduleRepositoryMock.getMonthNumber(),
      ),
    getViewTabs: () =>
      mockMetaAccessor("getViewTabs", () => ScheduleRepositoryMock.getViewTabs()),
    getKpis: () =>
      mockMetaAccessor("getKpis", () => ScheduleRepositoryMock.getKpis()),
    getAvailableKartsNow: () =>
      mockMetaAccessor("getAvailableKartsNow", () =>
        ScheduleRepositoryMock.getAvailableKartsNow(),
      ),
    getAvailableInstructorsNow: () =>
      mockMetaAccessor("getAvailableInstructorsNow", () =>
        ScheduleRepositoryMock.getAvailableInstructorsNow(),
      ),
    getOperationalSidebarAlerts: () =>
      mockMetaAccessor("getOperationalSidebarAlerts", () =>
        ScheduleRepositoryMock.getOperationalSidebarAlerts(),
      ),
    getQuickActions: () =>
      mockMetaAccessor("getQuickActions", () =>
        ScheduleRepositoryMock.getQuickActions(),
      ),
    getInstructors: () =>
      mockMetaAccessor("getInstructors", () =>
        ScheduleRepositoryMock.getInstructors(),
      ),
    getKartScheduleRows: () =>
      mockMetaAccessor("getKartScheduleRows", () =>
        ScheduleRepositoryMock.getKartScheduleRows(),
      ),
    getConflicts: () =>
      mockMetaAccessor("getConflicts", () =>
        ScheduleRepositoryMock.getConflicts(),
      ),
    getInsights: () =>
      mockMetaAccessor("getInsights", () => ScheduleRepositoryMock.getInsights()),
    getEventTypeOptions: () =>
      mockMetaAccessor("getEventTypeOptions", () =>
        ScheduleRepositoryMock.getEventTypeOptions(),
      ),
    getEventStatusOptions: () =>
      mockMetaAccessor("getEventStatusOptions", () =>
        ScheduleRepositoryMock.getEventStatusOptions(),
      ),
    getInstructorFilterOptions: () =>
      mockMetaAccessor("getInstructorFilterOptions", () =>
        ScheduleRepositoryMock.getInstructorFilterOptions(),
      ),
    getCategoryFilterOptions: () =>
      mockMetaAccessor("getCategoryFilterOptions", () =>
        ScheduleRepositoryMock.getCategoryFilterOptions(),
      ),
    getEventTypeLabels: () =>
      mockMetaAccessor("getEventTypeLabels", () =>
        ScheduleRepositoryMock.getEventTypeLabels(),
      ),
    getEventStatusLabels: () =>
      mockMetaAccessor("getEventStatusLabels", () =>
        ScheduleRepositoryMock.getEventStatusLabels(),
      ),
    getDayTimelineSlots: () =>
      mockMetaAccessor("getDayTimelineSlots", () =>
        ScheduleRepositoryMock.getDayTimelineSlots(),
      ),
    getTimeSlots: () =>
      mockMetaAccessor("getTimeSlots", () => ScheduleRepositoryMock.getTimeSlots()),
    getEventRecentHistory: () =>
      mockMetaAccessor("getEventRecentHistory", () =>
        ScheduleRepositoryMock.getEventRecentHistory(),
      ),
  };
}

export type ScheduleService = ReturnType<typeof createScheduleService>;

export const scheduleService = createScheduleService();
