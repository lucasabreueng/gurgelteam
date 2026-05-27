"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useMaintenanceOrders() {
  return useQuery({
    queryKey: queryKeys.maintenance.orders(),
    queryFn: () => getAppServices().maintenance.getOrders(),
  });
}

export function useMaintenanceKpis() {
  return useQuery({
    queryKey: queryKeys.maintenance.kpis(),
    queryFn: () => getAppServices().maintenance.getKpis(),
  });
}
