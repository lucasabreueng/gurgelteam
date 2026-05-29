"use client";

import type { CashFlowAlert } from "@/lib/contracts/cashflow";

import { FinancialChartCard } from "../financial-chart-card";

const PRIORITY_STYLES = {
  critical: "border-red-200/70 bg-red-50/60",
  warning: "border-amber-200/70 bg-amber-50/50",
  info: "border-sky-200/60 bg-sky-50/40",
} as const;

type Props = {
  alerts: CashFlowAlert[];
};

export function CashFlowAlerts({ alerts }: Props) {
  return (
    <FinancialChartCard
      title="Alertas de caixa"
      subtitle="Situações que exigem atenção no fluxo de caixa"
      className="border-accent/20 bg-gradient-to-br from-accent/[0.04] to-white"
    >
      <ul className="space-y-3">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={`rounded-xl border p-4 ${PRIORITY_STYLES[alert.priority]}`}
          >
            <p className="flex items-center gap-2 text-sm font-bold text-[#0d1f3c]">
              <span aria-hidden>{alert.icon}</span>
              {alert.title}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-neutral-600">
              {alert.description}
            </p>
          </li>
        ))}
      </ul>
    </FinancialChartCard>
  );
}
