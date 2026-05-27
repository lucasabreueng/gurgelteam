"use client";

import { FinancialServiceMock } from "@/services/finance/financialServiceMock";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

import { FinancialChartCard } from "./financial-chart-card";

const CHART_COLORS = ["#0d1f3c", "#1e3a5f", "#c41e3a", "#64748b"];

function donutOption(data: { name: string; value: number }[]): EChartsOption {
  return {
    tooltip: { trigger: "item", formatter: "{b}: {c}%" },
    series: [
      {
        type: "pie",
        radius: ["48%", "72%"],
        center: ["50%", "48%"],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
        label: { show: false },
        data: data.map((d, i) => ({
          ...d,
          itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
        })),
      },
    ],
  };
}

export function PaymentMethodsChart() {
  const methodsOption = donutOption(
    FinancialServiceMock.getPaymentMethods().map((m) => ({ name: m.name, value: m.value }))
  );

  return (
    <FinancialChartCard
      title="Métodos de pagamento"
      subtitle="Distribuição do mês"
    >
      <ReactECharts
        option={methodsOption}
        style={{ height: 200 }}
        opts={{ renderer: "svg" }}
      />
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {FinancialServiceMock.getPaymentMethods().map((m) => (
          <li
            key={m.name}
            className="rounded-xl bg-[#fafbfc] px-3 py-2 ring-1 ring-[rgba(17,17,17,0.06)]"
          >
            <p className="text-[10px] font-bold uppercase text-neutral-500">
              {m.name}
            </p>
            <p className="text-sm font-bold text-[#0d1f3c]">{m.amount}</p>
            <p className="text-[10px] text-neutral-500">{m.value}%</p>
          </li>
        ))}
      </ul>
    </FinancialChartCard>
  );
}

export function RevenueByServiceChart() {
  const option = donutOption(
    FinancialServiceMock.getRevenueByService().map((s) => ({ name: s.name, value: s.value }))
  );

  return (
    <FinancialChartCard title="Receita por serviço" subtitle="Mix de receitas (R$ mil)">
      <ReactECharts option={option} style={{ height: 200 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}

export function InOutChart() {
  const option: EChartsOption = {
    grid: { left: 44, right: 16, top: 20, bottom: 32 },
    tooltip: { trigger: "axis" },
    legend: { bottom: 0, textStyle: { fontSize: 10 } },
    xAxis: { type: "category", data: FinancialServiceMock.getInOutChart().months },
    yAxis: {
      type: "value",
      axisLabel: { formatter: "R$ {value}k", fontSize: 10 },
    },
    series: [
      {
        name: "Entradas",
        type: "line",
        smooth: true,
        data: FinancialServiceMock.getInOutChart().entries,
        lineStyle: { color: "#0d1f3c", width: 2 },
        areaStyle: { color: "rgba(13,31,60,0.06)" },
      },
      {
        name: "Saídas",
        type: "line",
        smooth: true,
        data: FinancialServiceMock.getInOutChart().exits,
        lineStyle: { color: "rgba(196,30,58,0.7)", width: 2 },
        areaStyle: { color: "rgba(196,30,58,0.06)" },
      },
    ],
  };

  return (
    <FinancialChartCard title="Entradas × saídas" subtitle="Comparativo mensal">
      <ReactECharts option={option} style={{ height: 200 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}

export function FinancialEvolutionChart() {
  const option: EChartsOption = {
    grid: { left: 44, right: 16, top: 20, bottom: 32 },
    tooltip: { trigger: "axis" },
    legend: { bottom: 0, textStyle: { fontSize: 10 } },
    xAxis: { type: "category", data: FinancialServiceMock.getFinancialEvolution().weeks },
    yAxis: { type: "value", axisLabel: { formatter: "R$ {value}k", fontSize: 10 } },
    series: [
      {
        name: "Receita",
        type: "bar",
        data: FinancialServiceMock.getFinancialEvolution().revenue,
        itemStyle: { color: "#0d1f3c", borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 20,
      },
      {
        name: "Custos",
        type: "bar",
        data: FinancialServiceMock.getFinancialEvolution().costs,
        itemStyle: { color: "rgba(13,31,60,0.25)", borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 20,
      },
      {
        name: "Margem",
        type: "line",
        smooth: true,
        data: FinancialServiceMock.getFinancialEvolution().margin,
        lineStyle: { color: "#10b981", width: 2 },
        symbol: "none",
      },
    ],
  };

  return (
    <FinancialChartCard title="Evolução financeira" subtitle="Receita, custos e margem">
      <ReactECharts option={option} style={{ height: 200 }} opts={{ renderer: "svg" }} />
    </FinancialChartCard>
  );
}
