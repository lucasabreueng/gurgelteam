"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useDashboardKpis() {
  return useQuery({
    queryKey: queryKeys.dashboard.kpis(),
    queryFn: () => getAppServices().dashboard.getDashboardKpis(),
  });
}

export function useOperationalAgenda() {
  return useQuery({
    queryKey: queryKeys.dashboard.agenda(),
    queryFn: () => getAppServices().dashboard.getOperationalAgenda(),
  });
}
