"use client";

import type { ScheduleEvent } from "@/lib/contracts/schedule";
import { ScheduleServiceMock } from "@/services/schedule/scheduleServiceMock";
import { FinancialStatusBadge } from "./financial-status-badge";

type Props = {
  selectedDate: string;
  events: ScheduleEvent[];
  onEventClick: (id: string) => void;
};

export function DayReservationsSummary({
  selectedDate,
  events,
  onEventClick,
}: Props) {
  const slots = ScheduleServiceMock.groupDayEventsBySlot(events, selectedDate);
  const summary = ScheduleServiceMock.getDaySummary(selectedDate);
  const title = ScheduleServiceMock.formatDateLower(selectedDate);

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-sm">
      <div className="shrink-0 border-b border-[rgba(17,17,17,0.06)] px-4 py-4 md:px-5">
        <h2 className="text-sm font-bold text-[#0d1f3c]">Horários reservados</h2>
        <p className="mt-1 text-xs lowercase text-neutral-600">{title}</p>
        <p className="mt-2 text-xs font-semibold text-neutral-500">
          {slots.length === 0
            ? "Nenhuma reserva neste dia"
            : summary
              ? `${summary.bookingCount} reserva(s) · ${summary.occupancyPercent}% ocupação`
              : `${slots.length} horário(s) reservado(s)`}
        </p>
      </div>

      {slots.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-5 py-12 text-center">
          <div>
            <p className="text-sm font-bold text-neutral-500">
              Sem agendamentos
            </p>
            <p className="mt-2 text-xs text-neutral-400">
              Este dia está livre na operação.
            </p>
          </div>
        </div>
      ) : (
        <ul className="min-h-0 flex-1 divide-y divide-[rgba(17,17,17,0.06)] overflow-y-auto app-scrollbar">
          {slots.map((slot) => (
            <li key={slot.time}>
              <button
                type="button"
                onClick={() => onEventClick(slot.events[0].id)}
                className="flex w-full flex-col gap-2 px-4 py-3 text-left transition hover:bg-[#fafbfc] md:px-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-black tabular-nums text-[#0d1f3c]">
                    {slot.time}
                  </span>
                  {slot.payment ? (
                    <FinancialStatusBadge status={slot.payment} />
                  ) : null}
                </div>
                <span className="text-xs font-bold uppercase tracking-wide text-accent">
                  {slot.category}
                </span>
                <ul className="space-y-1">
                  {slot.events.map((ev) => (
                    <li
                      key={ev.id}
                      className="text-sm font-semibold text-[#0d1f3c]"
                    >
                      {ev.student}
                      {ev.kartNumber > 0 ? (
                        <span className="ml-1.5 font-normal text-neutral-600">
                          · Kart {ev.kartNumber}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
