"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useFinanceInsights() {
  return useQuery({
    queryKey: [...queryKeys.finance.all, "insights"] as const,
    queryFn: () => getAppServices().finance.getInsights(),
    staleTime: 60_000,
  });
}
