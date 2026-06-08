"use client";

import { useFinanceInsights } from "@/lib/query/hooks/use-finance-insights";

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

export function CommercialRanking() {
  const { data, isLoading } = useFinanceInsights();
  const rows = data?.commercialRanking ?? [];

  return (
    <FinancialChartCard
      title="Ranking comercial"
      subtitle="Top 5 alunos por faturamento no mês"
    >
      {isLoading ? (
        <div className="h-32 animate-pulse rounded-xl bg-[#fafbfc]" />
      ) : rows.length === 0 ? (
        <p className="text-sm text-neutral-500">Nenhum pagamento registrado.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl ring-1 ring-[rgba(17,17,17,0.06)]">
          <table className={inventoryTableClass}>
            <thead>
              <tr className={adminTableHeadRowClass}>
                <th className={`${inventoryThFirstClass} w-10`}>#</th>
                <th className={inventoryThClass}>Nome</th>
                <th className={inventoryThClass}>Receita gerada</th>
                <th className={inventoryThClass}>Aulas</th>
                <th className={inventoryThClass}>Ticket médio</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.rank}
                  className={adminTableBodyRowClass}
                >
                  <td className={`${inventoryTdFirstClass} font-bold text-accent`}>
                    {row.rank}
                  </td>
                  <td className={inventoryTdDescClass}>{row.clientName}</td>
                  <td className={`${inventoryTdClass} font-semibold tabular-nums text-[#0d1f3c]`}>
                    {row.revenue}
                  </td>
                  <td className={`${inventoryTdClass} tabular-nums`}>
                    {row.lessonsCount}
                  </td>
                  <td className={`${inventoryTdClass} tabular-nums`}>
                    {row.ticketAvg}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </FinancialChartCard>
  );
}
