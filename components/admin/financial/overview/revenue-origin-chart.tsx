"use client";

import { FinancialServiceMock } from "@/services/finance/financialServiceMock";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

import { FinancialChartCard } from "../financial-chart-card";

const CHART_COLORS = ["#0d1f3c", "#1e3a5f", "#c41e3a", "#64748b", "#94a3b8"];

export function RevenueOriginChart() {
  const items = FinancialServiceMock.getRevenueOrigin();

  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const name =
          typeof params === "object" && params && "name" in params
            ? String(params.name)
            : "";
        const item = items.find((i) => i.name === name);
        if (!item) return "";
        return `${item.name}<br/>${item.amount} (${item.percent}%)`;
      },
    },
    series: [
      {
        type: "pie",
        radius: ["42%", "68%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
        label: { show: false },
        data: items.map((item, i) => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
        })),
      },
    ],
  };

  return (
    <FinancialChartCard
      title="Origem das receitas"
      subtitle="Mix de serviços do mês"
    >
      <div className="grid items-center gap-4 md:grid-cols-2">
        <ReactECharts option={option} style={{ height: 220 }} opts={{ renderer: "svg" }} />
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={item.name}
              className="flex items-center justify-between gap-3 rounded-xl bg-[#fafbfc] px-3 py-2 ring-1 ring-[rgba(17,17,17,0.06)]"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  aria-hidden
                />
                <span className="truncate text-[12px] font-semibold text-[#0d1f3c]">
                  {item.name}
                </span>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[12px] font-bold text-[#0d1f3c]">{item.amount}</p>
                <p className="text-[10px] text-neutral-500">{item.percent}%</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </FinancialChartCard>
  );
}
