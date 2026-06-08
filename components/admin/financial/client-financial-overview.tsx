"use client";

import { useFinanceInsights } from "@/lib/query/hooks/use-finance-insights";

type Props = {
  onOpenClient?: (name: string) => void;
};

export function ClientFinancialOverview({ onOpenClient }: Props) {
  const { data, isLoading } = useFinanceInsights();
  const clients = data?.clientFinancials ?? [];

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6">
        <div className="h-40 animate-pulse rounded-xl bg-[#fafbfc]" />
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6">
      <h2 className="text-lg font-bold text-[#0d1f3c]">Financeiro por cliente</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Gasto total, plano e pendências
      </p>
      {clients.length === 0 ? (
        <p className="mt-5 text-sm text-neutral-500">
          Nenhum dado financeiro de clientes no período.
        </p>
      ) : (
        <ul className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-[rgba(17,17,17,0.06)] p-4 transition hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => onOpenClient?.(c.name)}
                className="w-full text-left"
              >
                <p className="font-bold text-[#0d1f3c]">{c.name}</p>
                <p className="text-xs text-neutral-500">{c.currentPlan}</p>
              </button>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Total gasto</dt>
                  <dd className="font-bold text-[#0d1f3c]">{c.totalSpent}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Pagamentos</dt>
                  <dd className="font-semibold">{c.paymentsCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Pendências</dt>
                  <dd
                    className={`font-bold ${
                      c.pending !== "—" ? "text-amber-700" : "text-neutral-400"
                    }`}
                  >
                    {c.pending}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Aulas restantes</dt>
                  <dd className="font-semibold">{c.lessonsLeft}</dd>
                </div>
                <div className="flex justify-between border-t border-[rgba(17,17,17,0.06)] pt-2">
                  <dt className="text-neutral-500">Ticket médio</dt>
                  <dd className="font-bold tabular-nums">{c.ticketAvg}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
