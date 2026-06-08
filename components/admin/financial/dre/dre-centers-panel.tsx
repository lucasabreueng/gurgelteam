"use client";

import { useMemo } from "react";

import type { DreCenterItem } from "@/lib/admin-dre-mocks";
import { ThemedECharts } from "@/components/charts/themed-echarts";
import { adminEmptyStateClass } from "@/lib/design";
import { useChartTheme } from "@/lib/hooks/use-chart-theme";
import {
  adminTableBodyRowClass,
  adminTableHeadRowClass,
  inventoryTableClass,
  inventoryTdClass,
  inventoryTdDescClass,
  inventoryThClass,
  inventoryThFirstClass,
} from "@/components/admin/inventory/inventory-table-shared";

import { buildFinancialPieOption } from "../financial-pie-utils";
import { FinancialChartCard } from "../financial-chart-card";

type Props = {
  items: DreCenterItem[];
  title: string;
  subtitle: string;
};

export function DreCentersPanel({ items, title, subtitle }: Props) {
  const chartTheme = useChartTheme();
  const option = useMemo(
    () =>
      buildFinancialPieOption(
        items.map((item) => ({ name: item.name, value: item.percent })),
        chartTheme,
        (name) => {
          const item = items.find((i) => i.name === name);
          return item ? `${item.name}<br/>${item.amount} (${item.percent}%)` : "";
        },
      ),
    [items, chartTheme],
  );

  const hasData = items.some((item) => item.percent > 0);

  return (
    <FinancialChartCard title={title} subtitle={subtitle}>
      {!hasData ? (
        <p className={adminEmptyStateClass}>Sem dados para o período.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(160px,220px)_1fr] lg:items-center">
          <div className="mx-auto w-full min-h-[200px] max-w-[220px]">
            <ThemedECharts
              option={option}
              style={{ height: 200, width: "100%" }}
              opts={{ renderer: "svg" }}
            />
          </div>
          <div className="min-w-0 overflow-x-auto rounded-xl ring-1 ring-[var(--ds-border-subtle)]">
            <table className={inventoryTableClass}>
              <thead>
                <tr className={adminTableHeadRowClass}>
                  <th className={inventoryThFirstClass}>Centro</th>
                  <th className={`${inventoryThClass} text-right`}>Valor</th>
                  <th className={`${inventoryThClass} text-right`}>%</th>
                  <th className={`${inventoryThClass} text-right`}>Variação</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.name} className={adminTableBodyRowClass}>
                    <td className={inventoryTdDescClass}>{item.name}</td>
                    <td
                      className={`${inventoryTdClass} text-right font-semibold tabular-nums text-[var(--ds-text-primary)]`}
                    >
                      {item.amount}
                    </td>
                    <td className={`${inventoryTdClass} text-right tabular-nums`}>
                      {item.percent}%
                    </td>
                    <td
                      className={`${inventoryTdClass} text-right font-semibold tabular-nums ${
                        item.variationPositive
                          ? "text-[var(--ds-success-text)]"
                          : "text-[var(--ds-error-text)]"
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
      )}
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
