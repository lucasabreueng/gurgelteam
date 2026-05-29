"use client";

import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import type { ScheduleEvent, ScheduleViewKey } from "@/lib/contracts/schedule";
import { getAppServices } from "@/lib/data-source/app-services";
import { useMaxLg } from "@/lib/hooks/use-max-lg";
import { useScheduleMeta } from "@/lib/query/hooks/use-schedule";
import { ScheduleViewToggle } from "./schedule-tabs";

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

type Props = {
  events: ScheduleEvent[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  /** Mobile: abre lista de agendamentos do dia. */
  onDayOpen?: (date: string) => void;
  view: ScheduleViewKey;
  onViewChange: (view: ScheduleViewKey) => void;
};

function shiftMonth(year: number, month: number, delta: number) {
  const date = new Date(year, month - 1 + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

function formatMonthYearCompact(year: number, month: number): string {
  const shortMonth = new Date(year, month - 1, 1)
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(/\./g, "")
    .slice(0, 3)
    .toUpperCase();
  return `${shortMonth} ${year}`;
}

export function MonthWeekGrid({
  events,
  selectedDate,
  onSelectDate,
  onDayOpen,
  view,
  onViewChange,
}: Props) {
  const schedule = getAppServices().schedule;
  const isMaxLg = useMaxLg();
  const { data: meta } = useScheduleMeta();
  const [displayYear, setDisplayYear] = useState(
    () => meta?.monthYear ?? 2026,
  );
  const [displayMonth, setDisplayMonth] = useState(
    () => meta?.monthNumber ?? 5,
  );

  const cells = schedule.buildMonthCalendarCells(displayYear, displayMonth);
  const byDate = schedule.getEventsGroupedByDate(events);
  const monthLabel = schedule.formatMonthYearLabel(displayYear, displayMonth);
  const monthLabelCompact = formatMonthYearCompact(displayYear, displayMonth);
  const rowCount = cells.length / 7;

  const goToPreviousMonth = () => {
    const next = shiftMonth(displayYear, displayMonth, -1);
    setDisplayYear(next.year);
    setDisplayMonth(next.month);
  };

  const goToNextMonth = () => {
    const next = shiftMonth(displayYear, displayMonth, 1);
    setDisplayYear(next.year);
    setDisplayMonth(next.month);
  };

  const handleDayClick = (date: string) => {
    onSelectDate(date);
    if (isMaxLg) onDayOpen?.(date);
  };

  return (
    <section className="flex w-full min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[rgba(17,17,17,0.06)] px-4 py-4 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[rgba(13,31,60,0.2)] text-[#0d1f3c] transition hover:border-[#0d1f3c] hover:bg-[#fafbfc] md:h-8 md:w-8"
            aria-label="Mês anterior"
          >
            <HiChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <h2 className="min-w-0 truncate text-xs font-bold uppercase tracking-wide text-[#0d1f3c] md:text-base md:normal-case md:tracking-normal lg:hidden">
            {monthLabelCompact}
          </h2>
          <h2 className="hidden text-base font-bold text-[#0d1f3c] lg:block">
            {monthLabel}
          </h2>
          <button
            type="button"
            onClick={goToNextMonth}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[rgba(13,31,60,0.2)] text-[#0d1f3c] transition hover:border-[#0d1f3c] hover:bg-[#fafbfc] md:h-8 md:w-8"
            aria-label="Próximo mês"
          >
            <HiChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <ScheduleViewToggle active={view} onChange={onViewChange} />
      </div>
      <div className="grid shrink-0 grid-cols-7 border-b border-[rgba(17,17,17,0.06)] bg-[#fafbfc]">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="px-0.5 py-1.5 text-center text-[9px] font-bold uppercase tracking-wide text-neutral-500 md:px-1 md:py-2 md:text-[10px]"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="w-full min-w-0 overflow-hidden rounded-b-2xl bg-[rgba(17,17,17,0.06)] lg:min-h-0 lg:flex-1">
        <div
          className="grid w-full min-w-0 grid-cols-7 gap-px"
          style={{
            gridTemplateRows: `repeat(${rowCount}, minmax(3.25rem, auto))`,
          }}
        >
          {cells.map((cell, idx) => {
            if (!cell.date || cell.dayNumber === null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-0 bg-[#fafbfc]/50"
                  aria-hidden
                />
              );
            }
            const dayEvents = byDate[cell.date] ?? [];
            const selected = selectedDate === cell.date;
            const isToday = cell.date === meta?.today;

            const bookingCount = dayEvents.length;

            return (
              <button
                key={cell.date}
                type="button"
                onClick={() => handleDayClick(cell.date!)}
                aria-label={
                  bookingCount === 0
                    ? `Dia ${cell.dayNumber}, sem agendamentos`
                    : `Dia ${cell.dayNumber}, ${bookingCount} agendamento${bookingCount === 1 ? "" : "s"}`
                }
                className={`flex min-h-0 flex-col items-center justify-center bg-white p-0.5 text-center transition hover:bg-[#fafbfc] lg:items-stretch lg:p-2 lg:text-left ${
                  selected
                    ? "z-[1] bg-[#0d1f3c]/[0.06] shadow-[inset_0_0_0_2px_#0d1f3c] lg:shadow-[inset_0_0_0_2px_#0d1f3c]"
                    : ""
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold lg:h-6 lg:w-6 lg:text-xs ${
                    isToday
                      ? "bg-[#0d1f3c] text-white"
                      : selected
                        ? "bg-accent/15 text-[#0d1f3c]"
                        : "text-[#0d1f3c]"
                  }`}
                >
                  {cell.dayNumber}
                </span>
                {bookingCount === 0 ? (
                  <span className="mt-0.5 text-[8px] font-medium text-neutral-400 lg:mt-2 lg:text-[9px]">
                    —
                  </span>
                ) : (
                  <>
                    <p className="mt-0.5 text-[10px] font-bold leading-none tabular-nums text-[#0d1f3c] lg:hidden">
                      {bookingCount}
                    </p>
                    <ul className="mt-1 hidden min-h-0 flex-1 space-y-0.5 overflow-hidden lg:block">
                      {dayEvents.map((ev) => (
                        <li
                          key={ev.id}
                          className="truncate rounded bg-[#0d1f3c]/[0.06] px-1 py-0.5 text-[10px] font-semibold leading-tight text-[#0d1f3c]"
                          title={`${ev.start} ${ev.student}`}
                        >
                          <span className="tabular-nums text-accent">
                            {ev.start}
                          </span>{" "}
                          {ev.student !== "—" ? ev.student : ev.typeLabel}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
