"use client";

import { useMemo } from "react";

import { ThemedECharts } from "@/components/charts/themed-echarts";
import {
  adminChartLegendLabelClass,
  adminChartLegendPercentClass,
  adminChartLegendTileClass,
  adminChartLegendValueClass,
  adminEmptyStateClass,
} from "@/lib/design";
import { useChartTheme } from "@/lib/hooks/use-chart-theme";
import { useRevenueOrigin } from "@/lib/query/hooks/use-finance-charts";
import { buildFinancialPieOption } from "../financial-pie-utils";
import { FinancialChartCard } from "../financial-chart-card";

export function RevenueOriginChart() {
  const chartTheme = useChartTheme();
  const { data: items = [] } = useRevenueOrigin();

  const option = useMemo(
    () =>
      buildFinancialPieOption(
        items.map((item) => ({ name: item.name, value: item.value })),
        chartTheme,
        (name) => {
          const item = items.find((i) => i.name === name);
          if (!item) return "";
          return `${item.name}<br/>${item.amount} (${item.percent}%)`;
        },
      ),
    [items, chartTheme],
  );

  const hasData = items.some((item) => item.value > 0);

  return (
    <FinancialChartCard
      title="Origem das receitas"
      subtitle="Mix de serviços do mês"
    >
      {!hasData ? (
        <p className={adminEmptyStateClass}>
          Nenhuma receita registrada no período.
        </p>
      ) : (
        <div className="grid items-center gap-4 md:grid-cols-2">
          <div className="mx-auto w-full min-h-[220px] max-w-[240px]">
            <ThemedECharts
              option={option}
              style={{ height: 220, width: "100%" }}
              opts={{ renderer: "svg" }}
            />
          </div>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li
                key={item.name}
                className={`flex items-center justify-between gap-3 ${adminChartLegendTileClass}`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        chartTheme.palette[i % chartTheme.palette.length],
                    }}
                    aria-hidden
                  />
                  <span className={adminChartLegendLabelClass}>{item.name}</span>
                </div>
                <div className="shrink-0 text-right">
                  <p className={adminChartLegendValueClass}>{item.amount}</p>
                  <p className={adminChartLegendPercentClass}>{item.percent}%</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </FinancialChartCard>
  );
}
