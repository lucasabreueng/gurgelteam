"use client";

import type { CashFlowPeriodFilter } from "@/lib/contracts/cashflow";
import { useCashFlowDataset } from "@/lib/query/hooks/use-cash-flow";

import { CashFlowAlerts } from "../cash-flow/cash-flow-alerts";
import { CashFlowCalendar } from "../cash-flow/cash-flow-calendar";
import { CashFlowEntriesOrigin } from "../cash-flow/cash-flow-entries-origin";
import { CashFlowEvolutionChart } from "../cash-flow/cash-flow-evolution-chart";
import { CashFlowExitsCategory } from "../cash-flow/cash-flow-exits-category";
import { CashFlowKpiCards } from "../cash-flow/cash-flow-kpi-cards";
import { CashFlowProjectionSection } from "../cash-flow/cash-flow-projection-section";
import { CashFlowStatement } from "../cash-flow/cash-flow-statement";

type Props = {
  filter: CashFlowPeriodFilter;
  onAction?: (message: string) => void;
};

export function CashFlowTab({ filter, onAction }: Props) {
  const { data: dataset } = useCashFlowDataset(filter);

  if (!dataset) return null;

  return (
    <div className="admin-page-stack">
      <CashFlowKpiCards kpis={dataset.summaryKpis} />

      <CashFlowEvolutionChart
        chartByGranularity={dataset.chartByGranularity}
        periodLabel={dataset.periodLabel}
        filter={filter}
      />

      <CashFlowProjectionSection projection={dataset.projection} />

      <section className="admin-page-grid grid lg:grid-cols-2">
        <CashFlowEntriesOrigin items={dataset.entriesByOrigin} />
        <CashFlowExitsCategory items={dataset.exitsByCategory} />
      </section>

      <CashFlowStatement
        movements={dataset.movements}
        categories={dataset.movementCategories}
        paymentMethods={dataset.paymentMethods}
        periodLabel={dataset.periodLabel}
        onAction={onAction}
      />

      <section className="admin-page-grid grid lg:grid-cols-2">
        <CashFlowCalendar
          days={dataset.calendarDays}
          monthLabel={dataset.calendarMonthLabel}
        />
        <CashFlowAlerts alerts={dataset.alerts} />
      </section>
    </div>
  );
}
