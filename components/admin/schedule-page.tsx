"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { ScheduleViewKey } from "@/lib/contracts/schedule";
import {
  useScheduleDefaultDate,
  useScheduleEvents,
  useScheduleUpcomingDays,
} from "@/lib/query/hooks/use-schedule";
import { getAppServices } from "@/lib/data-source/app-services";
import { AdminShell } from "./admin-shell";
import { ScheduleHeader } from "./schedule/schedule-header";
import { UpcomingDaysStrip } from "./schedule/upcoming-days-strip";
import { TimelineView } from "./schedule/timeline-view";
import { WeekView } from "./schedule/week-view";
import { DayReservationsSummary } from "./schedule/day-reservations-summary";
import { ScheduleDayAppointmentsSheet } from "./schedule/schedule-day-appointments-sheet";
import { ScheduleDetailsDrawer } from "./schedule/schedule-details-drawer";
import { BlockScheduleDrawer } from "./schedule/block-schedule-drawer";
import { NewClassModal } from "./schedule/new-class/new-class-modal";

const ADMIN_NAV_HREF: Partial<Record<AdminNavKey, string>> = {
  dashboard: "/admin",
  agenda: "/admin/agenda",
  alunos: "/admin/clientes",
  karts: "/admin/karts",
  manutencao: "/admin/manutencao",
  configuracoes: "/admin/configuracoes",
};

export function SchedulePage() {
  const router = useRouter();
  const [view, setView] = useState<ScheduleViewKey>("day");
  const { data: defaultDate } = useScheduleDefaultDate();
  const [selectedDate, setSelectedDate] = useState("");
  const { data: scheduleEvents = [] } = useScheduleEvents();
  const { data: upcomingDays = [] } = useScheduleUpcomingDays();

  useEffect(() => {
    if (defaultDate && !selectedDate) setSelectedDate(defaultDate);
  }, [defaultDate, selectedDate]);

  const [detailEventId, setDetailEventId] = useState<string | null>(null);
  const [newClassOpen, setNewClassOpen] = useState(false);
  const [blockDrawerOpen, setBlockDrawerOpen] = useState(false);
  const [newClassTime, setNewClassTime] = useState<string | undefined>();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [daySheetDate, setDaySheetDate] = useState<string | null>(null);
  const [detailFromDaySheet, setDetailFromDaySheet] = useState(false);

  const onNav = useCallback(
    (key: AdminNavKey) => {
      const href = ADMIN_NAV_HREF[key];
      if (href) router.push(href);
    },
    [router],
  );

  const dateLabel = useMemo(
    () => getAppServices().schedule.formatDateLower(selectedDate),
    [selectedDate],
  );

  const handleSuccess = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 4000);
  }, []);

  const onCreateClass = useCallback((time?: string) => {
    setNewClassTime(typeof time === "string" ? time : undefined);
    setNewClassOpen(true);
  }, []);

  const timelineProps = {
    selectedDate,
    dateLabel,
    events: scheduleEvents,
    onEventClick: (id: string) => {
      setDetailFromDaySheet(false);
      setDetailEventId(id);
    },
    onCreateClass,
    onBlockConfirmed: handleSuccess,
    onOpenBlockDrawer: () => setBlockDrawerOpen(true),
    view,
    onViewChange: setView,
  };

  const isWeekView = view === "week";

  useEffect(() => {
    if (!isWeekView) {
      setDaySheetDate(null);
      setDetailFromDaySheet(false);
    }
  }, [isWeekView]);

  return (
    <>
      <AdminShell
        activeNav="agenda"
        onNav={onNav}
        mobileTitle="Agenda"
        mainClassName="w-full min-w-0 max-w-full overflow-x-hidden"
        pageHeader={
          <ScheduleHeader
            onNewClass={() => onCreateClass()}
            onBlockSlot={() => setBlockDrawerOpen(true)}
          />
        }
      >
        <div className="flex w-full min-w-0 max-w-full flex-col gap-[var(--admin-gap)]">
          {feedback ? (
            <p
              role="status"
              className="shrink-0 rounded-xl border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900"
            >
              {feedback}
            </p>
          ) : null}

          {!isWeekView ? (
            <section className="w-full min-w-0 max-w-full shrink-0 overflow-hidden">
              <UpcomingDaysStrip
                days={upcomingDays}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </section>
          ) : null}

          <div
            className={`admin-page-grid grid w-full min-w-0 max-w-full items-stretch overflow-x-clip ${
              isWeekView
                ? "grid-cols-1 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)]"
                : "grid-cols-1"
            }`}
          >
            <div className="min-w-0 w-full max-w-full lg:min-h-0 lg:overflow-hidden">
              {isWeekView ? (
                <WeekView
                  events={scheduleEvents}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  onDayOpen={setDaySheetDate}
                  view={view}
                  onViewChange={setView}
                />
              ) : (
                <TimelineView {...timelineProps} />
              )}
            </div>

            {isWeekView ? (
              <div className="hidden min-h-0 lg:block">
                <DayReservationsSummary
                  selectedDate={selectedDate}
                  events={scheduleEvents}
                  onEventClick={(id) => {
                    setDetailFromDaySheet(false);
                    setDetailEventId(id);
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </AdminShell>

      <NewClassModal
        open={newClassOpen}
        onClose={() => {
          setNewClassOpen(false);
          setNewClassTime(undefined);
        }}
        initialDate={selectedDate}
        initialTime={newClassTime}
        onSuccess={handleSuccess}
      />

      <BlockScheduleDrawer
        open={blockDrawerOpen}
        initialDate={selectedDate}
        onClose={() => setBlockDrawerOpen(false)}
        onSaved={handleSuccess}
      />

      <ScheduleDayAppointmentsSheet
        date={detailEventId ? null : daySheetDate}
        events={scheduleEvents}
        onClose={() => {
          setDaySheetDate(null);
          setDetailFromDaySheet(false);
        }}
        onEventClick={(id) => {
          setDetailFromDaySheet(true);
          setDetailEventId(id);
        }}
      />

      <ScheduleDetailsDrawer
        eventId={detailEventId}
        events={scheduleEvents}
        onBack={
          detailFromDaySheet
            ? () => setDetailEventId(null)
            : undefined
        }
        onClose={() => {
          setDetailEventId(null);
          setDetailFromDaySheet(false);
          setDaySheetDate(null);
        }}
        onAction={handleSuccess}
      />
    </>
  );
}
