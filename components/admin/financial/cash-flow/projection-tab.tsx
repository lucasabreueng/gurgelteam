"use client";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { CashFlowServiceMock } from "@/services/cashflow/cashFlowServiceMock";
import { KpiCard } from "@/components/ui/kpi-card";
import { FinancialChartCard } from "../financial-chart-card";

export function ProjectionTab() {
  const p = CashFlowServiceMock.getProjection();
  const projectionKpis = [
    { label: "Saldo projetado", value: p.projectedBalance },
    { label: "Entradas previstas", value: p.projectedEntries },
    { label: "Saídas previstas", value: p.projectedExits },
    { label: "Contas a receber", value: p.receivables },
    { label: "Custos esperados", value: p.expectedCosts },
    { label: "Resultado previsto", value: p.projectedResult },
  ];

  const option: EChartsOption = {
    grid: { left: 48, right: 16, top: 28, bottom: 40 },
    tooltip: { trigger: "axis" },
    legend: { bottom: 0, textStyle: { fontSize: 10 } },
    xAxis: { type: "category", data: p.months },
    yAxis: {
      type: "value",
      axisLabel: { formatter: "R$ {value}k", fontSize: 10 },
    },
    series: [
      {
        name: "Saldo projetado",
        type: "line",
        smooth: true,
        data: p.balanceSeries,
        lineStyle: { color: "#10b981", width: 2 },
        areaStyle: { color: "rgba(16,185,129,0.08)" },
      },
      {
        name: "Entradas previstas",
        type: "bar",
        data: p.entriesSeries,
        itemStyle: { color: "#0d1f3c", borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 24,
      },
      {
        name: "Saídas previstas",
        type: "bar",
        data: p.exitsSeries,
        itemStyle: { color: "rgba(196,30,58,0.55)", borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 24,
      },
    ],
  };

  return (
    <div className="admin-page-stack">
      <div>
        <h3 className="text-base font-bold text-[#0d1f3c]">Projeção de caixa</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Cenário previsto · jul a set/2025 (mock)
        </p>
      </div>

      <section className="admin-page-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {projectionKpis.map((kpi) => (
          <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} />
        ))}
      </section>

      <FinancialChartCard
        title="Evolução projetada"
        subtitle="Saldo, entradas e saídas previstas"
      >
        <ReactECharts option={option} style={{ height: 300 }} opts={{ renderer: "svg" }} />
      </FinancialChartCard>
    </div>
  );
}
