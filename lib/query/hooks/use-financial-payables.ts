"use client";

import { useQuery } from "@tanstack/react-query";
import type { PayableQueryDTO } from "@/lib/contracts/finance/finance.types";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useFinancialPayables(filters: PayableQueryDTO) {
  return useQuery({
    queryKey: queryKeys.finance.payables(filters),
    queryFn: () => getAppServices().finance.listPayables(filters),
  });
}

export function useFinancialPayablesKpis() {
  return useQuery({
    queryKey: queryKeys.finance.payablesKpis(),
    queryFn: () => getAppServices().finance.getPayablesKpis(),
  });
}
