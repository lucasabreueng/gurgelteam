import { CashFlowRepositoryMock } from "@/repositories/cashflow/CashFlowRepositoryMock";

export const CashFlowServiceMock = {
  getInnerTabs: () => CashFlowRepositoryMock.getInnerTabs(),
  getKpis: () => CashFlowRepositoryMock.getKpis(),
  getPeriodSummary: () => CashFlowRepositoryMock.getPeriodSummary(),
  getExpensesDistribution: () => CashFlowRepositoryMock.getExpensesDistribution(),
  getDreMonths: () => CashFlowRepositoryMock.getDreMonths(),
  getDreRows: () => CashFlowRepositoryMock.getDreRows(),
  getDailyCashPreview: () => CashFlowRepositoryMock.getDailyCashPreview(),
  getDailyCashFull: () => CashFlowRepositoryMock.getDailyCashFull(),
  getIndicators: () => CashFlowRepositoryMock.getIndicators(),
  getPeriodHighlights: () => CashFlowRepositoryMock.getPeriodHighlights(),
  getProjection: () => CashFlowRepositoryMock.getProjection(),
  getMovements: () => CashFlowRepositoryMock.getMovements(),
  getCashFlowByPeriod: () => CashFlowRepositoryMock.getCashFlowByPeriod(),
  getDreGrossRevenue: () => CashFlowRepositoryMock.getDreGrossRevenue(),
  formatBrl: CashFlowRepositoryMock.formatBrl,
  formatPercent: CashFlowRepositoryMock.formatPercent,
  formatVariation: CashFlowRepositoryMock.formatVariation,
};
