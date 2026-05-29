"use client";

import type { ReactNode } from "react";
import { formatBrlDisplay } from "./billing-utils";

type SummaryProps = {
  clientName: string;
  amount: number;
  situationLabel: string;
  partyLabel?: string;
};

export function BillingSummaryPanel({
  clientName,
  amount,
  situationLabel,
  partyLabel = "Cliente",
}: SummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <SummaryChip label="Valor" value={formatBrlDisplay(amount)} emphasis />
      <SummaryChip label={partyLabel} value={clientName || "—"} />
      <SummaryChip label="Situação" value={situationLabel} />
    </div>
  );
}

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
      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">{label}</p>
      <p
        className={`mt-0.5 truncate tabular-nums ${emphasis ? "text-base font-bold text-[#0d1f3c]" : "text-[12px] font-semibold text-neutral-800"}`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

export function BillingFormCard({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm md:p-5">
      {children}
    </div>
  );
}
