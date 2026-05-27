"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useCashFlowKpis() {
  return useQuery({
    queryKey: queryKeys.cashFlow.kpis(),
    queryFn: () => getAppServices().cashFlow.getKpis(),
  });
}
