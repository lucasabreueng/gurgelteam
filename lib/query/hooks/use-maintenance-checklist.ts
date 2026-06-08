"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useChecklistTemplate() {
  return useQuery({
    queryKey: [...queryKeys.maintenance.all, "checklist-template"] as const,
    queryFn: () => getAppServices().checklist.getTemplate(),
    staleTime: 5 * 60_000,
  });
}

export function useOrderChecklist(orderId: string | null) {
  return useQuery({
    queryKey: [...queryKeys.maintenance.all, "order-checklist", orderId] as const,
    queryFn: () => getAppServices().checklist.getOrderChecklist(orderId!),
    enabled: Boolean(orderId),
  });
}
