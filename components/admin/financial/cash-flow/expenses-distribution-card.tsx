"use client";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { CashFlowServiceMock } from "@/services/cashflow/cashFlowServiceMock";
import { FinancialChartCard } from "../financial-chart-card";

const COLORS = [
  "#0d1f3c",
  "#1e3a5f",
  "#c41e3a",
  "#64748b",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
];

export function ExpensesDistributionCard() {
  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}% ({d}%)",
    },
    series: [
      {
        type: "pie",
        radius: ["42%", "68%"],
        center: ["38%", "50%"],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
        label: { show: false },
        data: CashFlowServiceMock.getExpensesDistribution().map((item, i) => ({
          name: item.label,
          value: item.percent,
          itemStyle: { color: COLORS[i % COLORS.length] },
        })),
      },
    ],
  };

  return (
    <FinancialChartCard
      title="Distribuição das saídas"
      subtitle="Por categoria · impacto no caixa"
    >
      <div className="grid gap-4 lg:grid-cols-2 lg:items-center">
        <ReactECharts option={option} style={{ height: 220 }} opts={{ renderer: "svg" }} />
        <ul className="space-y-2">
          {CashFlowServiceMock.getExpensesDistribution().map((item, i) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl bg-[#fafbfc] px-3 py-2.5 ring-1 ring-[rgba(17,17,17,0.06)]"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-[#0d1f3c]">{item.label}</p>
                <p className="text-[10px] text-neutral-500">
                  {item.amount} · {item.percent}%
                </p>
              </div>
              <span
                className={`shrink-0 rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase ${
                  item.impact === "Alto"
                    ? "bg-red-50 text-red-700"
                    : item.impact === "Médio"
                      ? "bg-amber-50 text-amber-800"
                      : "bg-slate-50 text-slate-600"
                }`}
              >
                {item.impact}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </FinancialChartCard>
  );
}
