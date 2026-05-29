"use client";

import type { ChecklistFinalStatus } from "@/lib/contracts/maintenance/complete-checklist";
import { CHECKLIST_FINAL_STATUS_LABELS } from "@/lib/contracts/maintenance/complete-checklist";

type Props = {
  kartLabel: string;
  typeLabel: string;
  status: ChecklistFinalStatus;
};

function SummaryChip({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-[rgba(17,17,17,0.08)] bg-white px-2.5 py-1.5">
      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      <p
        className={`mt-0.5 truncate ${emphasis ? "text-base font-bold text-[#0d1f3c]" : "text-[12px] font-semibold text-neutral-800"}`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

export function ChecklistSummaryPanel({ kartLabel, typeLabel, status }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <SummaryChip label="Kart" value={kartLabel || "—"} emphasis />
      <SummaryChip label="Tipo" value={typeLabel || "—"} />
      <SummaryChip
        label="Resultado"
        value={CHECKLIST_FINAL_STATUS_LABELS[status]}
      />
    </div>
  );
}
