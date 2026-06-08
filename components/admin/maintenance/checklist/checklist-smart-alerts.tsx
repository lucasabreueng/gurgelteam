"use client";

import { useChecklistContext } from "@/lib/query/hooks/use-checklist-context";
import { HiExclamationTriangle, HiInformationCircle } from "react-icons/hi2";

export function ChecklistSmartAlerts() {
  const { data, isLoading } = useChecklistContext();
  const alerts = data?.smartAlerts ?? [];

  if (isLoading) {
    return <p className="text-xs text-neutral-500">Carregando alertas…</p>;
  }

  if (alerts.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[rgba(17,17,17,0.12)] bg-white px-3 py-4 text-xs text-neutral-500">
        Nenhum alerta ativo no momento.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {alerts.map((a) => (
        <li
          key={a.id}
          className={`flex gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium leading-snug ${
            a.severity === "urgent"
              ? "border-red-200/60 bg-red-50/90 text-red-950"
              : a.severity === "warn"
                ? "border-amber-200/60 bg-amber-50/90 text-amber-950"
                : "border-sky-200/60 bg-sky-50/90 text-sky-950"
          }`}
        >
          {a.severity === "info" ? (
            <HiInformationCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <HiExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          {a.message}
        </li>
      ))}
    </ul>
  );
}
