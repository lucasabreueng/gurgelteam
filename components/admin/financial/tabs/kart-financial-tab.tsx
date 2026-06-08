"use client";

import { useFinanceInsights } from "@/lib/query/hooks/use-finance-insights";

import { KartFinancialOverview } from "../kart-financial-overview";

function parseBrl(value: string) {
  return parseFloat(value.replace(/[^\d.-]/g, "")) || 0;
}

export function KartFinancialTab() {
  const { data } = useFinanceInsights();
  const kartFinancials = data?.kartFinancials ?? [];

  const mostProfitable = [...kartFinancials]
    .filter((k) => k.profitPositive)
    .sort((a, b) => parseBrl(b.estimatedProfit) - parseBrl(a.estimatedProfit))[0];
  const highestCost = [...kartFinancials].sort(
    (a, b) => parseBrl(b.costPerHour) - parseBrl(a.costPerHour),
  )[0];
  const lowRentability = kartFinancials.filter((k) => !k.profitPositive);

  return (
    <div className="admin-page-stack">
      <section className="admin-page-grid grid sm:grid-cols-3">
        {mostProfitable ? (
          <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4">
            <p className="text-[10px] font-bold uppercase text-emerald-800">
              Mais lucrativo
            </p>
            <p className="mt-1 text-lg font-bold text-[#0d1f3c]">
              Kart {mostProfitable.number}
            </p>
            <p className="text-sm font-semibold text-emerald-700">
              {mostProfitable.estimatedProfit}
            </p>
          </div>
        ) : null}
        {highestCost ? (
          <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4">
            <p className="text-[10px] font-bold uppercase text-amber-900">
              Maior custo/hora
            </p>
            <p className="mt-1 text-lg font-bold text-[#0d1f3c]">
              Kart {highestCost.number}
            </p>
            <p className="text-sm font-semibold text-amber-800">
              {highestCost.costPerHour}/h
            </p>
          </div>
        ) : null}
        {lowRentability.length > 0 ? (
          <div className="rounded-2xl border border-red-200/60 bg-red-50/40 p-4">
            <p className="text-[10px] font-bold uppercase text-red-800">
              Baixa rentabilidade
            </p>
            <p className="mt-1 text-lg font-bold text-[#0d1f3c]">
              Kart {lowRentability.map((k) => k.number).join(", ")}
            </p>
            <p className="text-sm font-semibold text-red-700">
              Margem negativa ou crítica
            </p>
          </div>
        ) : null}
      </section>

      <KartFinancialOverview />
    </div>
  );
}
