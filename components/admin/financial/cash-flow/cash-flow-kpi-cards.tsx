"use client";

import type { CashFlowKpi, CashFlowKpiTone } from "@/lib/contracts/cashflow";

import type { IconType } from "react-icons/lib";
import {
  HiArrowDownCircle,
  HiArrowTrendingUp,
  HiArrowUpCircle,
  HiCalendarDays,
  HiWallet,
} from "react-icons/hi2";

import { AdminResponsiveKpis, type AdminKpiItem } from "@/components/admin/admin-responsive-kpis";

const KPI_ICONS: Record<string, IconType> = {
  balance: HiWallet,
  entries: HiArrowUpCircle,
  exits: HiArrowDownCircle,
  result: HiArrowTrendingUp,
  projected: HiCalendarDays,
};

const TONE_STYLES: Record<CashFlowKpiTone, { icon: string; value: string }> = {
  neutral: { icon: "", value: "" },
  positive: { icon: "bg-emerald-50 text-emerald-700", value: "text-emerald-800" },
  negative: { icon: "bg-red-50 text-red-700", value: "text-red-800" },
  accent: { icon: "bg-[#0d1f3c] text-white", value: "" },
};

type Props = {
  kpis: CashFlowKpi[];
};

function toAdminKpiItems(kpis: CashFlowKpi[]): AdminKpiItem[] {
  return kpis.map((kpi) => {
    const tone = TONE_STYLES[kpi.tone];
    return {
      id: kpi.id,
      label: kpi.label,
      value: kpi.value,
      delta: kpi.delta,
      deltaPositive: kpi.deltaPositive,
      iconClassName: tone.icon,
      valueClassName: tone.value,
    };
  });
}

export function CashFlowKpiCards({ kpis }: Props) {
  return (
    <AdminResponsiveKpis
      kpis={toAdminKpiItems(kpis)}
      icons={KPI_ICONS}
      defaultIcon={HiWallet}
      desktopClassName="admin-page-grid grid grid-cols-2 xl:grid-cols-5"
    />
  );
}
