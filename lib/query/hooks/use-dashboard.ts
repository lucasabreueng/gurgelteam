"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(),
    queryFn: () => getAppServices().dashboard.getDashboardSummary(),
    retry: false,
  });
}

export function useDashboardKpis() {
  const query = useDashboardSummary();
  return {
    ...query,
    data: query.data?.kpis ?? [],
  };
}

export function useOperationalAgenda() {
  const query = useDashboardSummary();
  return {
    ...query,
    data: query.data?.operationalAgenda ?? [],
  };
}
