"use client";

import { useMemo } from "react";

import type { CashFlowCategoryItem } from "@/lib/contracts/cashflow";
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
  items: CashFlowCategoryItem[];
};

export function CashFlowExitsCategory({ items }: Props) {
  const chartTheme = useChartTheme();
  const option = useMemo(
    () =>
      buildFinancialPieOption(
        items.map((item) => ({ name: item.label, value: item.percent })),
        chartTheme,
        (name) => {
          const item = items.find((i) => i.label === name);
          return item ? `${item.label}<br/>${item.amount} (${item.percent}%)` : "";
        },
      ),
    [items, chartTheme],
  );

  const hasData = items.some((item) => item.percent > 0);

  return (
    <FinancialChartCard
      title="Saídas por categoria"
      subtitle="Distribuição das saídas de caixa no período"
    >
      {!hasData ? (
        <p className={adminEmptyStateClass}>Nenhuma saída no período.</p>
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
                  <th className={inventoryThFirstClass}>Categoria</th>
                  <th className={`${inventoryThClass} text-right`}>Valor</th>
                  <th className={`${inventoryThClass} text-right`}>%</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className={adminTableBodyRowClass}>
                    <td className={inventoryTdDescClass}>{item.label}</td>
                    <td
                      className={`${inventoryTdClass} text-right font-semibold tabular-nums text-[var(--ds-error-text)]`}
                    >
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
      )}
    </FinancialChartCard>
  );
}
