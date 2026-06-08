import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type { CashFlowDataset, CashFlowPeriodFilter } from "@/lib/admin-cash-flow-mocks";

function buildCashFlowUrl(filter: CashFlowPeriodFilter): string {
  const params = new URLSearchParams({ key: filter.key });
  if (filter.customStart) params.set("customStart", filter.customStart);
  if (filter.customEnd) params.set("customEnd", filter.customEnd);
  return `${v1ApiPaths.finance.cashFlow}?${params.toString()}`;
}

export const CashFlowRepositoryHttp = {
  async getCashFlowDataset(
    filter: CashFlowPeriodFilter,
  ): Promise<CashFlowDataset> {
    const res = await apiFetch<CashFlowDataset>(buildCashFlowUrl(filter));
    return unwrapApiResponse(res);
  },
};
