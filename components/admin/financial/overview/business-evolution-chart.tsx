"use client";

import type { BusinessEvolutionPeriod } from "@/lib/admin-financial-mocks";

import { ThemedECharts } from "@/components/charts/themed-echarts";
import type { EChartsOption } from "echarts";
import { useMemo, useState } from "react";

import {
  adminFilterPillActiveClass,
  adminFilterPillClass,
} from "@/lib/design";
import { useChartTheme } from "@/lib/hooks/use-chart-theme";
import { useBusinessEvolution } from "@/lib/query/hooks/use-finance-charts";
import { FinancialChartCard } from "../financial-chart-card";

const PERIOD_LABELS: { key: BusinessEvolutionPeriod; label: string }[] = [
  { key: "3m", label: "3 meses" },
  { key: "6m", label: "6 meses" },
  { key: "12m", label: "12 meses" },
];

export function BusinessEvolutionChart() {
  const [period, setPeriod] = useState<BusinessEvolutionPeriod>("6m");
  const { data } = useBusinessEvolution(period);
  const chartTheme = useChartTheme();

  const option: EChartsOption = useMemo(() => {
    if (!data) return {};
    return {
      grid: { left: 48, right: 16, top: 28, bottom: 40 },
      tooltip: { trigger: "axis" },
      legend: { bottom: 0, textStyle: { fontSize: 10 } },
      xAxis: {
        type: "category",
        data: data.labels,
        axisLabel: { fontSize: 10 },
      },
      yAxis: {
        type: "value",
        axisLabel: { fontSize: 10, formatter: "R$ {value}k" },
      },
      series: [
        {
          name: "Receita",
          type: "bar",
          data: data.revenue,
          itemStyle: { color: chartTheme.line, borderRadius: [4, 4, 0, 0] },
          barMaxWidth: period === "12m" ? 16 : 24,
        },
        {
          name: "Lucro",
          type: "bar",
          data: data.profit,
          itemStyle: { color: chartTheme.area, borderRadius: [4, 4, 0, 0] },
          barMaxWidth: period === "12m" ? 16 : 24,
        },
        {
          name: "Meta",
          type: "line",
          smooth: true,
          data: data.goal,
          lineStyle: {
            color: chartTheme.accent,
            width: 2,
            type: "dashed",
          },
          symbol: "circle",
          symbolSize: 5,
        },
      ],
    };
  }, [data, period, chartTheme]);

  if (!data) return null;

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
            className={
              period === key ? adminFilterPillActiveClass : adminFilterPillClass
            }
          >
            {label}
          </button>
        ))}
      </div>
      <ThemedECharts
        option={option}
        style={{ height: 260 }}
        opts={{ renderer: "svg" }}
      />
    </FinancialChartCard>
  );
}
