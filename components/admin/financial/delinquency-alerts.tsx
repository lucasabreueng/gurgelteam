"use client";

import { useFinanceInsights } from "@/lib/query/hooks/use-finance-insights";

import { HiChatBubbleLeftRight } from "react-icons/hi2";

type Props = {
  onAction?: (msg: string) => void;
  onResolve?: (msg: string) => void;
};

export function DelinquencyAlerts({ onAction, onResolve }: Props) {
  const { data, isLoading } = useFinanceInsights();
  const items = data?.delinquencyItems ?? [];

  if (isLoading) {
    return (
      <section className="rounded-2xl border-2 border-red-200/50 bg-gradient-to-br from-red-50/40 to-white p-5 shadow-sm md:p-6">
        <div className="h-24 animate-pulse rounded-xl bg-white/80" />
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-emerald-200/50 bg-emerald-50/30 p-5 shadow-sm md:p-6">
        <p className="text-sm font-semibold text-emerald-800">
          Nenhum cliente inadimplente no momento.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border-2 border-red-200/50 bg-gradient-to-br from-red-50/40 to-white p-5 shadow-sm md:p-6">
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-xl bg-white p-4 ring-1 ring-red-200/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-bold text-[#0d1f3c]">{item.clientName}</p>
                <p className="text-sm font-bold tabular-nums text-red-700">
                  {item.amount}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {item.daysLate} dias em atraso · {item.lastCharge}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  onAction?.(`WhatsApp enviado — ${item.clientName} (mock).`)
                }
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0d1f3c] px-3 py-2 text-[10px] font-bold uppercase text-white"
              >
                <HiChatBubbleLeftRight className="h-3.5 w-3.5" aria-hidden />
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() =>
                  onAction?.(`Cobrança reenviada — ${item.clientName} (mock).`)
                }
                className="rounded-lg border border-[rgba(13,31,60,0.15)] px-3 py-2 text-[10px] font-bold uppercase text-[#0d1f3c]"
              >
                Reenviar cobrança
              </button>
              <button
                type="button"
                onClick={() =>
                  onAction?.(`Renegociação — ${item.clientName} (mock).`)
                }
                className="rounded-lg px-3 py-2 text-[10px] font-bold uppercase text-neutral-600 hover:bg-neutral-100"
              >
                Renegociar
              </button>
              <button
                type="button"
                onClick={() =>
                  onResolve?.(`${item.clientName} marcado como resolvido (mock).`)
                }
                className="rounded-lg bg-emerald-600 px-3 py-2 text-[10px] font-bold uppercase text-white"
              >
                Marcar resolvido
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
