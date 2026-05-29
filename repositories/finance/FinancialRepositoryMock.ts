import * as financialMocks from "@/lib/admin-financial-mocks";
import * as dreMocks from "@/lib/admin-dre-mocks";
import type { DrePeriodFilter } from "@/lib/admin-dre-mocks";
import type {
  AccountPayableDTO,
  AccountReceivableDTO,
  PayableQueryDTO,
  ReceivableQueryDTO,
} from "@/lib/contracts/finance/finance.types";

function toReceivableDTO(row: financialMocks.AccountReceivable): AccountReceivableDTO {
  return {
    id: row.id,
    clientId: row.clientId,
    clientName: row.clientName,
    amount: row.amount,
    dueDate: row.dueDate,
    status: row.status,
    paymentMethod: row.paymentMethod,
    service: row.service,
  };
}

function toPayableDTO(row: financialMocks.AccountPayable): AccountPayableDTO {
  return {
    id: row.id,
    supplierName: row.supplierName,
    category: row.category,
    amount: row.amount,
    dueDate: row.dueDate,
    status: row.status,
    paymentMethod: row.paymentMethod,
  };
}

export const FinancialRepositoryMock = {
  getTabs: () => financialMocks.FINANCIAL_TABS,
  getTabMeta: () => financialMocks.FINANCIAL_TAB_META,
  getOverviewKpiIds: () => financialMocks.OVERVIEW_FINANCIAL_KPI_IDS,
  getFinancialKpis: () => financialMocks.FINANCIAL_KPIS,
  getReceivablesKpis: () => financialMocks.RECEIVABLES_KPIS,
  getPayablesKpis: () => financialMocks.PAYABLES_KPIS,
  getMonthlyRevenueChart: () => financialMocks.MONTHLY_REVENUE_CHART,
  getSmartInsights: () => financialMocks.SMART_FINANCIAL_INSIGHTS,
  getTablePageSizes: () => financialMocks.FINANCIAL_TABLE_PAGE_SIZES,
  getReceivableStatusFilterOptions: () => financialMocks.RECEIVABLE_STATUS_FILTER_OPTIONS,
  getReceivablePaymentMethods: () => financialMocks.RECEIVABLE_PAYMENT_METHODS,
  getReceivableServices: () => financialMocks.RECEIVABLE_SERVICES,
  getPayableCategories: () => financialMocks.PAYABLE_CATEGORIES,
  getPaymentClientOptions: () => financialMocks.PAYMENT_CLIENT_OPTIONS,
  getPaymentMethodOptions: () => financialMocks.PAYMENT_METHOD_OPTIONS,
  getPaymentServiceOptions: () => financialMocks.PAYMENT_SERVICE_OPTIONS,

  getAccountsReceivable(): AccountReceivableDTO[] {
    return financialMocks.ACCOUNTS_RECEIVABLE.map(toReceivableDTO);
  },

  getAccountsPayable(): AccountPayableDTO[] {
    return financialMocks.ACCOUNTS_PAYABLE.map(toPayableDTO);
  },

  filterReceivables(filters: ReceivableQueryDTO): AccountReceivableDTO[] {
    const filtered = financialMocks.filterAccountsReceivable(
      financialMocks.ACCOUNTS_RECEIVABLE,
      filters,
    );
    return filtered.map(toReceivableDTO);
  },

  filterPayables(filters: PayableQueryDTO): AccountPayableDTO[] {
    const filtered = financialMocks.filterAccountsPayable(
      financialMocks.ACCOUNTS_PAYABLE,
      filters,
    );
    return filtered.map(toPayableDTO);
  },

  getRevenueSources: () => financialMocks.REVENUE_SOURCES,
  getExpenseCategories: () => financialMocks.EXPENSE_CATEGORIES,
  getPackageCredits: () => financialMocks.PACKAGE_CREDITS,
  getPackageStatusLabels: () => financialMocks.PACKAGE_STATUS_LABEL,
  getDelinquencyItems: () => financialMocks.DELINQUENCY_ITEMS,
  getDelinquencyTotal: () => financialMocks.DELINQUENCY_TOTAL,
  getKartFinancials: () => financialMocks.KART_FINANCIALS,
  getClientFinancials: () => financialMocks.CLIENT_FINANCIALS,
  getFinancialReports: () => financialMocks.FINANCIAL_REPORTS,
  getPaymentMethods: () => financialMocks.PAYMENT_METHODS,
  getRevenueByService: () => financialMocks.REVENUE_BY_SERVICE,
  getInOutChart: () => financialMocks.IN_OUT_CHART,
  getFinancialEvolution: () => financialMocks.FINANCIAL_EVOLUTION,
  getOperationalKpis: () => financialMocks.EXECUTIVE_OPERATIONAL_KPIS,
  getBusinessEvolution: () => financialMocks.BUSINESS_EVOLUTION,
  getRevenueOrigin: () => financialMocks.REVENUE_ORIGIN,
  getExecutiveAlerts: () => financialMocks.EXECUTIVE_ALERTS,
  getUpcomingPayables: () => financialMocks.EXECUTIVE_UPCOMING_PAYABLES,
  getCommercialRanking: () => financialMocks.EXECUTIVE_COMMERCIAL_RANKING,
  getDrePeriodOptions: () => dreMocks.DRE_PERIOD_OPTIONS,
  getDreDataset: (filter: DrePeriodFilter) => dreMocks.getDreDataset(filter),
  getDreAccountEntries: (accountId: string, filter: DrePeriodFilter) =>
    dreMocks.getDreAccountEntries(accountId, filter),
  formatDreBrl: dreMocks.formatDreBrlAbs,
  formatDrePercent: dreMocks.formatPercent,
  formatDreVariation: dreMocks.formatVariation,
};
