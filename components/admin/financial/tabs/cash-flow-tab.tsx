"use client";

import { useState } from "react";
import type { CashFlowInnerTabKey } from "@/lib/contracts/cashflow";
import { CashFlowKpiCards } from "../cash-flow/cash-flow-kpi-cards";
import { CashFlowInnerTabs } from "../cash-flow/cash-flow-inner-tabs";
import { PeriodSummaryCard } from "../cash-flow/period-summary-card";
import { CashFlowChart } from "../cash-flow/cash-flow-chart";
import { ExpensesDistributionCard } from "../cash-flow/expenses-distribution-card";
import { DreTable } from "../cash-flow/dre-table";
import { DailyCashCard } from "../cash-flow/daily-cash-card";
import { FinancialIndicatorsCard } from "../cash-flow/financial-indicators-card";
import { PeriodHighlights } from "../cash-flow/period-highlights";
import { ProjectionTab } from "../cash-flow/projection-tab";
import { MovementsTab } from "../cash-flow/movements-tab";

function OverviewContent() {
  return (
    <div className="admin-page-stack">
      <PeriodSummaryCard />
      <CashFlowChart />
      <section className="admin-page-grid grid gap-4 xl:grid-cols-2">
        <ExpensesDistributionCard />
        <DailyCashCard />
      </section>
      <DreTable compact />
      <section className="admin-page-grid grid gap-4 lg:grid-cols-2">
        <FinancialIndicatorsCard />
        <PeriodHighlights />
      </section>
    </div>
  );
}

function DetailedContent() {
  return (
    <div className="admin-page-stack">
      <PeriodSummaryCard />
      <CashFlowChart tall />
      <ExpensesDistributionCard />
      <DreTable />
      <section className="admin-page-grid grid gap-4 lg:grid-cols-2">
        <DailyCashCard expanded />
        <FinancialIndicatorsCard />
      </section>
      <PeriodHighlights />
    </div>
  );
}

function InnerPanel({ tab }: { tab: CashFlowInnerTabKey }) {
  switch (tab) {
    case "overview":
      return <OverviewContent />;
    case "detailed":
      return <DetailedContent />;
    case "dre":
      return (
        <div className="admin-page-stack">
          <DreTable />
        </div>
      );
    case "projection":
      return <ProjectionTab />;
    case "movements":
      return <MovementsTab />;
    default:
      return null;
  }
}

export function CashFlowTab() {
  const [innerTab, setInnerTab] = useState<CashFlowInnerTabKey>("overview");

  return (
    <div className="admin-page-stack">
      <CashFlowKpiCards />

      <CashFlowInnerTabs active={innerTab} onChange={setInnerTab} />

      <div
        role="tabpanel"
        id={`cashflow-inner-${innerTab}`}
        aria-labelledby={`cashflow-inner-tab-${innerTab}`}
      >
        <InnerPanel tab={innerTab} />
      </div>
    </div>
  );
}
