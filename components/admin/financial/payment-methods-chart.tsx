"use client";

import type { EChartsOption } from "echarts";
import { useMemo } from "react";

import { ThemedECharts } from "@/components/charts/themed-echarts";
import {
  adminChartLegendPercentClass,
  adminChartLegendTileClass,
  adminChartLegendValueClass,
  adminEmptyStateClass,
} from "@/lib/design";
import { useChartTheme } from "@/lib/hooks/use-chart-theme";
import { buildFinancialPieOption } from "./financial-pie-utils";
import {
  useInOutChart,
  usePaymentMethods,
  useRevenueByService,
  useFinancialEvolutionChart,
} from "@/lib/query/hooks/use-finance-charts";
import { FinancialChartCard } from "./financial-chart-card";

export function PaymentMethodsChart() {
  const chartTheme = useChartTheme();
  const { data: methods = [] } = usePaymentMethods();
  const methodsOption = useMemo(
    () =>
      buildFinancialPieOption(
        methods.map((m) => ({ name: m.name, value: m.value })),
        chartTheme,
        (name) => {
          const item = methods.find((m) => m.name === name);
          return item ? `${item.name}<br/>${item.amount} (${item.value}%)` : "";
        },
      ),
    [methods, chartTheme],
  );

  const hasData = methods.some((m) => m.value > 0);

  return (
    <FinancialChartCard
      title="Métodos de pagamento"
      subtitle="Distribuição do mês"
    >
      {!hasData ? (
        <p className={adminEmptyStateClass}>Nenhum pagamento no período.</p>
      ) : (
        <>
          <div className="mx-auto w-full min-h-[200px] max-w-[240px]">
            <ThemedECharts
              option={methodsOption}
              style={{ height: 200, width: "100%" }}
              opts={{ renderer: "svg" }}
            />
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {methods.map((m) => (
              <li key={m.name} className={adminChartLegendTileClass}>
                <p className="text-[10px] font-bold uppercase text-[var(--ds-text-muted)]">
                  {m.name}
                </p>
                <p className={adminChartLegendValueClass}>{m.amount}</p>
                <p className={adminChartLegendPercentClass}>{m.value}%</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </FinancialChartCard>
  );
}

export function RevenueByServiceChart() {
  const chartTheme = useChartTheme();
  const { data: services = [] } = useRevenueByService();
  const option = useMemo(
    () =>
      buildFinancialPieOption(
        services.map((s) => ({ name: s.name, value: s.value })),
        chartTheme,
      ),
    [services, chartTheme],
  );

  const hasData = services.some((s) => s.value > 0);

  return (
    <FinancialChartCard title="Receita por serviço" subtitle="Mix de receitas (R$ mil)">
      {!hasData ? (
        <p className={adminEmptyStateClass}>Nenhuma receita por serviço.</p>
      ) : (
        <div className="mx-auto w-full min-h-[200px] max-w-[240px]">
          <ThemedECharts
            option={option}
            style={{ height: 200, width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </div>
      )}
    </FinancialChartCard>
  );
}

export function InOutChart() {
  const chartTheme = useChartTheme();
  const { data: inOut } = useInOutChart();

  const option: EChartsOption = useMemo(() => {
    if (!inOut) return {};
    return {
      grid: { left: 44, right: 16, top: 20, bottom: 32 },
      tooltip: { trigger: "axis" },
      legend: { bottom: 0, textStyle: { fontSize: 10 } },
      xAxis: { type: "category", data: inOut.months },
      yAxis: {
        type: "value",
        axisLabel: { formatter: "R$ {value}k", fontSize: 10 },
      },
      series: [
        {
          name: "Entradas",
          type: "line",
          smooth: true,
          data: inOut.entries,
          lineStyle: { color: chartTheme.line, width: 2 },
          areaStyle: { color: chartTheme.area },
        },
        {
          name: "Saídas",
          type: "line",
          smooth: true,
          data: inOut.exits,
          lineStyle: { color: chartTheme.accent, width: 2 },
          areaStyle: { color: "rgba(196,30,58,0.12)" },
        },
      ],
    };
  }, [inOut, chartTheme]);

  if (!inOut) return null;

  return (
    <FinancialChartCard title="Entradas × saídas" subtitle="Comparativo mensal">
      <ThemedECharts option={option} style={{ height: 200 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}

export function FinancialEvolutionChart() {
  const chartTheme = useChartTheme();
  const { data: evolution } = useFinancialEvolutionChart();

  const option: EChartsOption = useMemo(() => {
    if (!evolution) return {};
    return {
      grid: { left: 44, right: 16, top: 20, bottom: 32 },
      tooltip: { trigger: "axis" },
      legend: { bottom: 0, textStyle: { fontSize: 10 } },
      xAxis: { type: "category", data: evolution.weeks },
      yAxis: { type: "value", axisLabel: { formatter: "R$ {value}k", fontSize: 10 } },
      series: [
        {
          name: "Receita",
          type: "bar",
          data: evolution.revenue,
          itemStyle: { color: chartTheme.line, borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 20,
        },
        {
          name: "Custos",
          type: "bar",
          data: evolution.costs,
          itemStyle: {
            color: chartTheme.area,
            borderRadius: [4, 4, 0, 0],
          },
          barMaxWidth: 20,
        },
        {
          name: "Margem",
          type: "line",
          smooth: true,
          data: evolution.margin,
          lineStyle: { color: "#10b981", width: 2 },
          symbol: "none",
        },
      ],
    };
  }, [evolution, chartTheme]);

  if (!evolution) return null;

  return (
    <FinancialChartCard title="Evolução financeira" subtitle="Receita, custos e margem">
      <ThemedECharts option={option} style={{ height: 200 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}
