import { getDataSourceMode } from "@/lib/data-source/mode";
import type { DrePeriodFilter } from "@/lib/admin-dre-mocks";
import type {
  ExecutiveAlert,
  ExecutiveAlertPriority,
} from "@/lib/admin-financial-mocks";
import type { FinancialTabKey } from "@/lib/contracts/finance/finance.types";
import type {
  PayableQueryDTO,
  ReceivableQueryDTO,
} from "@/lib/contracts/finance/finance.types";
import { FinancialRepositoryHttp } from "@/repositories/finance/FinancialRepositoryHttp";
import { FinancialRepositoryMock } from "@/repositories/finance/FinancialRepositoryMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

async function loadCharts() {
  return FinancialRepositoryHttp.getCharts();
}

async function loadInsights() {
  return FinancialRepositoryHttp.getInsights();
}

async function loadMeta() {
  return FinancialRepositoryHttp.getMeta();
}

function mapExecutiveAlertsFromApi(
  rows: { id: string; severity: string; title: string; message: string }[],
): ExecutiveAlert[] {
  return rows.map((row) => ({
    id: row.id,
    priority: (["critical", "warning", "info", "maintenance"].includes(row.severity)
      ? row.severity
      : "warning") as ExecutiveAlertPriority,
    icon: row.severity === "critical" ? "⚠️" : "📋",
    title: row.title,
    description: row.message,
    actionLabel: "Ver detalhes",
    action: "receivables",
  }));
}

export function createFinancialService() {
  return {
    getTabs: () => FinancialRepositoryMock.getTabs(),
    getTabMeta: (tab: FinancialTabKey) =>
      FinancialRepositoryMock.getTabMeta()[tab],
    getOverviewKpis: () =>
      isHttpMode()
        ? FinancialRepositoryHttp.getOverviewKpis()
        : Promise.resolve(
            FinancialRepositoryMock.getFinancialKpis().filter((kpi) =>
              (FinancialRepositoryMock.getOverviewKpiIds() as readonly string[]).includes(
                kpi.id,
              ),
            ),
          ),
    getReceivablesKpis: () =>
      isHttpMode()
        ? FinancialRepositoryHttp.getReceivablesKpis()
        : Promise.resolve(FinancialRepositoryMock.getReceivablesKpis()),
    getPayablesKpis: () =>
      isHttpMode()
        ? FinancialRepositoryHttp.getPayablesKpis()
        : Promise.resolve(FinancialRepositoryMock.getPayablesKpis()),
    getMonthlyRevenueChart: () =>
      isHttpMode()
        ? loadCharts().then((c) => c.monthlyRevenueChart)
        : Promise.resolve(FinancialRepositoryMock.getMonthlyRevenueChart()),
    getSmartInsights: () =>
      isHttpMode()
        ? loadCharts().then((c) => c.smartInsights)
        : Promise.resolve(FinancialRepositoryMock.getSmartInsights()),
    getInOutChart: () =>
      isHttpMode()
        ? loadCharts().then((c) => c.inOutChart)
        : Promise.resolve(FinancialRepositoryMock.getInOutChart()),
    getRevenueByService: () =>
      isHttpMode()
        ? loadCharts().then((c) => c.revenueByService)
        : Promise.resolve(FinancialRepositoryMock.getRevenueByService()),
    getExecutiveAlerts: () =>
      isHttpMode()
        ? loadCharts().then((c) => mapExecutiveAlertsFromApi(c.executiveAlerts))
        : Promise.resolve(FinancialRepositoryMock.getExecutiveAlerts()),
    getRevenueOrigin: () =>
      isHttpMode()
        ? loadCharts().then((c) => c.revenueOrigin)
        : Promise.resolve(FinancialRepositoryMock.getRevenueOrigin()),
    getBusinessEvolution: () =>
      isHttpMode()
        ? loadCharts().then((c) => c.businessEvolution)
        : Promise.resolve(FinancialRepositoryMock.getBusinessEvolution()),
    getPaymentMethods: () =>
      isHttpMode()
        ? loadCharts().then((c) => c.paymentMethods)
        : Promise.resolve(FinancialRepositoryMock.getPaymentMethods()),
    getUpcomingPayables: () =>
      isHttpMode()
        ? loadCharts().then((c) => c.upcomingPayables)
        : Promise.resolve(FinancialRepositoryMock.getUpcomingPayables()),
    getTablePageSizes: () =>
      isHttpMode()
        ? loadMeta().then((m) => [...m.tablePageSizes])
        : FinancialRepositoryMock.getTablePageSizes(),
    getReceivableFilterOptions: () =>
      isHttpMode()
        ? loadMeta().then((m) => m.receivableFilterOptions)
        : FinancialRepositoryMock.getReceivableStatusFilterOptions(),
    getReceivablePaymentMethods: () =>
      isHttpMode()
        ? loadMeta().then((m) => m.receivablePaymentMethods)
        : FinancialRepositoryMock.getReceivablePaymentMethods(),
    getReceivableServices: () =>
      isHttpMode()
        ? loadMeta().then((m) => m.receivableServices)
        : FinancialRepositoryMock.getReceivableServices(),
    getPayableCategories: () =>
      isHttpMode()
        ? loadMeta().then((m) => m.payableCategories)
        : FinancialRepositoryMock.getPayableCategories(),
    getPaymentClientOptions: () =>
      isHttpMode()
        ? loadMeta().then((m) => m.paymentClientOptions)
        : FinancialRepositoryMock.getPaymentClientOptions(),
    getPaymentMethodOptions: () =>
      isHttpMode()
        ? loadMeta().then((m) => m.paymentMethodOptions)
        : FinancialRepositoryMock.getPaymentMethodOptions(),
    getPaymentServiceOptions: () =>
      isHttpMode()
        ? loadMeta().then((m) => m.paymentServiceOptions)
        : FinancialRepositoryMock.getPaymentServiceOptions(),
    listPayables: (filters: PayableQueryDTO) =>
      isHttpMode()
        ? FinancialRepositoryHttp.listPayables(filters)
        : Promise.resolve(FinancialRepositoryMock.filterPayables(filters)),
    recordPayment: (payload: {
      receivableId: string;
      amountCents: number;
      paidAt: string;
      method: string;
    }) =>
      isHttpMode()
        ? FinancialRepositoryHttp.recordPayment(payload)
        : Promise.reject(new Error("Pagamento HTTP indisponível em modo mock.")),
    listReceivables: (filters: ReceivableQueryDTO) =>
      isHttpMode()
        ? FinancialRepositoryHttp.listReceivables(filters)
        : Promise.resolve(FinancialRepositoryMock.filterReceivables(filters)),
    getAllReceivables: () =>
      isHttpMode()
        ? FinancialRepositoryHttp.listReceivables({
            query: "",
            status: "",
            method: "",
            service: "",
          })
        : Promise.resolve(FinancialRepositoryMock.getAccountsReceivable()),
    getAllPayables: () =>
      isHttpMode()
        ? FinancialRepositoryHttp.listPayables({
            query: "",
            status: "",
            method: "",
            category: "",
          })
        : Promise.resolve(FinancialRepositoryMock.getAccountsPayable()),
    getRevenueSources: () =>
      isHttpMode()
        ? loadInsights().then((i) => i.revenueSources)
        : Promise.resolve(FinancialRepositoryMock.getRevenueSources()),
    getExpenseCategories: () =>
      isHttpMode()
        ? loadInsights().then((i) => i.expenseCategories)
        : Promise.resolve(FinancialRepositoryMock.getExpenseCategories()),
    getPackageCredits: () =>
      isHttpMode()
        ? loadInsights().then((i) => i.packageCredits)
        : Promise.resolve(FinancialRepositoryMock.getPackageCredits()),
    getPackageStatusLabels: () => FinancialRepositoryMock.getPackageStatusLabels(),
    getDelinquencyItems: () =>
      isHttpMode()
        ? loadInsights().then((i) => i.delinquencyItems)
        : Promise.resolve(FinancialRepositoryMock.getDelinquencyItems()),
    getDelinquencyTotal: () =>
      isHttpMode()
        ? loadInsights().then((i) => i.delinquencyTotal)
        : Promise.resolve(FinancialRepositoryMock.getDelinquencyTotal()),
    getKartFinancials: () =>
      isHttpMode()
        ? loadInsights().then((i) => i.kartFinancials)
        : Promise.resolve(FinancialRepositoryMock.getKartFinancials()),
    getClientFinancials: () =>
      isHttpMode()
        ? loadInsights().then((i) => i.clientFinancials)
        : Promise.resolve(FinancialRepositoryMock.getClientFinancials()),
    getFinancialReports: () =>
      isHttpMode()
        ? loadMeta().then((m) => m.financialReports)
        : Promise.resolve(FinancialRepositoryMock.getFinancialReports()),
    getInsights: () =>
      isHttpMode()
        ? loadInsights()
        : Promise.resolve({
            packageCredits: FinancialRepositoryMock.getPackageCredits(),
            delinquencyItems: FinancialRepositoryMock.getDelinquencyItems(),
            delinquencyTotal: FinancialRepositoryMock.getDelinquencyTotal(),
            commercialRanking: FinancialRepositoryMock.getCommercialRanking(),
            kartFinancials: FinancialRepositoryMock.getKartFinancials(),
            clientFinancials: FinancialRepositoryMock.getClientFinancials(),
            revenueSources: FinancialRepositoryMock.getRevenueSources(),
            expenseCategories: FinancialRepositoryMock.getExpenseCategories(),
          }),
    getFinancialEvolution: () =>
      isHttpMode()
        ? loadCharts().then((c) => c.financialEvolution)
        : Promise.resolve(FinancialRepositoryMock.getFinancialEvolution()),
    getOperationalKpis: () =>
      isHttpMode()
        ? loadMeta().then((m) => m.operationalKpis)
        : Promise.resolve(FinancialRepositoryMock.getOperationalKpis()),
    getMeta: () =>
      isHttpMode()
        ? loadMeta()
        : Promise.resolve({
            financialReports: FinancialRepositoryMock.getFinancialReports(),
            operationalKpis: FinancialRepositoryMock.getOperationalKpis(),
            receivableFilterOptions:
              FinancialRepositoryMock.getReceivableStatusFilterOptions(),
            receivablePaymentMethods: [
              ...FinancialRepositoryMock.getReceivablePaymentMethods(),
            ],
            receivableServices: [...FinancialRepositoryMock.getReceivableServices()],
            payableCategories: [...FinancialRepositoryMock.getPayableCategories()],
            paymentClientOptions:
              FinancialRepositoryMock.getPaymentClientOptions(),
            paymentMethodOptions:
              FinancialRepositoryMock.getPaymentMethodOptions(),
            paymentServiceOptions:
              FinancialRepositoryMock.getPaymentServiceOptions(),
            tablePageSizes: FinancialRepositoryMock.getTablePageSizes(),
            packageStatusLabels: FinancialRepositoryMock.getPackageStatusLabels(),
          }),
    getCommercialRanking: () =>
      isHttpMode()
        ? loadInsights().then((i) => i.commercialRanking)
        : Promise.resolve(FinancialRepositoryMock.getCommercialRanking()),
    getDrePeriodOptions: () => FinancialRepositoryMock.getDrePeriodOptions(),
    getDreDataset: (filter: DrePeriodFilter) =>
      isHttpMode()
        ? FinancialRepositoryHttp.getDreDataset(filter)
        : Promise.resolve(FinancialRepositoryMock.getDreDataset(filter)),
    getDreAccountEntries: (accountId: string, filter: DrePeriodFilter) =>
      isHttpMode()
        ? FinancialRepositoryHttp.getDreAccountEntries(accountId, filter)
        : Promise.resolve(
            FinancialRepositoryMock.getDreAccountEntries(accountId, filter),
          ),
    formatDreBrl: FinancialRepositoryMock.formatDreBrl,
    formatDrePercent: FinancialRepositoryMock.formatDrePercent,
    formatDreVariation: FinancialRepositoryMock.formatDreVariation,
  };
}

export type FinancialService = ReturnType<typeof createFinancialService>;
export const FinancialServiceMock = createFinancialService();
