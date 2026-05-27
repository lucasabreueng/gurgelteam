"use client";

import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import type { ScheduleEvent, ScheduleViewKey } from "@/lib/contracts/schedule";
import { getAppServices } from "@/lib/data-source/app-services";
import { useScheduleMeta } from "@/lib/query/hooks/use-schedule";
import { ScheduleViewToggle } from "./schedule-tabs";

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

type Props = {
  events: ScheduleEvent[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  view: ScheduleViewKey;
  onViewChange: (view: ScheduleViewKey) => void;
};

function shiftMonth(year: number, month: number, delta: number) {
  const date = new Date(year, month - 1 + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function MonthWeekGrid({
  events,
  selectedDate,
  onSelectDate,
  view,
  onViewChange,
}: Props) {
  const schedule = getAppServices().schedule;
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

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-sm">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-[rgba(17,17,17,0.06)] px-4 py-4 md:px-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(13,31,60,0.2)] text-[#0d1f3c] transition hover:border-[#0d1f3c] hover:bg-[#fafbfc]"
              aria-label="Mês anterior"
            >
              <HiChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <h2 className="text-base font-bold text-[#0d1f3c]">{monthLabel}</h2>
            <button
              type="button"
              onClick={goToNextMonth}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(13,31,60,0.2)] text-[#0d1f3c] transition hover:border-[#0d1f3c] hover:bg-[#fafbfc]"
              aria-label="Próximo mês"
            >
              <HiChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
        <ScheduleViewToggle active={view} onChange={onViewChange} />
      </div>
      <div className="grid shrink-0 grid-cols-7 border-b border-[rgba(17,17,17,0.06)] bg-[#fafbfc]">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="px-1 py-2 text-center text-[10px] font-bold uppercase tracking-wide text-neutral-500"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded-b-2xl bg-[rgba(17,17,17,0.06)] p-px">
        <div
          className="grid h-full grid-cols-7 gap-px"
          style={{ gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` }}
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

            return (
              <button
                key={cell.date}
                type="button"
                onClick={() => onSelectDate(cell.date!)}
                className={`flex min-h-0 flex-col bg-white p-1.5 text-left transition hover:bg-[#fafbfc] sm:p-2 ${
                  selected
                    ? "ring-2 ring-inset ring-[#0d1f3c] bg-[#0d1f3c]/[0.03]"
                    : ""
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                    isToday
                      ? "bg-[#0d1f3c] text-white"
                      : selected
                        ? "bg-accent/15 text-[#0d1f3c]"
                        : "text-[#0d1f3c]"
                  }`}
                >
                  {cell.dayNumber}
                </span>
                {dayEvents.length === 0 ? (
                  <span className="mt-2 text-[9px] font-medium text-neutral-400">
                    —
                  </span>
                ) : (
                  <ul className="mt-1 min-h-0 flex-1 space-y-0.5 overflow-hidden">
                    {dayEvents.map((ev) => (
                      <li
                        key={ev.id}
                        className="truncate rounded bg-[#0d1f3c]/[0.06] px-1 py-0.5 text-[9px] font-semibold leading-tight text-[#0d1f3c] sm:text-[10px]"
                        title={`${ev.start} ${ev.student}`}
                      >
                        <span className="tabular-nums text-accent">
                          {ev.start}
                        </span>{" "}
                        {ev.student !== "—" ? ev.student : ev.typeLabel}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
