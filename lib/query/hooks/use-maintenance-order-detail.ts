"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useMaintenanceOrderDetail(orderId: string | null) {
  return useQuery({
    queryKey: [...queryKeys.maintenance.all, "order-detail", orderId] as const,
    queryFn: () => getAppServices().maintenance.getDetail(orderId!),
    enabled: Boolean(orderId),
  });
}
