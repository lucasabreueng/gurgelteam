"use client";

import type { DrePeriodFilter } from "@/lib/admin-dre-mocks";
import type { DreStructuredRow } from "@/lib/admin-dre-mocks";
import { useDreDataset } from "@/lib/query/hooks/use-dre";

import { useState } from "react";

import { DreAccountModal } from "../dre/dre-account-modal";
import { DreCostCenters, DreRevenueCenters } from "../dre/dre-centers-panel";
import { DreMarginsSection } from "../dre/dre-margins-section";
import { DreMonthlyComparisonChart } from "../dre/dre-monthly-comparison-chart";
import { DreStructuredTable } from "../dre/dre-structured-table";
import { DreSummaryKpis } from "../dre/dre-summary-kpis";

type Props = {
  filter: DrePeriodFilter;
};

export function DreTab({ filter }: Props) {
  const [selectedRow, setSelectedRow] = useState<DreStructuredRow | null>(null);
  const { data: dataset } = useDreDataset(filter);

  if (!dataset) return null;

  return (
    <div className="admin-page-stack">
      <DreSummaryKpis kpis={dataset.summaryKpis} />

      <DreStructuredTable
        rows={dataset.structuredRows}
        grossRevenue={dataset.grossRevenue}
        periodLabel={dataset.periodLabel}
        previousPeriodLabel={dataset.previousPeriodLabel}
        viewMode={dataset.viewMode}
        monthColumns={dataset.monthColumns}
        onAccountClick={setSelectedRow}
      />

      <DreMonthlyComparisonChart
        data={dataset.monthlyComparison}
        periodLabel={dataset.periodLabel}
      />

      <DreMarginsSection margins={dataset.margins} />

      <section className="admin-page-grid grid lg:grid-cols-2">
        <DreRevenueCenters items={dataset.revenueCenters} />
        <DreCostCenters items={dataset.costCenters} />
      </section>

      <DreAccountModal
        open={!!selectedRow}
        row={selectedRow}
        filter={filter}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  );
}
