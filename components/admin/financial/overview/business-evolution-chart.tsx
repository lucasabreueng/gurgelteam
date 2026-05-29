"use client";

import type { BusinessEvolutionPeriod } from "@/lib/admin-financial-mocks";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { useMemo, useState } from "react";

import { FinancialChartCard } from "../financial-chart-card";

const PERIOD_LABELS: { key: BusinessEvolutionPeriod; label: string }[] = [
  { key: "3m", label: "3 meses" },
  { key: "6m", label: "6 meses" },
  { key: "12m", label: "12 meses" },
];

export function BusinessEvolutionChart() {
  const [period, setPeriod] = useState<BusinessEvolutionPeriod>("6m");
  const data = FinancialServiceMock.getBusinessEvolution()[period];

  const option: EChartsOption = useMemo(
    () => ({
      grid: { left: 48, right: 16, top: 28, bottom: 40 },
      tooltip: { trigger: "axis" },
      legend: {
        bottom: 0,
        textStyle: { fontSize: 10, color: "#666" },
      },
      xAxis: {
        type: "category",
        data: data.labels,
        axisLine: { lineStyle: { color: "rgba(17,17,17,0.12)" } },
        axisLabel: { color: "#666", fontSize: 10 },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "rgba(17,17,17,0.06)" } },
        axisLabel: { color: "#666", fontSize: 10, formatter: "R$ {value}k" },
      },
      series: [
        {
          name: "Receita",
          type: "bar",
          data: data.revenue,
          itemStyle: { color: "#0d1f3c", borderRadius: [4, 4, 0, 0] },
          barMaxWidth: period === "12m" ? 16 : 24,
        },
        {
          name: "Lucro",
          type: "bar",
          data: data.profit,
          itemStyle: { color: "rgba(13,31,60,0.35)", borderRadius: [4, 4, 0, 0] },
          barMaxWidth: period === "12m" ? 16 : 24,
        },
        {
          name: "Meta",
          type: "line",
          smooth: true,
          data: data.goal,
          lineStyle: { color: "var(--color-accent, #c41e3a)", width: 2, type: "dashed" },
          symbol: "circle",
          symbolSize: 5,
        },
      ],
    }),
    [data, period]
  );

  return (
    <FinancialChartCard
      title="Evolução do negócio"
      subtitle="Receita, lucro e meta — foco em crescimento (R$ mil)"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {PERIOD_LABELS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setPeriod(key)}
            className={`rounded-xl px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
              period === key
                ? "bg-[#0d1f3c] text-white"
                : "bg-[#fafbfc] text-neutral-600 ring-1 ring-[rgba(17,17,17,0.08)] hover:ring-accent/30"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <ReactECharts
        option={option}
        style={{ height: 260 }}
        opts={{ renderer: "svg" }}
      />
    </FinancialChartCard>
  );
}
