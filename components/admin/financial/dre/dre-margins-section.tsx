"use client";

import type { DreMargin } from "@/lib/admin-dre-mocks";

import { FinancialChartCard } from "../financial-chart-card";

type Props = {
  margins: DreMargin[];
};

export function DreMarginsSection({ margins }: Props) {
  return (
    <FinancialChartCard title="Margens" subtitle="Indicadores de rentabilidade do período">
      <div className="grid gap-3 sm:grid-cols-3">
        {margins.map((margin) => (
          <div
            key={margin.id}
            className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-4"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              {margin.label}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-[#0d1f3c]">
              {margin.percent.toFixed(1).replace(".", ",")}%
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-neutral-600">
              {margin.description}
            </p>
          </div>
        ))}
      </div>
    </FinancialChartCard>
  );
}
