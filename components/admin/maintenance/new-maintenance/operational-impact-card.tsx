"use client";

import { NewMaintenanceServiceMock } from "@/services/maintenance/newMaintenanceServiceMock";

import { useState } from "react";


type Props = {
  returnEstimate: string;
  onReturnEstimateChange: (v: string) => void;
};

export function OperationalImpactCard({
  returnEstimate,
  onReturnEstimateChange,
}: Props) {
  const [removeFromSchedule, setRemoveFromSchedule] = useState(true);
  const [reschedule, setReschedule] = useState(false);

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">
        Agenda e impacto operacional
      </h2>
      <ul className="mt-3 space-y-2">
        {NewMaintenanceServiceMock.getAffectedBookings().map((b) => (
          <li
            key={b.id}
            className="flex justify-between rounded-lg bg-amber-50/80 px-3 py-2 text-xs ring-1 ring-amber-200/50"
          >
            <span className="font-bold text-amber-900">{b.title}</span>
            <span className="text-amber-800">
              {b.date}
              {b.pilot ? ` · ${b.pilot}` : ""}
            </span>
          </li>
        ))}
      </ul>
      <label className="mt-4 block">
        <span className="text-[10px] font-bold uppercase text-neutral-500">
          Previsão de retorno
        </span>
        <input
          type="text"
          value={returnEstimate}
          onChange={(e) => onReturnEstimateChange(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-3 py-2.5 text-sm font-semibold"
        />
      </label>
      <label className="mt-3 flex items-center gap-3">
        <input
          type="checkbox"
          checked={removeFromSchedule}
          onChange={(e) => setRemoveFromSchedule(e.target.checked)}
          className="h-5 w-5 rounded border-neutral-300 accent-[#0d1f3c]"
        />
        <span className="text-sm font-medium text-[#0d1f3c]">
          Remover automaticamente da agenda
        </span>
      </label>
      <label className="mt-2 flex items-center gap-3">
        <input
          type="checkbox"
          checked={reschedule}
          onChange={(e) => setReschedule(e.target.checked)}
          className="h-5 w-5 rounded border-neutral-300 accent-[#0d1f3c]"
        />
        <span className="text-sm font-medium text-[#0d1f3c]">
          Remarcar aulas afetadas
        </span>
      </label>
      <p className="mt-3 text-xs text-neutral-500">
        Disponibilidade futura recalculada após criação da OS (mock).
      </p>
    </section>
  );
}
