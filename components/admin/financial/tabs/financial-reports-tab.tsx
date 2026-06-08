"use client";

import { FinancialReportsSection } from "../financial-reports-section";
import { RevenueChart } from "../revenue-chart";
import {
  FinancialEvolutionChart,
  InOutChart,
  PaymentMethodsChart,
  RevenueByServiceChart,
} from "../payment-methods-chart";
import { SmartFinancialInsights } from "../smart-financial-insights";

type Props = {
  onAction: (msg: string) => void;
};

export function FinancialReportsTab({ onAction }: Props) {
  return (
    <div className="admin-page-stack">
      <section aria-labelledby="reports-charts-heading">
        <h2
          id="reports-charts-heading"
          className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-500"
        >
          Indicadores (dados reais em modo HTTP)
        </h2>
        <div className="admin-page-grid grid lg:grid-cols-2">
          <RevenueChart />
          <InOutChart />
        </div>
        <div className="admin-page-grid mt-4 grid lg:grid-cols-2">
          <PaymentMethodsChart />
          <RevenueByServiceChart />
        </div>
        <div className="mt-4">
          <FinancialEvolutionChart />
        </div>
        <div className="mt-4">
          <SmartFinancialInsights />
        </div>
      </section>

      <FinancialReportsSection onAction={onAction} />
    </div>
  );
}
