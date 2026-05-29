"use client";

import type { CashFlowProjection } from "@/lib/contracts/cashflow";

import { FinancialChartCard } from "../financial-chart-card";

type Props = {
  projection: CashFlowProjection;
};

export function CashFlowProjectionSection({ projection }: Props) {
  return (
    <FinancialChartCard
      title="Projeção de caixa — próximos 30 dias"
      subtitle="Entradas e saídas previstas com base em recebíveis e despesas agendadas"
    >
      {projection.negativeAlert && projection.alertMessage ? (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200/70 bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-900"
        >
          {projection.alertMessage}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Entradas previstas
          </p>
          <p className="mt-1 text-xl font-bold tabular-nums text-emerald-900">
            {projection.expectedEntries}
          </p>
        </div>
        <div className="rounded-xl border border-red-200/60 bg-red-50/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-red-800">
            Saídas previstas
          </p>
          <p className="mt-1 text-xl font-bold tabular-nums text-red-900">
            {projection.expectedExits}
          </p>
        </div>
        <div className="rounded-xl border border-[rgba(13,31,60,0.12)] bg-[rgba(13,31,60,0.04)] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0d1f3c]">
            Saldo projetado
          </p>
          <p className="mt-1 text-xl font-bold tabular-nums text-[#0d1f3c]">
            {projection.projectedBalance}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Dias com maior risco de caixa
        </p>
        <ul className="mt-2 space-y-2">
          {projection.riskDays.map((day) => (
            <li
              key={day.date}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                day.balanceRaw < 0
                  ? "border-red-200/70 bg-red-50/50"
                  : day.balanceRaw < 5000
                    ? "border-amber-200/70 bg-amber-50/50"
                    : "border-[rgba(17,17,17,0.08)] bg-[#fafbfc]"
              }`}
            >
              <span className="text-sm font-semibold text-[#0d1f3c]">{day.label}</span>
              <span
                className={`text-sm font-bold tabular-nums ${
                  day.balanceRaw < 0
                    ? "text-red-700"
                    : day.balanceRaw < 5000
                      ? "text-amber-700"
                      : "text-neutral-700"
                }`}
              >
                {day.balance}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </FinancialChartCard>
  );
}
