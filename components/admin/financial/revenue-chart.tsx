"use client";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";
import { FinancialChartCard } from "./financial-chart-card";

export function RevenueChart() {
  const monthlyRevenueChart = FinancialServiceMock.getMonthlyRevenueChart();
  const option: EChartsOption = {
    grid: { left: 44, right: 16, top: 24, bottom: 32 },
    tooltip: { trigger: "axis" },
    legend: {
      bottom: 0,
      textStyle: { fontSize: 10, color: "#666" },
    },
    xAxis: {
      type: "category",
      data: monthlyRevenueChart.months,
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
        name: "Realizado",
        type: "bar",
        data: monthlyRevenueChart.revenue,
        itemStyle: { color: "#0d1f3c", borderRadius: [6, 6, 0, 0] },
        barMaxWidth: 28,
      },
      {
        name: "Previsto",
        type: "line",
        smooth: true,
        data: monthlyRevenueChart.forecast,
        lineStyle: { color: "var(--color-accent, #c41e3a)", width: 2 },
        symbol: "circle",
        symbolSize: 6,
      },
    ],
  };

  return (
    <FinancialChartCard title="Receita mensal" subtitle="Realizado vs. previsto (R$ mil)">
      <ReactECharts option={option} style={{ height: 220 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}
