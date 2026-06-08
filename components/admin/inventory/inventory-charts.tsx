"use client";

import { ThemedECharts } from "@/components/charts/themed-echarts";
import type { EChartsOption } from "echarts";
import { useMemo } from "react";
import { useChartTheme } from "@/lib/hooks/use-chart-theme";
import { useInventoryCharts } from "@/lib/query/hooks/use-inventory-charts";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";
import { FinancialChartCard } from "../financial/financial-chart-card";

function useChartData() {
  const { data } = useInventoryCharts();
  return {
    weeklyConsumption:
      data?.weeklyConsumption ?? InventoryServiceMock.getWeeklyConsumption(),
    consumptionByCategory:
      data?.consumptionByCategory ??
      InventoryServiceMock.getConsumptionByCategory(),
    monthlyMovements:
      data?.monthlyMovements ?? InventoryServiceMock.getMonthlyMovements(),
    topUsedParts: data?.topUsedParts ?? InventoryServiceMock.getTopUsedParts(),
    costByCategory:
      data?.costByCategory ?? InventoryServiceMock.getCostByCategory(),
  };
}

export function ConsumptionChart() {
  const chartTheme = useChartTheme();
  const { weeklyConsumption } = useChartData();
  const option: EChartsOption = useMemo(
    () => ({
      grid: { left: 40, right: 16, top: 24, bottom: 28 },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: weeklyConsumption.map((d) => d.day),
      },
      yAxis: { type: "value" },
      series: [
        {
          type: "bar",
          data: weeklyConsumption.map((d) => d.value),
          itemStyle: { color: chartTheme.line, borderRadius: [6, 6, 0, 0] },
          barWidth: "50%",
        },
      ],
    }),
    [weeklyConsumption, chartTheme],
  );

  return (
    <FinancialChartCard title="Consumo da semana" subtitle="Peças utilizadas por dia">
      <ThemedECharts option={option} style={{ height: 220 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}

export function MovementChart() {
  const { monthlyMovements } = useChartData();
  const option: EChartsOption = useMemo(
    () => ({
      grid: { left: 40, right: 16, top: 24, bottom: 28 },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: monthlyMovements.map((d) => d.month),
      },
      yAxis: { type: "value", splitLine: { show: false } },
      series: [
        {
          name: "Entradas",
          type: "line",
          smooth: true,
          data: monthlyMovements.map((d) => d.entrada),
          lineStyle: { color: "#059669", width: 2 },
          itemStyle: { color: "#059669" },
        },
        {
          name: "Saídas",
          type: "line",
          smooth: true,
          data: monthlyMovements.map((d) => d.saida),
          lineStyle: { color: "#c41e3a", width: 2 },
          itemStyle: { color: "#c41e3a" },
        },
      ],
    }),
    [monthlyMovements],
  );

  return (
    <FinancialChartCard title="Movimentações mensais" subtitle="Entradas vs saídas">
      <ThemedECharts option={option} style={{ height: 240 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}

export function CategoryConsumptionChart() {
  const chartTheme = useChartTheme();
  const { consumptionByCategory } = useChartData();
  const option: EChartsOption = useMemo(
    () => ({
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          radius: ["42%", "70%"],
          data: consumptionByCategory.map((d) => ({
            name: d.category,
            value: d.value,
          })),
          label: { fontSize: 11 },
          itemStyle: {
            borderRadius: 4,
            borderColor: chartTheme.pieBorder,
            borderWidth: 2,
          },
          color: [...chartTheme.palette, "#059669", "#d97706"],
        },
      ],
    }),
    [consumptionByCategory, chartTheme],
  );

  return (
    <FinancialChartCard title="Consumo por categoria" subtitle="Distribuição no mês">
      <ThemedECharts option={option} style={{ height: 220 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}

export function TopUsedPartsChart() {
  const chartTheme = useChartTheme();
  const { topUsedParts } = useChartData();
  const option: EChartsOption = useMemo(
    () => ({
      grid: { left: 120, right: 24, top: 8, bottom: 8 },
      xAxis: { type: "value", show: false },
      yAxis: {
        type: "category",
        data: topUsedParts.map((d) => d.name).reverse(),
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: "bar",
          data: topUsedParts.map((d) => d.count).reverse(),
          itemStyle: { color: chartTheme.line, borderRadius: [0, 6, 6, 0] },
          barWidth: 14,
        },
      ],
    }),
    [topUsedParts, chartTheme],
  );

  return (
    <FinancialChartCard title="Peças mais utilizadas" subtitle="Top 5 do mês">
      <ThemedECharts option={option} style={{ height: 200 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}

export function CostByCategoryChart() {
  const chartTheme = useChartTheme();
  const { costByCategory } = useChartData();
  const option: EChartsOption = useMemo(
    () => ({
      grid: { left: 48, right: 16, top: 24, bottom: 28 },
      tooltip: {
        trigger: "axis",
        formatter: (p) => {
          const item = Array.isArray(p) ? p[0] : p;
          if (!item?.value) return "";
          return `${item.name}<br/>R$ ${Number(item.value).toLocaleString("pt-BR")}`;
        },
      },
      xAxis: {
        type: "category",
        data: costByCategory.map((d) => d.category),
        axisLabel: { fontSize: 10, rotate: 20 },
      },
      yAxis: { type: "value", splitLine: { show: false } },
      series: [
        {
          type: "bar",
          data: costByCategory.map((d) => d.value),
          itemStyle: { color: chartTheme.line, borderRadius: [6, 6, 0, 0] },
        },
      ],
    }),
    [costByCategory, chartTheme],
  );

  return (
    <FinancialChartCard title="Custo por categoria" subtitle="Integração financeira">
      <ThemedECharts option={option} style={{ height: 220 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}
