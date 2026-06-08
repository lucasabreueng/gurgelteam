"use client";

import type { EChartsOption } from "echarts";
import { useMemo } from "react";

import { ThemedECharts } from "@/components/charts/themed-echarts";
import { useChartTheme } from "@/lib/hooks/use-chart-theme";
import { useMonthlyRevenueChart } from "@/lib/query/hooks/use-finance-charts";
import { FinancialChartCard } from "./financial-chart-card";

export function RevenueChart() {
  const { data: monthlyRevenueChart } = useMonthlyRevenueChart();
  const chartTheme = useChartTheme();

  const option: EChartsOption = useMemo(() => {
    if (!monthlyRevenueChart) return {};
    return {
      grid: { left: 44, right: 16, top: 24, bottom: 32 },
      tooltip: { trigger: "axis" },
      legend: { bottom: 0, textStyle: { fontSize: 10 } },
      xAxis: {
        type: "category",
        data: monthlyRevenueChart.months,
      },
      yAxis: {
        type: "value",
        axisLabel: { fontSize: 10, formatter: "R$ {value}k" },
      },
      series: [
        {
          name: "Realizado",
          type: "bar",
          data: monthlyRevenueChart.revenue,
          itemStyle: { color: chartTheme.line, borderRadius: [6, 6, 0, 0] },
          barMaxWidth: 28,
        },
        {
          name: "Previsto",
          type: "line",
          smooth: true,
          data: monthlyRevenueChart.forecast,
          lineStyle: { color: chartTheme.accent, width: 2 },
          symbol: "circle",
          symbolSize: 6,
        },
      ],
    };
  }, [monthlyRevenueChart, chartTheme]);

  if (!monthlyRevenueChart) return null;

  return (
    <FinancialChartCard title="Receita mensal" subtitle="Realizado vs. previsto (R$ mil)">
      <ThemedECharts option={option} style={{ height: 220 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}
