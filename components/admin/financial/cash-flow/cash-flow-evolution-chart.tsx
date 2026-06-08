"use client";

import type {
  CashFlowChartData,
  CashFlowChartGranularity,
  CashFlowPeriodFilter,
} from "@/lib/contracts/cashflow";

import { ThemedECharts } from "@/components/charts/themed-echarts";
import type { EChartsOption } from "echarts";
import { useMemo } from "react";

import { FinancialChartCard } from "../financial-chart-card";

function resolveGranularity(filter: CashFlowPeriodFilter): CashFlowChartGranularity {
  switch (filter.key) {
    case "today":
    case "week":
      return "daily";
    case "current-month":
      return "weekly";
    case "last-3-months":
    case "custom":
    default:
      return "monthly";
  }
}

type Props = {
  chartByGranularity: Record<CashFlowChartGranularity, CashFlowChartData>;
  periodLabel: string;
  filter: CashFlowPeriodFilter;
};

export function CashFlowEvolutionChart({
  chartByGranularity,
  periodLabel,
  filter,
}: Props) {
  const granularity = resolveGranularity(filter);
  const data = chartByGranularity[granularity];

  const option: EChartsOption = useMemo(
    () => ({
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
          name: "Saldo acumulado",
          type: "line",
          smooth: true,
          data: data.balance,
          lineStyle: { color: "#10b981", width: 2.5 },
          areaStyle: { color: "rgba(16,185,129,0.1)" },
          symbol: "circle",
          symbolSize: 6,
        },
      ],
    }),
    [data],
  );

  return (
    <FinancialChartCard
      title="Evolução do caixa"
      subtitle={`${periodLabel} — entradas, saídas e saldo acumulado (R$ mil)`}
      className="w-full"
    >
      <ThemedECharts option={option} style={{ height: 320 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}
