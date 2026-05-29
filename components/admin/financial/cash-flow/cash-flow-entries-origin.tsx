"use client";

import type { CashFlowOriginItem } from "@/lib/contracts/cashflow";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

import {
  inventoryTableClass,
  inventoryTdClass,
  inventoryTdDescClass,
  inventoryThClass,
  inventoryThFirstClass,
} from "@/components/admin/inventory/inventory-table-shared";

import { FinancialChartCard } from "../financial-chart-card";

const CHART_COLORS = ["#0d1f3c", "#1e3a5f", "#c41e3a", "#64748b", "#94a3b8"];

type Props = {
  items: CashFlowOriginItem[];
};

export function CashFlowEntriesOrigin({ items }: Props) {
  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const name =
          typeof params === "object" && params && "name" in params
            ? String(params.name)
            : "";
        const item = items.find((i) => i.label === name);
        return item ? `${item.label}<br/>${item.amount} (${item.percent}%)` : "";
      },
    },
    series: [
      {
        type: "pie",
        radius: ["42%", "68%"],
        center: ["50%", "50%"],
        label: { show: false },
        data: items.map((item, i) => ({
          name: item.label,
          value: item.percent,
          itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
        })),
      },
    ],
  };

  return (
    <FinancialChartCard
      title="Entradas por origem"
      subtitle="Distribuição das entradas de caixa no período"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(160px,220px)_1fr] lg:items-center">
        <div className="mx-auto w-full max-w-[220px]">
          <ReactECharts option={option} style={{ height: 200 }} opts={{ renderer: "svg" }} />
        </div>
        <div className="min-w-0 overflow-x-auto rounded-xl ring-1 ring-[rgba(17,17,17,0.06)]">
          <table className={inventoryTableClass}>
            <thead>
              <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc]">
                <th className={inventoryThFirstClass}>Origem</th>
                <th className={`${inventoryThClass} text-right`}>Valor</th>
                <th className={`${inventoryThClass} text-right`}>%</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[rgba(17,17,17,0.05)] last:border-0"
                >
                  <td className={inventoryTdDescClass}>{item.label}</td>
                  <td className={`${inventoryTdClass} text-right font-semibold tabular-nums text-emerald-800`}>
                    {item.amount}
                  </td>
                  <td className={`${inventoryTdClass} text-right tabular-nums`}>
                    {item.percent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </FinancialChartCard>
  );
}
