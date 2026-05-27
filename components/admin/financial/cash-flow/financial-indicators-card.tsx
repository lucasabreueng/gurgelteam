"use client";

import { HiInformationCircle } from "react-icons/hi2";
import { CashFlowServiceMock } from "@/services/cashflow/cashFlowServiceMock";
import { FinancialChartCard } from "../financial-chart-card";

export function FinancialIndicatorsCard() {
  return (
    <FinancialChartCard
      title="Indicadores financeiros"
      subtitle="Margens, equilíbrio e giro de caixa"
    >
      <ul className="space-y-3">
        {CashFlowServiceMock.getIndicators().map((ind) => (
          <li
            key={ind.id}
            className="flex items-center justify-between gap-3 rounded-xl bg-[#fafbfc] px-3 py-3 ring-1 ring-[rgba(17,17,17,0.06)]"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(13,31,60,0.06)] text-[#0d1f3c]">
                <HiInformationCircle className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#0d1f3c]">{ind.label}</p>
                <p className="truncate text-[10px] text-neutral-500" title={ind.tooltip}>
                  {ind.tooltip}
                </p>
              </div>
            </div>
            <span className="shrink-0 text-base font-bold tabular-nums text-[#0d1f3c]">
              {ind.value}
            </span>
          </li>
        ))}
      </ul>
    </FinancialChartCard>
  );
}
