"use client";



import type { DreSummaryKpi } from "@/lib/admin-dre-mocks";



import type { IconType } from "react-icons/lib";

import {

  HiArrowTrendingUp,

  HiBanknotes,

  HiChartPie,

  HiCog6Tooth,

  HiCurrencyDollar,

} from "react-icons/hi2";



import {

  AdminResponsiveKpis,

  type AdminKpiItem,

} from "@/components/admin/admin-responsive-kpis";



const KPI_ICONS: Record<string, IconType> = {

  "gross-revenue": HiCurrencyDollar,

  "op-costs": HiCog6Tooth,

  "op-expenses": HiBanknotes,

  "net-profit": HiArrowTrendingUp,

  "net-margin": HiChartPie,

};



const KPI_ICON_TONES: Record<string, string> = {

  "gross-revenue":

    "bg-[var(--ds-success-bg)] text-[var(--ds-success-text)]",

  "op-costs": "bg-[var(--ds-warning-bg)] text-[var(--ds-warning-text)]",

  "op-expenses": "bg-[var(--ds-error-bg)] text-[var(--ds-error-text)]",

  "net-margin": "bg-accent text-white",

};



function toAdminKpiItems(kpis: DreSummaryKpi[]): AdminKpiItem[] {

  return kpis.map((kpi) => {

    const profitTone = kpi.deltaPositive

      ? "bg-[var(--ds-success-bg)] text-[var(--ds-success-text)]"

      : "bg-[var(--ds-error-bg)] text-[var(--ds-error-text)]";



    return {

      id: kpi.id,

      label: kpi.label,

      value: kpi.value,

      delta: kpi.delta,

      deltaPositive: kpi.deltaPositive,

      tooltip: kpi.tooltip,

      iconClassName:

        kpi.id === "net-profit"

          ? profitTone

          : (KPI_ICON_TONES[kpi.id] ?? ""),

      valueClassName:

        kpi.id === "net-profit"

          ? kpi.deltaPositive

            ? "text-[var(--ds-success-text)]"

            : "text-[var(--ds-error-text)]"

          : "",

    };

  });

}



type Props = {

  kpis: DreSummaryKpi[];

};



export function DreSummaryKpis({ kpis }: Props) {

  return (

    <AdminResponsiveKpis

      kpis={toAdminKpiItems(kpis)}

      icons={KPI_ICONS}

      defaultIcon={HiCurrencyDollar}

      desktopClassName="admin-page-grid grid grid-cols-2 xl:grid-cols-5"

      showDeltaBadge={false}

    />

  );

}

