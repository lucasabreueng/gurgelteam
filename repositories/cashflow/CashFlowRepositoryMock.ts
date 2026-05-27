import * as cashFlowMocks from "@/lib/admin-cash-flow-mocks";

export const CashFlowRepositoryMock = {
  getInnerTabs: () => cashFlowMocks.CASH_FLOW_INNER_TABS,
  getKpis: () => cashFlowMocks.CASH_FLOW_KPIS,
  getPeriodSummary: () => cashFlowMocks.PERIOD_SUMMARY,
  getExpensesDistribution: () => cashFlowMocks.EXPENSES_DISTRIBUTION,
  getDreMonths: () => cashFlowMocks.DRE_MONTHS,
  getDreRows: () => cashFlowMocks.DRE_ROWS,
  getDailyCashPreview: () => cashFlowMocks.DAILY_CASH_PREVIEW,
  getDailyCashFull: () => cashFlowMocks.DAILY_CASH_FULL,
  getIndicators: () => cashFlowMocks.CASH_FLOW_INDICATORS,
  getPeriodHighlights: () => cashFlowMocks.PERIOD_HIGHLIGHTS,
  getProjection: () => cashFlowMocks.CASH_FLOW_PROJECTION,
  getMovements: () => cashFlowMocks.CASH_FLOW_MOVEMENTS,
  getCashFlowByPeriod: () => cashFlowMocks.CASH_FLOW_BY_PERIOD,
  getDreGrossRevenue: () => cashFlowMocks.DRE_GROSS_REVENUE,
  formatBrl: cashFlowMocks.formatBrl,
  formatPercent: cashFlowMocks.formatPercent,
  formatVariation: cashFlowMocks.formatVariation,
};
