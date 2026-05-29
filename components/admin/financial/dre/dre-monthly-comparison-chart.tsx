"use client";

import type { DreMonthlyComparison } from "@/lib/admin-dre-mocks";
import { formatDrePeriodLabel } from "@/lib/admin-dre-mocks";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { useMemo } from "react";

import { FinancialChartCard } from "../financial-chart-card";

type Props = {
  data: DreMonthlyComparison;
  periodLabel?: string;
};

export function DreMonthlyComparisonChart({ data, periodLabel }: Props) {
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
          barMaxWidth: 18,
        },
        {
          name: "Custos",
          type: "bar",
          data: data.costs,
          itemStyle: { color: "rgba(13,31,60,0.28)", borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 18,
        },
        {
          name: "Lucro líquido",
          type: "line",
          smooth: true,
          data: data.netProfit,
          lineStyle: { color: "var(--color-accent, #c41e3a)", width: 2 },
          symbol: "circle",
          symbolSize: 5,
        },
      ],
    }),
    [data]
  );

  return (
    <FinancialChartCard
      title="Comparativo mensal"
      subtitle={
        periodLabel
          ? `${formatDrePeriodLabel(periodLabel)} — receita, custos e lucro (R$ mil)`
          : "Resultado econômico do período (R$ mil)"
      }
    >
      <ReactECharts
        option={option}
        style={{ height: 280 }}
        opts={{ renderer: "svg" }}
      />
    </FinancialChartCard>
  );
}
