"use client";

import type { ExecutiveAlertAction } from "@/lib/admin-financial-mocks";
import type { FinancialTabKey } from "@/lib/contracts/finance/finance.types";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";

import { FinancialChartCard } from "../financial-chart-card";

const PRIORITY_STYLES = {
  critical: "border-red-200/70 bg-red-50/60",
  warning: "border-amber-200/70 bg-amber-50/50",
  info: "border-sky-200/60 bg-sky-50/40",
  maintenance: "border-neutral-200 bg-[#fafbfc]",
} as const;

type Props = {
  onTabChange: (tab: FinancialTabKey) => void;
  onNavigate: (href: string) => void;
  onAction: (message: string) => void;
};

function handleAlertAction(
  action: ExecutiveAlertAction,
  onTabChange: Props["onTabChange"],
  onNavigate: Props["onNavigate"],
  onAction: Props["onAction"]
) {
  switch (action) {
    case "receivables":
      onTabChange("receivables");
      onAction("Abrindo contas a receber para cobrança.");
      break;
    case "agenda":
      onNavigate("/admin/agenda");
      break;
    case "renew-package":
      onTabChange("receivables");
      onAction("Renovação de pacote iniciada (mock).");
      break;
    case "maintenance":
      onNavigate("/admin/manutencao");
      break;
  }
}

export function ExecutiveAlerts({
  onTabChange,
  onNavigate,
  onAction,
}: Props) {
  const alerts = FinancialServiceMock.getExecutiveAlerts();

  return (
    <FinancialChartCard
      title="Central de alertas"
      subtitle="Prioridades que exigem ação imediata"
      className="border-accent/20 bg-gradient-to-br from-accent/[0.05] to-white"
    >
      <ul className="space-y-3">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${PRIORITY_STYLES[alert.priority]}`}
          >
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-bold text-[#0d1f3c]">
                <span aria-hidden>{alert.icon}</span>
                {alert.title}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-neutral-600">
                {alert.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleAlertAction(
                  alert.action,
                  onTabChange,
                  onNavigate,
                  onAction
                )
              }
              className="shrink-0 rounded-xl bg-[#0d1f3c] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
            >
              {alert.actionLabel}
            </button>
          </li>
        ))}
      </ul>
    </FinancialChartCard>
  );
}
