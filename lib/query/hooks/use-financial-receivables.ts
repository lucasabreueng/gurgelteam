"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReceivableQueryDTO } from "@/lib/contracts/finance/finance.types";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useFinancialReceivables(filters: ReceivableQueryDTO) {
  return useQuery({
    queryKey: queryKeys.finance.receivables(filters),
    queryFn: () => getAppServices().finance.listReceivables(filters),
  });
}

export function useFinancialReceivablesKpis() {
  return useQuery({
    queryKey: queryKeys.finance.receivablesKpis(),
    queryFn: () => getAppServices().finance.getReceivablesKpis(),
  });
}
