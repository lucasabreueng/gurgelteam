"use client";

import type { MovementStatus } from "@/lib/contracts/cashflow";
import { CashFlowServiceMock } from "@/services/cashflow/cashFlowServiceMock";
import { FinancialChartCard } from "../financial-chart-card";

function StatusBadge({ status }: { status: MovementStatus }) {
  const styles: Record<MovementStatus, string> = {
    confirmado: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
    pendente: "bg-amber-50 text-amber-800 ring-amber-200/60",
    previsto: "bg-slate-50 text-slate-700 ring-slate-200/60",
  };

  return (
    <span
      className={`inline-flex rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase ring-1 ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export function MovementsTab() {
  return (
    <div className="admin-page-stack">
      <div>
        <h3 className="text-base font-bold text-[#0d1f3c]">Movimentações</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Entradas e saídas confirmadas, pendentes e previstas
        </p>
      </div>

      <FinancialChartCard title="Lançamentos do período" subtitle="Junho/2025">
        <div className="overflow-x-auto rounded-xl border border-[rgba(17,17,17,0.08)]">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-4 py-3">Data</th>
                <th className="px-3 py-3">Descrição</th>
                <th className="px-3 py-3">Categoria</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3 text-right">Valor</th>
                <th className="px-3 py-3">Pagamento</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {CashFlowServiceMock.getMovements().map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-[rgba(17,17,17,0.05)] last:border-0 hover:bg-[#fafbfc]/80"
                >
                  <td className="px-4 py-3 font-medium tabular-nums text-neutral-700">
                    {m.date}
                  </td>
                  <td className="max-w-[200px] truncate px-3 py-3 font-medium text-[#0d1f3c]">
                    {m.description}
                  </td>
                  <td className="px-3 py-3 text-neutral-600">{m.category}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`text-[11px] font-bold uppercase ${
                        m.type === "entrada" ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {m.type}
                    </span>
                  </td>
                  <td
                    className={`px-3 py-3 text-right font-bold tabular-nums ${
                      m.amountRaw >= 0 ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {m.amount}
                  </td>
                  <td className="px-3 py-3 text-neutral-600">{m.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={m.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FinancialChartCard>
    </div>
  );
}
