"use client";

import type { FinancialTabKey } from "@/lib/contracts/finance/finance.types";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";

import {
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
  const rows = FinancialServiceMock.getUpcomingPayables();

  return (
    <FinancialChartCard
      title="Próximos vencimentos"
      subtitle="Despesas com vencimento mais próximo"
      headerAction={
        <button
          type="button"
          onClick={() => onTabChange("payables")}
          className="rounded-xl border border-[rgba(13,31,60,0.2)] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/30"
        >
          Ver Contas a Pagar
        </button>
      }
    >
      <div className="overflow-x-auto rounded-xl ring-1 ring-[rgba(17,17,17,0.06)]">
        <table className={inventoryTableClass}>
          <thead>
            <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc]">
              <th className={inventoryThFirstClass}>Descrição</th>
              <th className={inventoryThClass}>Categoria</th>
              <th className={inventoryThClass}>Valor</th>
              <th className={inventoryThClass}>Vencimento</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[rgba(17,17,17,0.05)] last:border-0"
              >
                <td className={inventoryTdDescClass}>{row.description}</td>
                <td className={inventoryTdClass}>{row.category}</td>
                <td className={`${inventoryTdClass} font-semibold tabular-nums text-[#0d1f3c]`}>
                  {row.amount}
                </td>
                <td className={inventoryTdFirstClass}>{row.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FinancialChartCard>
  );
}
