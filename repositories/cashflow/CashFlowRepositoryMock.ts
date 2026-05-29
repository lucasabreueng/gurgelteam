import * as cashFlowMocks from "@/lib/admin-cash-flow-mocks";
import type {
  CashFlowPeriodFilter,
  CashFlowStatementRow,
} from "@/lib/admin-cash-flow-mocks";

export const CashFlowRepositoryMock = {
  getPeriodOptions: () => cashFlowMocks.CASH_FLOW_PERIOD_OPTIONS,
  getCashFlowDataset: (filter: CashFlowPeriodFilter) =>
    cashFlowMocks.getCashFlowDataset(filter),
  filterMovements: (
    movements: CashFlowStatementRow[],
    filters: Parameters<typeof cashFlowMocks.filterCashFlowMovements>[1]
  ) => cashFlowMocks.filterCashFlowMovements(movements, filters),
  formatBrl: cashFlowMocks.formatBrl,
  formatVariation: cashFlowMocks.formatVariation,
};
