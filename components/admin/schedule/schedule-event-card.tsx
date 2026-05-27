"use client";

import type { ScheduleEvent } from "@/lib/contracts/schedule";
import { ScheduleServiceMock } from "@/services/schedule/scheduleServiceMock";
import { FinancialStatusBadge } from "./financial-status-badge";

const STATUS_DOT: Record<string, string> = {
  confirmado: "bg-emerald-500",
  pendente: "bg-amber-500",
  em_andamento: "bg-sky-500",
  finalizado: "bg-neutral-400",
  cancelado: "bg-neutral-300",
  aguardando_pagamento: "bg-orange-500",
  reagendado: "bg-violet-500",
  no_show: "bg-red-500",
};

type Props = {
  event: ScheduleEvent;
  onClick: () => void;
  compact?: boolean;
};

export function ScheduleEventCard({ event, onClick, compact }: Props) {
  const dot = STATUS_DOT[event.status] ?? "bg-neutral-400";
  const statusLabels = ScheduleServiceMock.getEventStatusLabels();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-xl border border-[rgba(17,17,17,0.08)] bg-white text-left shadow-sm transition hover:border-accent/25 hover:shadow-md ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dot}`}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-sm font-black tabular-nums text-[#0d1f3c]">
              {event.start}
            </span>
            <FinancialStatusBadge status={event.payment} />
          </div>
          <p className="mt-1 font-bold text-[#0d1f3c]">{event.student}</p>
          <p className="text-xs font-semibold text-accent">{event.typeLabel}</p>
          {!compact ? (
            <>
              <p className="mt-2 text-xs text-neutral-600">
                Instrutor: {event.instructorName}
                {event.kartNumber > 0 ? ` · Kart ${event.kartNumber}` : ""}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase text-neutral-500">
                {statusLabels[event.status]}
              </p>
              {event.note ? (
                <p className="mt-1 truncate text-xs italic text-neutral-500">
                  {event.note}
                </p>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </button>
  );
}
