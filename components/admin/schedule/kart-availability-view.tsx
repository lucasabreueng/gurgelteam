"use client";

import type { KartScheduleRow } from "@/lib/contracts/schedule";
import { KartStatusBadge } from "./kart-status-badge";
import { HiExclamationTriangle } from "react-icons/hi2";

type Props = { rows: KartScheduleRow[] };

export function KartAvailabilityView({ rows }: Props) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => (
        <article
          key={row.kartId}
          className={`rounded-2xl border p-4 shadow-sm ${
            row.maintenance || row.checklistPending
              ? "border-amber-200/60 bg-amber-50/30"
              : "border-[rgba(17,17,17,0.08)] bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-[#0d1f3c]">
              #{row.number}
            </span>
            <KartStatusBadge status={row.status} />
          </div>
          <dl className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Agora</dt>
              <dd className="font-bold text-[#0d1f3c]">{row.currentSlot}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Próximo</dt>
              <dd className="font-semibold">{row.nextSlot ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Reservas hoje</dt>
              <dd className="font-semibold tabular-nums">{row.reservations}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Uso do dia</dt>
              <dd className="font-semibold">{row.usageToday}</dd>
            </div>
          </dl>
          {row.maintenance ? (
            <p className="mt-3 flex items-center gap-1 text-[10px] font-bold text-amber-800">
              <HiExclamationTriangle className="h-4 w-4" />
              Removido da disponibilidade · retorno 17h
            </p>
          ) : null}
          {row.checklistPending ? (
            <p className="mt-1 text-[10px] font-bold text-red-700">
              Checklist pendente
            </p>
          ) : null}
        </article>
      ))}
    </section>
  );
}
