import type {
  FinancialKpiDTO,
  FinancialTabKey,
  FinancialTabMetaDTO,
  PayableQueryDTO,
  ReceivableQueryDTO,
} from "@/lib/contracts/finance/finance.types";
import type { DrePeriodFilter } from "@/lib/admin-dre-mocks";
import { FinancialRepositoryMock } from "@/repositories/finance/FinancialRepositoryMock";

export const FinancialServiceMock = {
  getTabs() {
    return FinancialRepositoryMock.getTabs();
  },

  getTabMeta(tab: FinancialTabKey): FinancialTabMetaDTO {
    return FinancialRepositoryMock.getTabMeta()[tab];
  },

  getOverviewKpis(): FinancialKpiDTO[] {
    const ids = FinancialRepositoryMock.getOverviewKpiIds();
    return FinancialRepositoryMock.getFinancialKpis().filter((kpi) =>
      (ids as readonly string[]).includes(kpi.id),
    );
  },

  getReceivablesKpis(): FinancialKpiDTO[] {
    return FinancialRepositoryMock.getReceivablesKpis();
  },

  getPayablesKpis(): FinancialKpiDTO[] {
    return FinancialRepositoryMock.getPayablesKpis();
  },

  getMonthlyRevenueChart() {
    return FinancialRepositoryMock.getMonthlyRevenueChart();
  },

  getSmartInsights() {
    return FinancialRepositoryMock.getSmartInsights();
  },

  getTablePageSizes() {
    return FinancialRepositoryMock.getTablePageSizes();
  },

  getReceivableFilterOptions() {
    return FinancialRepositoryMock.getReceivableStatusFilterOptions();
  },

  getReceivablePaymentMethods() {
    return FinancialRepositoryMock.getReceivablePaymentMethods();
  },

  getReceivableServices() {
    return FinancialRepositoryMock.getReceivableServices();
  },

  getPayableCategories() {
    return FinancialRepositoryMock.getPayableCategories();
  },

  getPaymentClientOptions() {
    return FinancialRepositoryMock.getPaymentClientOptions();
  },

  getPaymentMethodOptions() {
    return FinancialRepositoryMock.getPaymentMethodOptions();
  },

  getPaymentServiceOptions() {
    return FinancialRepositoryMock.getPaymentServiceOptions();
  },

  listReceivables(filters: ReceivableQueryDTO) {
    return FinancialRepositoryMock.filterReceivables(filters);
  },

  listPayables(filters: PayableQueryDTO) {
    return FinancialRepositoryMock.filterPayables(filters);
  },

  getAllReceivables() {
    return FinancialRepositoryMock.getAccountsReceivable();
  },

  getAllPayables() {
    return FinancialRepositoryMock.getAccountsPayable();
  },

  getRevenueSources: () => FinancialRepositoryMock.getRevenueSources(),
  getExpenseCategories: () => FinancialRepositoryMock.getExpenseCategories(),
  getPackageCredits: () => FinancialRepositoryMock.getPackageCredits(),
  getPackageStatusLabels: () => FinancialRepositoryMock.getPackageStatusLabels(),
  getDelinquencyItems: () => FinancialRepositoryMock.getDelinquencyItems(),
  getDelinquencyTotal: () => FinancialRepositoryMock.getDelinquencyTotal(),
  getKartFinancials: () => FinancialRepositoryMock.getKartFinancials(),
  getClientFinancials: () => FinancialRepositoryMock.getClientFinancials(),
  getFinancialReports: () => FinancialRepositoryMock.getFinancialReports(),
  getPaymentMethods: () => FinancialRepositoryMock.getPaymentMethods(),
  getRevenueByService: () => FinancialRepositoryMock.getRevenueByService(),
  getInOutChart: () => FinancialRepositoryMock.getInOutChart(),
  getFinancialEvolution: () => FinancialRepositoryMock.getFinancialEvolution(),
  getOperationalKpis: () => FinancialRepositoryMock.getOperationalKpis(),
  getBusinessEvolution: () => FinancialRepositoryMock.getBusinessEvolution(),
  getRevenueOrigin: () => FinancialRepositoryMock.getRevenueOrigin(),
  getExecutiveAlerts: () => FinancialRepositoryMock.getExecutiveAlerts(),
  getUpcomingPayables: () => FinancialRepositoryMock.getUpcomingPayables(),
  getCommercialRanking: () => FinancialRepositoryMock.getCommercialRanking(),
  getDrePeriodOptions: () => FinancialRepositoryMock.getDrePeriodOptions(),
  getDreDataset: (filter: DrePeriodFilter) =>
    FinancialRepositoryMock.getDreDataset(filter),
  getDreAccountEntries: (accountId: string, filter: DrePeriodFilter) =>
    FinancialRepositoryMock.getDreAccountEntries(accountId, filter),
  formatDreBrl: FinancialRepositoryMock.formatDreBrl,
  formatDrePercent: FinancialRepositoryMock.formatDrePercent,
  formatDreVariation: FinancialRepositoryMock.formatDreVariation,
};
