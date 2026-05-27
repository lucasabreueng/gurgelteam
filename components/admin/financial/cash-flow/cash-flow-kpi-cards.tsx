"use client";

import type { IconType } from "react-icons/lib";
import {
  HiArrowDownCircle,
  HiArrowUpCircle,
  HiBanknotes,
  HiScale,
  HiWallet,
} from "react-icons/hi2";
import { KpiCard } from "@/components/ui/kpi-card";
import type { CashFlowKpiTone } from "@/lib/contracts/cashflow";
import { useCashFlowKpis } from "@/lib/query/hooks/use-cash-flow";

const KPI_ICONS: Record<string, IconType> = {
  opening: HiWallet,
  entries: HiArrowUpCircle,
  exits: HiArrowDownCircle,
  closing: HiScale,
  result: HiBanknotes,
};

const TONE_STYLES: Record<CashFlowKpiTone, { icon: string; value: string }> = {
  neutral: { icon: "", value: "" },
  positive: { icon: "bg-emerald-50 text-emerald-700", value: "text-emerald-800" },
  negative: { icon: "bg-red-50 text-red-700", value: "text-red-800" },
  accent: { icon: "bg-[#0d1f3c] text-white", value: "" },
};

export function CashFlowKpiCards() {
  const { data: kpis = [] } = useCashFlowKpis();

  return (
    <section className="admin-page-grid grid grid-cols-2 gap-3 xl:grid-cols-5">
      {kpis.map((kpi) => {
        const Icon = KPI_ICONS[kpi.id] ?? HiWallet;
        const tone = TONE_STYLES[kpi.tone];

        return (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            deltaPositive={kpi.deltaPositive}
            Icon={Icon}
            iconClassName={tone.icon}
            valueClassName={tone.value}
          />
        );
      })}
    </section>
  );
}
