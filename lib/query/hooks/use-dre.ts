"use client";

import { useQuery } from "@tanstack/react-query";
import type { DrePeriodFilter } from "@/lib/admin-dre-mocks";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useDreDataset(filter: DrePeriodFilter) {
  return useQuery({
    queryKey: [...queryKeys.finance.all, "dre", filter] as const,
    queryFn: () => getAppServices().finance.getDreDataset(filter),
  });
}
