"use client";

import { useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { CashFlowPeriod } from "@/lib/contracts/cashflow";
import { CashFlowServiceMock } from "@/services/cashflow/cashFlowServiceMock";
import { FinancialChartCard } from "../financial-chart-card";

const PERIOD_LABELS: { key: CashFlowPeriod; label: string }[] = [
  { key: "daily", label: "Diário" },
  { key: "weekly", label: "Semanal" },
  { key: "monthly", label: "Mensal" },
];

type Props = {
  tall?: boolean;
};

export function CashFlowChart({ tall = true }: Props) {
  const [period, setPeriod] = useState<CashFlowPeriod>("monthly");
  const data = CashFlowServiceMock.getCashFlowByPeriod()[period];

  const option: EChartsOption = {
    grid: { left: 52, right: 20, top: 32, bottom: 48 },
    tooltip: {
      trigger: "axis",
      formatter: (params: unknown) => {
        const items = Array.isArray(params) ? params : [params];
        return items
          .map((p) => {
            const pt = p as { seriesName?: string; value?: number };
            const v = Math.abs(Number(pt.value ?? 0));
            return `${pt.seriesName}: R$ ${v.toFixed(1)}k`;
          })
          .join("<br/>");
      },
    },
    legend: {
      bottom: 0,
      textStyle: { fontSize: 11, color: "#666" },
    },
    xAxis: {
      type: "category",
      data: data.labels,
      axisLine: { lineStyle: { color: "rgba(17,17,17,0.12)" } },
      axisLabel: { color: "#666", fontSize: 11 },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: "rgba(17,17,17,0.06)" } },
      axisLabel: { color: "#666", fontSize: 11, formatter: "R$ {value}k" },
    },
    series: [
      {
        name: "Entradas",
        type: "bar",
        data: data.entries,
        itemStyle: { color: "#0d1f3c", borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 28,
      },
      {
        name: "Saídas",
        type: "bar",
        data: data.exits,
        itemStyle: { color: "rgba(196,30,58,0.65)", borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 28,
      },
      {
        name: "Saldo",
        type: "line",
        smooth: true,
        data: data.balance,
        lineStyle: { color: "#10b981", width: 2.5 },
        areaStyle: { color: "rgba(16,185,129,0.1)" },
        symbol: "circle",
        symbolSize: 6,
        yAxisIndex: 0,
      },
    ],
  };

  return (
    <FinancialChartCard
      title="Fluxo de caixa"
      subtitle="Entradas, saídas e evolução do saldo"
      className="w-full"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {PERIOD_LABELS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPeriod(p.key)}
            className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition ${
              period === p.key
                ? "bg-[#0d1f3c] text-white"
                : "bg-[#fafbfc] text-[#0d1f3c] ring-1 ring-[rgba(17,17,17,0.08)] hover:ring-accent/25"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <ReactECharts
        option={option}
        style={{ height: tall ? 340 : 260 }}
        opts={{ renderer: "svg" }}
      />
    </FinancialChartCard>
  );
}
