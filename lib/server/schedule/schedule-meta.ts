import { format, addDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  AVAILABLE_KARTS_NOW,
  DAY_TIMELINE_SLOTS,
  EVENT_RECENT_HISTORY,
  EVENT_STATUS_OPTIONS,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_OPTIONS,
  KART_SCHEDULE_ROWS,
  OPERATIONAL_SIDEBAR_ALERTS,
  QUICK_ACTIONS,
  SCHEDULE_CONFLICTS,
  SCHEDULE_INSIGHTS,
  SCHEDULE_KPIS,
  SCHEDULE_VIEW_TABS,
  TIME_SLOTS,
  CATEGORY_FILTER_OPTIONS,
  EVENT_STATUS_LABELS,
} from "@/lib/admin-schedule-mocks";
import type { ScheduleMetaDTO } from "@/lib/contracts/schedule/schedule-api.types";
import { prisma } from "@/lib/server/prisma";
import { isoDateToDbDate } from "@/lib/server/schedule/schedule-hours-utils";

function blockDateRangeFilter(from?: string, to?: string) {
  if (!from && !to) return {};
  return {
    blockDate: {
      ...(from ? { gte: isoDateToDbDate(from) } : {}),
      ...(to
        ? {
            lt: isoDateToDbDate(
              format(addDays(parseISO(to), 1), "yyyy-MM-dd"),
            ),
          }
        : {}),
    },
  };
}
import {
  loadBookingCountByDate,
  loadSlotCapacityByDateRange,
} from "@/lib/server/schedule/schedule-upcoming-utils";

function todayIso(): string {
  return format(new Date(), "yyyy-MM-dd");
}

function dayBounds(date: string) {
  return {
    gte: new Date(`${date}T00:00:00.000-03:00`),
    lte: new Date(`${date}T23:59:59.999-03:00`),
  };
}

export async function buildScheduleMetaDTO(): Promise<ScheduleMetaDTO> {
  const today = todayIso();
  const [todayCount, cancelledToday, activeKarts] = await Promise.all([
    prisma.scheduleEvent.count({
      where: {
        startsAt: dayBounds(today),
        status: { notIn: ["cancelado"] },
      },
    }),
    prisma.scheduleEvent.count({
      where: {
        startsAt: dayBounds(today),
        status: "cancelado",
      },
    }),
    prisma.kart.count({
      where: { status: "disponivel" },
    }),
  ]);

  const kpis = SCHEDULE_KPIS.map((kpi) => {
    if (kpi.id === "aulas") {
      return { ...kpi, value: String(todayCount) };
    }
    if (kpi.id === "cancel") {
      return { ...kpi, value: String(cancelledToday) };
    }
    if (kpi.id === "karts") {
      return { ...kpi, value: String(activeKarts) };
    }
    return kpi;
  });

  const now = new Date();
  return {
    today,
    monthYear: now.getFullYear(),
    monthNumber: now.getMonth() + 1,
    viewTabs: [...SCHEDULE_VIEW_TABS],
    kpis,
    availableKartsNow: [...AVAILABLE_KARTS_NOW],
    operationalSidebarAlerts: [...OPERATIONAL_SIDEBAR_ALERTS],
    quickActions: [...QUICK_ACTIONS],
    kartScheduleRows: [...KART_SCHEDULE_ROWS],
    conflicts: [...SCHEDULE_CONFLICTS],
    insights: [...SCHEDULE_INSIGHTS],
    eventTypeOptions: [...EVENT_TYPE_OPTIONS],
    eventStatusOptions: [...EVENT_STATUS_OPTIONS],
    categoryFilterOptions: [...CATEGORY_FILTER_OPTIONS],
    eventTypeLabels: { ...EVENT_TYPE_LABELS },
    eventStatusLabels: { ...EVENT_STATUS_LABELS },
    dayTimelineSlots: [...DAY_TIMELINE_SLOTS],
    timeSlots: [...TIME_SLOTS],
    eventRecentHistory: [...EVENT_RECENT_HISTORY],
  };
}

export async function buildUpcomingDays(from: string, days: number) {
  const start = parseISO(from);

  const [bookingCountByDate, slotCapacityByDate] = await Promise.all([
    loadBookingCountByDate(from, days),
    loadSlotCapacityByDateRange(from, days),
  ]);

  const results = [];

  for (let i = 0; i < days; i++) {
    const date = format(addDays(start, i), "yyyy-MM-dd");
    const bookingCount = bookingCountByDate.get(date) ?? 0;
    const slotCapacity = slotCapacityByDate.get(date) ?? 1;

    const occupancyPercent = Math.min(
      100,
      Math.round((bookingCount / Math.max(slotCapacity, 1)) * 100),
    );
    const freeSlots = Math.max(0, slotCapacity - bookingCount);
    const isToday = date === todayIso();

    let label = format(addDays(start, i), "EEEE", { locale: ptBR });
    label = label.charAt(0).toUpperCase() + label.slice(1);
    if (isToday) label = "Hoje";
    else if (i === 1) label = "Amanhã";

    const shortLabel = format(addDays(start, i), "EEE", { locale: ptBR })
      .replace(".", "")
      .slice(0, 3);

    let operationalStatus: "normal" | "busy" | "alert" | "empty" = "normal";
    if (bookingCount === 0) operationalStatus = "empty";
    else if (occupancyPercent >= 75) operationalStatus = "busy";
    else if (occupancyPercent >= 90) operationalStatus = "alert";

    results.push({
      date,
      label,
      shortLabel: shortLabel.charAt(0).toUpperCase() + shortLabel.slice(1),
      isToday,
      bookingCount,
      occupancyPercent,
      freeSlots,
      operationalStatus,
      conflictCount: 0,
    });
  }

  return results;
}

export const scheduleBlocksRepository = {
  async list(from?: string, to?: string) {
    return prisma.scheduleBlock.findMany({
      where: blockDateRangeFilter(from, to),
      orderBy: { blockDate: "asc" },
    });
  },

  async create(data: {
    blockDate: string;
    slotIds: string[];
    reason?: string;
    fullDay: boolean;
  }) {
    return prisma.scheduleBlock.create({
      data: {
        blockDate: isoDateToDbDate(data.blockDate),
        slotIds: data.slotIds,
        reason: data.reason ?? null,
        fullDay: data.fullDay,
      },
    });
  },

  async delete(blockId: string) {
    const existing = await prisma.scheduleBlock.findUnique({
      where: { id: blockId },
    });
    if (!existing) return false;
    await prisma.scheduleBlock.delete({ where: { id: blockId } });
    return true;
  },
};
