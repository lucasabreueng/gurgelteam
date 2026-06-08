"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

import type { PurchaseOrder } from "@/lib/contracts/inventory";

export function useInventoryPurchaseOrders() {
  return useQuery<PurchaseOrder[]>({
    queryKey: [...queryKeys.inventory.all, "purchase-orders"] as const,
    queryFn: () => getAppServices().inventory.getPurchaseOrders(),
  });
}
