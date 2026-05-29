"use client";

import type { DreCenterItem } from "@/lib/admin-dre-mocks";

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
  items: DreCenterItem[];
  title: string;
  subtitle: string;
};

export function DreCentersPanel({ items, title, subtitle }: Props) {
  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const name =
          typeof params === "object" && params && "name" in params
            ? String(params.name)
            : "";
        const item = items.find((i) => i.name === name);
        return item ? `${item.name}<br/>${item.amount} (${item.percent}%)` : "";
      },
    },
    series: [
      {
        type: "pie",
        radius: ["42%", "68%"],
        center: ["50%", "50%"],
        label: { show: false },
        data: items.map((item, i) => ({
          name: item.name,
          value: item.percent,
          itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
        })),
      },
    ],
  };

  return (
    <FinancialChartCard title={title} subtitle={subtitle}>
      <div className="grid gap-4 lg:grid-cols-[minmax(160px,220px)_1fr] lg:items-center">
        <div className="mx-auto w-full max-w-[220px]">
          <ReactECharts option={option} style={{ height: 200 }} opts={{ renderer: "svg" }} />
        </div>
        <div className="min-w-0 overflow-x-auto rounded-xl ring-1 ring-[rgba(17,17,17,0.06)]">
          <table className={inventoryTableClass}>
            <thead>
              <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc]">
                <th className={inventoryThFirstClass}>Centro</th>
                <th className={`${inventoryThClass} text-right`}>Valor</th>
                <th className={`${inventoryThClass} text-right`}>%</th>
                <th className={`${inventoryThClass} text-right`}>Variação</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.name}
                  className="border-b border-[rgba(17,17,17,0.05)] last:border-0"
                >
                  <td className={inventoryTdDescClass}>{item.name}</td>
                  <td className={`${inventoryTdClass} text-right font-semibold tabular-nums text-[#0d1f3c]`}>
                    {item.amount}
                  </td>
                  <td className={`${inventoryTdClass} text-right tabular-nums`}>
                    {item.percent}%
                  </td>
                  <td
                    className={`${inventoryTdClass} text-right font-semibold tabular-nums ${
                      item.variationPositive ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {item.variation}
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

export function DreRevenueCenters({ items }: { items: DreCenterItem[] }) {
  return (
    <DreCentersPanel
      items={items}
      title="Receita por centro de resultado"
      subtitle="Participação na receita bruta do período"
    />
  );
}

export function DreCostCenters({ items }: { items: DreCenterItem[] }) {
  return (
    <DreCentersPanel
      items={items}
      title="Custos por centro de custo"
      subtitle="Participação nos custos operacionais"
    />
  );
}
