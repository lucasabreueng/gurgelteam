"use client";

import type { FinancialTabKey } from "@/lib/contracts/finance/finance.types";

import { useUpcomingPayables } from "@/lib/query/hooks/use-finance-charts";
import { adminOutlineButtonClass, adminTableCellClass } from "@/lib/design";
import {
  adminTableBodyRowClass,
  adminTableHeadRowClass,
  inventoryTableClass,
  inventoryTdClass,
  inventoryTdDescClass,
  inventoryTdFirstClass,
  inventoryThClass,
  inventoryThFirstClass,
} from "@/components/admin/inventory/inventory-table-shared";

import { FinancialChartCard } from "../financial-chart-card";

type Props = {
  onTabChange: (tab: FinancialTabKey) => void;
};

export function UpcomingPayables({ onTabChange }: Props) {
  const { data: rows = [] } = useUpcomingPayables();

  return (
    <FinancialChartCard
      title="Próximos vencimentos"
      subtitle="Despesas com vencimento mais próximo"
      headerAction={
        <button
          type="button"
          onClick={() => onTabChange("payables")}
          className={adminOutlineButtonClass}
        >
          Ver Contas a Pagar
        </button>
      }
    >
      <div className="overflow-x-auto rounded-xl ring-1 ring-[var(--ds-border-subtle)]">
        <table className={inventoryTableClass}>
          <thead>
            <tr className={adminTableHeadRowClass}>
              <th className={inventoryThFirstClass}>Descrição</th>
              <th className={inventoryThClass}>Categoria</th>
              <th className={inventoryThClass}>Valor</th>
              <th className={inventoryThClass}>Vencimento</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm text-[var(--ds-text-muted)]"
                >
                  Nenhum vencimento pendente.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className={adminTableBodyRowClass}>
                  <td className={inventoryTdDescClass}>{row.description}</td>
                  <td className={inventoryTdClass}>{row.category}</td>
                  <td
                    className={`${inventoryTdClass} font-semibold tabular-nums text-[var(--ds-text-primary)]`}
                  >
                    {row.amount}
                  </td>
                  <td className={`${inventoryTdFirstClass} ${adminTableCellClass}`}>
                    {row.dueDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </FinancialChartCard>
  );
}
