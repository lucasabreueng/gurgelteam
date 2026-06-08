"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useInventoryCharts() {
  return useQuery({
    queryKey: [...queryKeys.inventory.all, "charts"] as const,
    queryFn: () => getAppServices().inventory.getCharts(),
    staleTime: 60_000,
  });
}
