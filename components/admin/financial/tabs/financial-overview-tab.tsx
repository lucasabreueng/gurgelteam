"use client";

import type { FinancialTabKey } from "@/lib/contracts/finance/finance.types";
import { queryKeys } from "@/lib/query/keys";
import { getAppServices } from "@/lib/data-source/app-services";

import { useQuery } from "@tanstack/react-query";
import type { IconType } from "react-icons/lib";
import {
  HiArrowTrendingUp,
  HiChartBarSquare,
  HiCurrencyDollar,
  HiExclamationTriangle,
  HiFlag,
  HiWallet,
} from "react-icons/hi2";

import { AdminResponsiveKpis } from "@/components/admin/admin-responsive-kpis";

import { BusinessEvolutionChart } from "../overview/business-evolution-chart";
import { RevenueOriginChart } from "../overview/revenue-origin-chart";
import { UpcomingPayables } from "../overview/upcoming-payables";

const FINANCIAL_KPI_ICONS: Record<string, IconType> = {
  "revenue-month": HiCurrencyDollar,
  "profit-month": HiChartBarSquare,
  "cash-balance": HiWallet,
  delinquency: HiExclamationTriangle,
  "monthly-goal": HiFlag,
};

type Props = {
  onTabChange: (tab: FinancialTabKey) => void;
};

export function FinancialOverviewTab({ onTabChange }: Props) {
  const { data: financialKpis = [] } = useQuery({
    queryKey: queryKeys.finance.overviewKpis(),
    queryFn: () => getAppServices().finance.getOverviewKpis(),
  });

  return (
    <div className="admin-page-stack">
      <section aria-labelledby="executive-financial-kpis" className="min-w-0">
        <h2 id="executive-financial-kpis" className="sr-only">
          KPIs financeiros
        </h2>
        <AdminResponsiveKpis
          kpis={financialKpis}
          icons={FINANCIAL_KPI_ICONS}
          defaultIcon={HiArrowTrendingUp}
          desktopClassName="admin-page-grid grid grid-cols-2 xl:grid-cols-5"
          showDeltaBadge={false}
        />
      </section>

      <section aria-labelledby="business-evolution">
        <BusinessEvolutionChart />
      </section>

      <section className="admin-page-grid grid lg:grid-cols-2">
        <RevenueOriginChart />
        <UpcomingPayables onTabChange={onTabChange} />
      </section>
    </div>
  );
}
