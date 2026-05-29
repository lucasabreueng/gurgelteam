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

import { AdminResponsiveKpis } from "@/components/admin/admin-responsive-kpis";

const KPI_ICONS: Record<string, IconType> = {
  "gross-revenue": HiCurrencyDollar,
  "op-costs": HiCog6Tooth,
  "op-expenses": HiBanknotes,
  "net-profit": HiArrowTrendingUp,
  "net-margin": HiChartPie,
};

type Props = {
  kpis: DreSummaryKpi[];
};

export function DreSummaryKpis({ kpis }: Props) {
  return (
    <AdminResponsiveKpis
      kpis={kpis}
      icons={KPI_ICONS}
      defaultIcon={HiCurrencyDollar}
      desktopClassName="admin-page-grid grid grid-cols-2 xl:grid-cols-5"
    />
  );
}
