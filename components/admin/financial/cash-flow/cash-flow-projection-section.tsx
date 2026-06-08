"use client";

import type { CashFlowProjection } from "@/lib/contracts/cashflow";

import type { IconType } from "react-icons/lib";
import {
  HiArrowDownCircle,
  HiArrowUpCircle,
  HiWallet,
} from "react-icons/hi2";

import {
  AdminResponsiveKpis,
  type AdminKpiItem,
} from "@/components/admin/admin-responsive-kpis";
import {
  adminEmptyDashedClass,
  adminStatTileClass,
} from "@/lib/design";

import { FinancialChartCard } from "../financial-chart-card";

const PROJECTION_ICONS: Record<string, IconType> = {
  "expected-entries": HiArrowUpCircle,
  "expected-exits": HiArrowDownCircle,
  "projected-balance": HiWallet,
};

function toProjectionKpis(projection: CashFlowProjection): AdminKpiItem[] {
  const balancePositive = projection.projectedBalanceRaw >= 0;

  return [
    {
      id: "expected-entries",
      label: "Entradas previstas",
      value: projection.expectedEntries,
      iconClassName:
        "bg-[var(--ds-success-bg)] text-[var(--ds-success-text)]",
      valueClassName: "text-[var(--ds-success-text)]",
    },
    {
      id: "expected-exits",
      label: "Saídas previstas",
      value: projection.expectedExits,
      iconClassName: "bg-[var(--ds-error-bg)] text-[var(--ds-error-text)]",
      valueClassName: "text-[var(--ds-error-text)]",
    },
    {
      id: "projected-balance",
      label: "Saldo projetado",
      value: projection.projectedBalance,
      iconClassName: balancePositive
        ? "bg-accent text-white"
        : "bg-[var(--ds-error-bg)] text-[var(--ds-error-text)]",
      valueClassName: balancePositive
        ? ""
        : "text-[var(--ds-error-text)]",
    },
  ];
}

function riskDayTileClass(balanceRaw: number): string {
  if (balanceRaw < 0) {
    return "border-[var(--ds-error-border)] bg-[var(--ds-error-bg)]";
  }
  if (balanceRaw < 5000) {
    return "border-[var(--ds-warning-border)] bg-[var(--ds-warning-bg)]";
  }
  return `${adminStatTileClass} border-[var(--ds-border-subtle)]`;
}

function riskDayValueClass(balanceRaw: number): string {
  if (balanceRaw < 0) return "text-[var(--ds-error-text)]";
  if (balanceRaw < 5000) return "text-[var(--ds-warning-text)]";
  return "text-[var(--ds-text-secondary)]";
}

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
          className="mb-4 rounded-xl border border-[var(--ds-error-border)] bg-[var(--ds-error-bg)] px-4 py-3 text-sm font-semibold text-[var(--ds-error-text)]"
        >
          {projection.alertMessage}
        </div>
      ) : null}

      <AdminResponsiveKpis
        kpis={toProjectionKpis(projection)}
        icons={PROJECTION_ICONS}
        defaultIcon={HiWallet}
        desktopClassName="admin-page-grid grid sm:grid-cols-3"
        showDeltaBadge={false}
      />

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]">
          Dias com maior risco de caixa
        </p>
        {projection.riskDays.length === 0 ? (
          <p className={`${adminEmptyDashedClass} mt-2`}>
            Nenhum dia de risco identificado no período.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {projection.riskDays.map((day) => (
              <li
                key={day.date}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${riskDayTileClass(day.balanceRaw)}`}
              >
                <span className="text-sm font-semibold text-[var(--ds-text-primary)]">
                  {day.label}
                </span>
                <span
                  className={`text-sm font-bold tabular-nums ${riskDayValueClass(day.balanceRaw)}`}
                >
                  {day.balance}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </FinancialChartCard>
  );
}
