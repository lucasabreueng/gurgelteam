import type { CashFlowPeriodFilter, CashFlowStatementRow } from "@/lib/admin-cash-flow-mocks";
import { CashFlowRepositoryMock } from "@/repositories/cashflow/CashFlowRepositoryMock";

export const CashFlowServiceMock = {
  getPeriodOptions: () => CashFlowRepositoryMock.getPeriodOptions(),
  getCashFlowDataset: (filter: CashFlowPeriodFilter) =>
    CashFlowRepositoryMock.getCashFlowDataset(filter),
  filterMovements: (
    movements: CashFlowStatementRow[],
    filters: Parameters<typeof CashFlowRepositoryMock.filterMovements>[1]
  ) => CashFlowRepositoryMock.filterMovements(movements, filters),
  formatBrl: CashFlowRepositoryMock.formatBrl,
  formatVariation: CashFlowRepositoryMock.formatVariation,
};
