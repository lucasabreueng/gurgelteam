import { getDataSourceMode } from "@/lib/data-source/mode";
import type { CashFlowPeriodFilter } from "@/lib/contracts/cashflow";
import { CashFlowRepositoryHttp } from "@/repositories/cashflow/CashFlowRepositoryHttp";
import { CashFlowRepositoryMock } from "@/repositories/cashflow/CashFlowRepositoryMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

export function createCashFlowService() {
  return {
    getPeriodOptions: () => CashFlowRepositoryMock.getPeriodOptions(),
    getCashFlowDataset: (filter: CashFlowPeriodFilter) =>
      isHttpMode()
        ? CashFlowRepositoryHttp.getCashFlowDataset(filter)
        : Promise.resolve(CashFlowRepositoryMock.getCashFlowDataset(filter)),
    filterMovements: (
      movements: Parameters<
        typeof CashFlowRepositoryMock.filterMovements
      >[0],
      filters: Parameters<typeof CashFlowRepositoryMock.filterMovements>[1],
    ) => CashFlowRepositoryMock.filterMovements(movements, filters),
    formatBrl: CashFlowRepositoryMock.formatBrl,
    formatVariation: CashFlowRepositoryMock.formatVariation,
  };
}

export type CashFlowService = ReturnType<typeof createCashFlowService>;
export const CashFlowServiceMock = createCashFlowService();
