import type { IconType } from "react-icons/lib";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";
import {
  HiArrowTrendingUp,
  HiClock,
  HiCurrencyDollar,
  HiExclamationTriangle,
  HiWallet,
} from "react-icons/hi2";
import { KpiCard } from "@/components/ui/kpi-card";
import { RevenueChart } from "../revenue-chart";
import { SmartFinancialInsights } from "../smart-financial-insights";

const KPI_ICONS: Record<string, IconType> = {
  "revenue-month": HiCurrencyDollar,
  receivable: HiWallet,
  delinquency: HiExclamationTriangle,
  growth: HiArrowTrendingUp,
};

export function FinancialOverviewTab() {
  const { data: overviewKpis = [] } = useQuery({
    queryKey: queryKeys.finance.overviewKpis(),
    queryFn: () => FinancialServiceMock.getOverviewKpis(),
  });

  return (
    <div className="admin-page-stack">
      <section className="admin-page-grid grid grid-cols-2 lg:grid-cols-4">
        {overviewKpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            deltaPositive={kpi.deltaPositive}
            Icon={KPI_ICONS[kpi.id] ?? HiClock}
          />
        ))}
      </section>

      <section className="admin-page-grid grid lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <SmartFinancialInsights />
      </section>
    </div>
  );
}
