"use client";

import type { FleetKartListItem } from "@/lib/contracts/karts";

export function PreventiveMaintenanceCell({
  kart,
}: {
  kart: Pick<FleetKartListItem, "usageHours" | "preventiveMaintenance">;
}) {
  const { mostUrgent } = kart.preventiveMaintenance;
  const tone = mostUrgent.overdue
    ? "text-[var(--ds-error-text)]"
    : mostUrgent.hoursRemaining <= 2
      ? "text-amber-800"
      : "text-[var(--ds-text-secondary)]";

  return (
    <div className="min-w-[180px]">
      <p className={`text-[13px] font-semibold leading-snug ${tone}`}>
        {mostUrgent.displayLabel}
      </p>
      <p className="mt-0.5 text-[11px] text-[var(--ds-text-muted)]">
        Motor: {kart.usageHours.toLocaleString("pt-BR")}h · próx. em{" "}
        {mostUrgent.nextDueHours.toLocaleString("pt-BR")}h
      </p>
    </div>
  );
}

export function CorrectiveMaintenanceCell({
  kart,
}: {
  kart: Pick<FleetKartListItem, "correctiveMaintenance">;
}) {
  const { correctiveMaintenance } = kart;
  if (correctiveMaintenance.status === "none") {
    return <span className="text-neutral-500">—</span>;
  }

  const tone =
    correctiveMaintenance.status === "checklist_aberto"
      ? "text-amber-900 bg-amber-50 ring-amber-200/60"
      : "text-sky-900 bg-sky-50 ring-sky-200/60";

  return (
    <span
      className={`inline-flex max-w-[220px] rounded-lg px-2 py-1 text-[11px] font-semibold leading-snug ring-1 ${tone}`}
    >
      {correctiveMaintenance.label}
    </span>
  );
}
