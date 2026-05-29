"use client";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { useMemo } from "react";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";
import { FinancialChartCard } from "../financial/financial-chart-card";

const weeklyConsumption = InventoryServiceMock.getWeeklyConsumption();
const consumptionByCategory = InventoryServiceMock.getConsumptionByCategory();
const monthlyMovements = InventoryServiceMock.getMonthlyMovements();
const topUsedParts = InventoryServiceMock.getTopUsedParts();
const costByCategory = InventoryServiceMock.getCostByCategory();

export function ConsumptionChart() {
  const option: EChartsOption = useMemo(
    () => ({
      grid: { left: 40, right: 16, top: 24, bottom: 28 },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: weeklyConsumption.map((d) => d.day),
        axisLine: { lineStyle: { color: "rgba(17,17,17,0.12)" } },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "rgba(17,17,17,0.06)" } },
      },
      series: [
        {
          type: "bar",
          data: weeklyConsumption.map((d) => d.value),
          itemStyle: { color: "#0d1f3c", borderRadius: [6, 6, 0, 0] },
          barWidth: "50%",
        },
      ],
    }),
    []
  );

  return (
    <FinancialChartCard title="Consumo da semana" subtitle="Peças utilizadas por dia">
      <ReactECharts option={option} style={{ height: 220 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}

export function MovementChart() {
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
    []
  );

  return (
    <FinancialChartCard title="Movimentações mensais" subtitle="Entradas vs saídas">
      <ReactECharts option={option} style={{ height: 240 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}

export function CategoryConsumptionChart() {
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
          itemStyle: { borderRadius: 4, borderColor: "#fff", borderWidth: 2 },
          color: ["#0d1f3c", "#1e3a5f", "#c41e3a", "#059669", "#d97706"],
        },
      ],
    }),
    []
  );

  return (
    <FinancialChartCard title="Consumo por categoria" subtitle="Distribuição no mês">
      <ReactECharts option={option} style={{ height: 220 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}

export function TopUsedPartsChart() {
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
          itemStyle: { color: "#0d1f3c", borderRadius: [0, 6, 6, 0] },
          barWidth: 14,
        },
      ],
    }),
    []
  );

  return (
    <FinancialChartCard title="Peças mais utilizadas" subtitle="Top 5 do mês">
      <ReactECharts option={option} style={{ height: 200 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}

export function CostByCategoryChart() {
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
          itemStyle: { color: "#0d1f3c", borderRadius: [6, 6, 0, 0] },
        },
      ],
    }),
    []
  );

  return (
    <FinancialChartCard title="Custo por categoria" subtitle="Integração financeira">
      <ReactECharts option={option} style={{ height: 220 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}
