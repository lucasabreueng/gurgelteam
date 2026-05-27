"use client";

import { useState } from "react";
import type { DailyCashEntry } from "@/lib/contracts/cashflow";
import { CashFlowServiceMock } from "@/services/cashflow/cashFlowServiceMock";
import { FinancialChartCard } from "../financial-chart-card";

type Props = {
  expanded?: boolean;
};

function DailyRow({
  entry,
  maxBalance,
}: {
  entry: DailyCashEntry;
  maxBalance: number;
}) {
  const pct = Math.max(8, (entry.balance / maxBalance) * 100);

  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-12 shrink-0 text-[11px] font-semibold tabular-nums text-neutral-600">
        {entry.date}
      </span>
      <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[rgba(13,31,60,0.06)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#0d1f3c] to-accent/80"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-24 shrink-0 text-right text-[11px] font-bold tabular-nums text-[#0d1f3c]">
        {entry.balanceLabel}
      </span>
    </div>
  );
}

export function DailyCashCard({ expanded = false }: Props) {
  const [showFull, setShowFull] = useState(expanded);
  const fullEntries = CashFlowServiceMock.getDailyCashFull();
  const entries = showFull
    ? fullEntries
    : CashFlowServiceMock.getDailyCashPreview();
  const maxBalance = Math.max(...fullEntries.map((e) => e.balance));

  return (
    <FinancialChartCard
      title="Caixa diário"
      subtitle="Saldo acumulado por dia · junho/2025"
    >
      <div className="space-y-0.5">
        {entries.map((entry) => (
          <DailyRow key={entry.dateIso} entry={entry} maxBalance={maxBalance} />
        ))}
      </div>
      {!expanded ? (
        <button
          type="button"
          onClick={() => setShowFull((v) => !v)}
          className="mt-4 w-full rounded-xl border border-[rgba(13,31,60,0.2)] bg-transparent py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/40 hover:bg-white"
        >
          {showFull ? "Mostrar menos" : "Ver fluxo diário completo"}
        </button>
      ) : null}
    </FinancialChartCard>
  );
}
