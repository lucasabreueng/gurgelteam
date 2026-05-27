"use client";

import { FinancialServiceMock } from "@/services/finance/financialServiceMock";

import { HiCheckCircle } from "react-icons/hi2";

import { DelinquencyAlerts } from "../delinquency-alerts";

type Props = {
  onAction: (msg: string) => void;
};

export function DelinquencyTab({ onAction }: Props) {
  return (
    <div className="admin-page-stack">
      <div className="flex justify-end">
        <div className="rounded-2xl border border-red-200/60 bg-red-50/40 px-5 py-3 text-right">
          <p className="text-[10px] font-bold uppercase text-red-800">
            Total em atraso
          </p>
          <p className="text-2xl font-bold tabular-nums text-red-700">
            {FinancialServiceMock.getDelinquencyTotal()}
          </p>
          <p className="text-xs text-red-700/80">
            {FinancialServiceMock.getDelinquencyItems().length} clientes
          </p>
        </div>
      </div>

      <DelinquencyAlerts onAction={onAction} onResolve={onAction} />

      <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#0d1f3c]">Resumo por cliente</h3>
        <ul className="mt-4 space-y-3">
          {FinancialServiceMock.getDelinquencyItems().map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#fafbfc] p-4 ring-1 ring-[rgba(17,17,17,0.06)]"
            >
              <div>
                <p className="font-bold text-[#0d1f3c]">{item.clientName}</p>
                <p className="text-xs text-neutral-500">
                  {item.daysLate} dias · {item.lastCharge}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold tabular-nums text-red-700">
                  {item.amount}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onAction(`${item.clientName} marcado como resolvido (mock).`)
                  }
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-[10px] font-bold uppercase text-white"
                >
                  <HiCheckCircle className="h-3.5 w-3.5" aria-hidden />
                  Resolvido
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

