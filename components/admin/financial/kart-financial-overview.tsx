"use client";

import { useFinanceInsights } from "@/lib/query/hooks/use-finance-insights";

export function KartFinancialOverview() {
  const { data, isLoading } = useFinanceInsights();
  const kartFinancials = data?.kartFinancials ?? [];

  const sorted = [...kartFinancials].sort((a, b) =>
    a.profitPositive === b.profitPositive ? 0 : a.profitPositive ? -1 : 1,
  );

  const mostProfitable = [...kartFinancials]
    .filter((k) => k.profitPositive)
    .sort(
      (a, b) =>
        parseFloat(b.estimatedProfit.replace(/[^\d.-]/g, "")) -
        parseFloat(a.estimatedProfit.replace(/[^\d.-]/g, "")),
    )[0];
  const highestCost = [...kartFinancials].sort(
    (a, b) =>
      parseFloat(b.costPerHour.replace(/[^\d]/g, "")) -
      parseFloat(a.costPerHour.replace(/[^\d]/g, "")),
  )[0];

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6">
        <div className="h-40 animate-pulse rounded-xl bg-[#fafbfc]" />
      </section>
    );
  }

  if (sorted.length === 0) {
    return (
      <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6">
        <p className="text-sm text-neutral-500">
          Nenhum dado de rentabilidade por kart no mês.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((k) => (
          <article
            key={k.kartId}
            className={`rounded-xl border p-4 ${
              k.profitPositive
                ? "border-emerald-200/50 bg-emerald-50/20"
                : "border-red-200/50 bg-red-50/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-black text-[#0d1f3c]">
                Kart {k.number}
              </p>
              <span
                className={`text-sm font-bold tabular-nums ${
                  k.profitPositive ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {k.estimatedProfit}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <dt className="text-neutral-500">Receita</dt>
                <dd className="font-bold text-[#0d1f3c]">{k.revenue}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Manutenção</dt>
                <dd className="font-semibold">{k.maintenanceCost}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Peças</dt>
                <dd className="font-semibold">{k.partsCost}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Custo/hora</dt>
                <dd className="font-semibold tabular-nums">{k.costPerHour}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Margem operacional</dt>
                <dd
                  className={`font-bold ${
                    k.profitPositive ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {k.operationalMargin}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-neutral-500">Horas de uso</dt>
                <dd className="font-semibold">{k.usageHours}h no mês</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      {mostProfitable || highestCost ? (
        <p className="mt-4 text-[11px] text-neutral-500">
          {mostProfitable ? (
            <>
              <span className="font-bold text-emerald-700">Mais lucrativo:</span>{" "}
              Kart {mostProfitable.number}
            </>
          ) : null}
          {mostProfitable && highestCost ? " · " : null}
          {highestCost ? (
            <>
              <span className="font-bold text-red-700">Maior custo/hora:</span>{" "}
              Kart {highestCost.number}
            </>
          ) : null}
        </p>
      ) : null}
    </section>
  );
}
