"use client";

import { useQuery } from "@tanstack/react-query";
import type { CashFlowPeriodFilter } from "@/lib/contracts/cashflow";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useCashFlowDataset(filter: CashFlowPeriodFilter) {
  return useQuery({
    queryKey: queryKeys.cashFlow.dataset(filter),
    queryFn: () => getAppServices().cashFlow.getCashFlowDataset(filter),
  });
}

/** @deprecated Use useCashFlowDataset */
export function useCashFlowKpis() {
  return useQuery({
    queryKey: queryKeys.cashFlow.kpis(),
    queryFn: () =>
      getAppServices().cashFlow.getCashFlowDataset({ key: "current-month" }).summaryKpis,
  });
}
