"use client";

import type { ScheduleEvent } from "@/lib/contracts/schedule";
import { getAppServices } from "@/lib/data-source/app-services";
import { FinancialStatusBadge } from "./financial-status-badge";
import { ScheduleDrawerShell } from "./schedule-drawer-shell";

type Props = {
  date: string | null;
  events: ScheduleEvent[];
  onClose: () => void;
  onEventClick: (eventId: string) => void;
};

export function ScheduleDayAppointmentsSheet({
  date,
  events,
  onClose,
  onEventClick,
}: Props) {
  const open = date !== null;
  const schedule = getAppServices().schedule;

  if (!open || !date) return null;

  const slots = schedule.groupDayEventsBySlot(events, date);
  const summary = schedule.getDaySummary(date);
  const title = schedule.formatDateLower(date);

  const occupancyLabel =
    slots.length === 0
      ? "Nenhuma reserva neste dia"
      : summary
        ? `${summary.bookingCount} reserva(s) · ${summary.occupancyPercent}% ocupação`
        : `${slots.length} horário(s) reservado(s)`;

  return (
    <div className="lg:hidden">
      <ScheduleDrawerShell
        open={open}
        onClose={onClose}
        title="Horários reservados"
        titleId="schedule-day-sheet-title"
        description={<span className="lowercase">{title}</span>}
        zIndexClass="z-[220]"
      >
        <div className="space-y-4 p-4 md:p-5">
          <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-[rgba(17,17,17,0.06)]">
            <p className="text-xs font-semibold text-neutral-600">{occupancyLabel}</p>
          </div>

          {slots.length === 0 ? (
            <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white px-6 py-12 text-center">
              <div>
                <p className="text-sm font-bold text-neutral-500">Sem agendamentos</p>
                <p className="mt-2 text-xs text-neutral-400">Este dia está livre na operação.</p>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {slots.map((slot) => (
                <li key={slot.time}>
                  <div className="overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-2 border-b border-[rgba(17,17,17,0.06)] bg-[#fafbfc] px-4 py-2.5">
                      <span className="text-sm font-black tabular-nums text-[#0d1f3c]">
                        {slot.time}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-accent">
                          {slot.category}
                        </span>
                        {slot.payment ? (
                          <FinancialStatusBadge status={slot.payment} />
                        ) : null}
                      </div>
                    </div>
                    <ul className="divide-y divide-[rgba(17,17,17,0.06)]">
                      {slot.events.map((ev) => (
                        <li key={ev.id}>
                          <button
                            type="button"
                            onClick={() => onEventClick(ev.id)}
                            className="flex w-full flex-col gap-1 px-4 py-3.5 text-left transition hover:bg-[#fafbfc] active:bg-white"
                          >
                            <span className="text-sm font-semibold text-[#0d1f3c]">
                              {ev.student}
                              {ev.kartNumber > 0 ? (
                                <span className="ml-1.5 font-normal text-neutral-600">
                                  · Kart {ev.kartNumber}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ScheduleDrawerShell>
    </div>
  );
}
