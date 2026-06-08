import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type {
  AccountPayableApiDTO,
  AccountReceivableApiDTO,
} from "@/lib/contracts/api/v1/finance.api.schemas";
import type { DrePeriodFilter } from "@/lib/admin-dre-mocks";
import type { DreDataset } from "@/lib/admin-dre-mocks";
import type {
  AccountPayableDTO,
  AccountReceivableDTO,
  FinancialKpiDTO,
  PayableQueryDTO,
  ReceivableQueryDTO,
} from "@/lib/contracts/finance/finance.types";
import { formatCentsBrl } from "@/lib/server/format-money";

type FinanceOverview = {
  revenueMonthCents: number;
  receivableTotalCents: number;
  receivableCount: number;
  delinquentTotalCents: number;
  payableTotalCents: number;
  payableCount: number;
  formatted: {
    revenueMonth: string;
    receivableTotal: string;
    delinquentTotal: string;
    payableTotal: string;
  };
};

function mapReceivableApiToUi(
  row: AccountReceivableApiDTO,
): AccountReceivableDTO {
  return {
    id: row.id,
    clientId: row.clientId,
    clientName: row.clientName,
    amount: formatCentsBrl(row.amountCents),
    dueDate: row.dueDate,
    status: row.status,
    paymentMethod: row.paymentMethod ?? "",
    service: row.serviceLabel,
  };
}

function mapPayableApiToUi(row: AccountPayableApiDTO): AccountPayableDTO {
  return {
    id: row.id,
    supplierName: row.supplierName,
    category: row.category,
    amount: formatCentsBrl(row.amountCents),
    dueDate: row.dueDate,
    status: row.status,
    paymentMethod: row.paymentMethod ?? "",
  };
}

function buildReceivablesUrl(filters: ReceivableQueryDTO): string {
  const params = new URLSearchParams({
    query: filters.query,
    status: filters.status,
    method: filters.method,
    service: filters.service,
  });
  return `${v1ApiPaths.finance.receivables}?${params.toString()}`;
}

function buildPayablesUrl(filters: PayableQueryDTO): string {
  const params = new URLSearchParams({
    query: filters.query,
    status: filters.status,
    method: filters.method,
    category: filters.category,
  });
  return `${v1ApiPaths.finance.payables}?${params.toString()}`;
}

function buildDreUrl(filter: DrePeriodFilter): string {
  const params = new URLSearchParams({ key: filter.key });
  if (filter.customStart) params.set("customStart", filter.customStart);
  if (filter.customEnd) params.set("customEnd", filter.customEnd);
  return `${v1ApiPaths.finance.dre}?${params.toString()}`;
}

export const FinancialRepositoryHttp = {
  async listReceivables(
    filters: ReceivableQueryDTO,
  ): Promise<AccountReceivableDTO[]> {
    const res = await apiFetch<AccountReceivableApiDTO[]>(
      buildReceivablesUrl(filters),
    );
    return unwrapApiResponse(res).map(mapReceivableApiToUi);
  },

  async listPayables(filters: PayableQueryDTO): Promise<AccountPayableDTO[]> {
    const res = await apiFetch<AccountPayableApiDTO[]>(
      buildPayablesUrl(filters),
    );
    return unwrapApiResponse(res).map(mapPayableApiToUi);
  },

  async getOverview(): Promise<FinanceOverview> {
    const res = await apiFetch<FinanceOverview>(v1ApiPaths.finance.overview);
    return unwrapApiResponse(res);
  },

  async getOverviewKpis(): Promise<FinancialKpiDTO[]> {
    const overview = await FinancialRepositoryHttp.getOverview();
    const cashEstimate = Math.max(
      0,
      overview.revenueMonthCents - overview.payableTotalCents,
    );
    return [
      {
        id: "revenue-month",
        label: "Receita do mês",
        value: overview.formatted.revenueMonth,
        delta: "Pagamentos registrados",
        deltaPositive: overview.revenueMonthCents > 0,
      },
      {
        id: "profit-month",
        label: "Lucro do mês",
        value: formatCentsBrl(0),
        delta: "Sem lançamento de lucro",
        deltaPositive: true,
      },
      {
        id: "cash-balance",
        label: "Saldo em caixa",
        value: formatCentsBrl(cashEstimate),
        delta: "Estimativa do período",
        deltaPositive: cashEstimate >= 0,
      },
      {
        id: "delinquency",
        label: "Inadimplência",
        value: overview.formatted.delinquentTotal,
        delta: "Títulos vencidos",
        deltaPositive: overview.delinquentTotalCents === 0,
      },
      {
        id: "monthly-goal",
        label: "Meta mensal",
        value: overview.revenueMonthCents > 0 ? "—" : "0%",
        delta: "Meta não configurada",
        deltaPositive: true,
      },
    ];
  },

  async getReceivablesKpis(): Promise<FinancialKpiDTO[]> {
    const res = await apiFetch<AccountReceivableApiDTO[]>(
      `${v1ApiPaths.finance.receivables}?query=&status=&method=&service=`,
    );
    const rows = unwrapApiResponse(res);
    const sum = (status: AccountReceivableApiDTO["status"]) =>
      rows
        .filter((r) => r.status === status)
        .reduce((s, r) => s + r.amountCents, 0);
    const count = (status: AccountReceivableApiDTO["status"]) =>
      rows.filter((r) => r.status === status).length;

    return [
      {
        id: "received",
        label: "Recebidos",
        value: formatCentsBrl(sum("pago")),
        delta: `${count("pago")} pagamento${count("pago") === 1 ? "" : "s"}`,
        deltaPositive: true,
      },
      {
        id: "pending",
        label: "Pendentes",
        value: formatCentsBrl(sum("pendente")),
        delta: `${count("pendente")} título${count("pendente") === 1 ? "" : "s"}`,
        deltaPositive: true,
      },
      {
        id: "overdue",
        label: "Vencidos",
        value: formatCentsBrl(sum("vencido")),
        delta: `${count("vencido")} título${count("vencido") === 1 ? "" : "s"}`,
        deltaPositive: count("vencido") === 0,
      },
      {
        id: "partial",
        label: "Parciais",
        value: formatCentsBrl(sum("parcial")),
        delta: `${count("parcial")} título${count("parcial") === 1 ? "" : "s"}`,
        deltaPositive: true,
      },
    ];
  },

  async getPayablesKpis(): Promise<FinancialKpiDTO[]> {
    const res = await apiFetch<AccountPayableApiDTO[]>(
      `${v1ApiPaths.finance.payables}?query=&status=&method=&category=`,
    );
    const rows = unwrapApiResponse(res);
    const sum = (status: AccountPayableApiDTO["status"]) =>
      rows
        .filter((r) => r.status === status)
        .reduce((s, r) => s + r.amountCents, 0);
    const count = (status: AccountPayableApiDTO["status"]) =>
      rows.filter((r) => r.status === status).length;

    return [
      {
        id: "paid",
        label: "Pagos",
        value: formatCentsBrl(sum("pago")),
        delta: `${count("pago")} pagamento${count("pago") === 1 ? "" : "s"}`,
        deltaPositive: true,
      },
      {
        id: "pending",
        label: "Pendentes",
        value: formatCentsBrl(sum("pendente")),
        delta: `${count("pendente")} título${count("pendente") === 1 ? "" : "s"}`,
        deltaPositive: true,
      },
      {
        id: "overdue",
        label: "Vencidos",
        value: formatCentsBrl(sum("vencido")),
        delta: `${count("vencido")} título${count("vencido") === 1 ? "" : "s"}`,
        deltaPositive: count("vencido") === 0,
      },
      {
        id: "partial",
        label: "Parciais",
        value: formatCentsBrl(sum("parcial")),
        delta: `${count("parcial")} título${count("parcial") === 1 ? "" : "s"}`,
        deltaPositive: true,
      },
    ];
  },

  async getDreDataset(filter: DrePeriodFilter): Promise<DreDataset> {
    const res = await apiFetch<DreDataset>(buildDreUrl(filter));
    return unwrapApiResponse(res);
  },

  async getCharts() {
    const res = await apiFetch<{
      monthlyRevenueChart: {
        months: string[];
        revenue: number[];
        forecast: number[];
      };
      inOutChart: { months: string[]; entries: number[]; exits: number[] };
      revenueByService: { name: string; value: number }[];
      revenueOrigin: {
        name: string;
        value: number;
        amount: string;
        percent: number;
      }[];
      paymentMethods: { name: string; value: number; amount: string }[];
      businessEvolution: Record<
        string,
        {
          labels: string[];
          revenue: number[];
          profit: number[];
          goal: number[];
        }
      >;
      upcomingPayables: {
        id: string;
        description: string;
        category: string;
        amount: string;
        dueDate: string;
      }[];
      smartInsights: string[];
      executiveAlerts: {
        id: string;
        severity: string;
        title: string;
        message: string;
      }[];
      financialEvolution: {
        weeks: string[];
        revenue: number[];
        costs: number[];
        margin: number[];
      };
    }>(v1ApiPaths.finance.charts);
    return unwrapApiResponse(res);
  },

  async getInsights() {
    const res = await apiFetch<{
      packageCredits: import("@/lib/admin-financial-mocks").PackageCredit[];
      delinquencyItems: import("@/lib/admin-financial-mocks").DelinquencyItem[];
      delinquencyTotal: string;
      commercialRanking: import("@/lib/admin-financial-mocks").CommercialRankingEntry[];
      kartFinancials: import("@/lib/admin-financial-mocks").KartFinancial[];
      clientFinancials: import("@/lib/admin-financial-mocks").ClientFinancial[];
      revenueSources: import("@/lib/admin-financial-mocks").RevenueSource[];
      expenseCategories: import("@/lib/admin-financial-mocks").ExpenseCategory[];
    }>(v1ApiPaths.finance.insights);
    return unwrapApiResponse(res);
  },

  async getMeta() {
    const res = await apiFetch<import("@/lib/server/finance/meta-builder").FinanceMetaPayload>(
      v1ApiPaths.finance.meta,
    );
    return unwrapApiResponse(res);
  },

  async recordPayment(payload: {
    receivableId: string;
    amountCents: number;
    paidAt: string;
    method: string;
  }) {
    const res = await apiFetch<{
      paymentId: string;
      receivable: AccountReceivableApiDTO;
    }>(v1ApiPaths.finance.payments, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return unwrapApiResponse(res);
  },

  async createReceivable(payload: {
    clientId: string;
    amountCents: number;
    dueDate: string;
    serviceLabel: string;
    paymentMethod?: string;
    scheduleEventId?: string;
  }) {
    const res = await apiFetch<AccountReceivableApiDTO>(
      v1ApiPaths.finance.receivables,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    return unwrapApiResponse(res);
  },

  async getDreAccountEntries(
    accountId: string,
    filter: DrePeriodFilter,
  ): Promise<import("@/lib/admin-dre-mocks").DreAccountEntry[]> {
    const params = new URLSearchParams({ accountId, key: filter.key });
    if (filter.customStart) params.set("customStart", filter.customStart);
    if (filter.customEnd) params.set("customEnd", filter.customEnd);
    const res = await apiFetch<import("@/lib/admin-dre-mocks").DreAccountEntry[]>(
      `${v1ApiPaths.finance.dreEntries}?${params.toString()}`,
    );
    return unwrapApiResponse(res);
  },
};
