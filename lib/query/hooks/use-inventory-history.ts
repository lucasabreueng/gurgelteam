"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

import type { InventoryHistoryEvent } from "@/lib/contracts/inventory";

export function useInventoryHistory() {
  return useQuery<InventoryHistoryEvent[]>({
    queryKey: [...queryKeys.inventory.all, "history"] as const,
    queryFn: () => getAppServices().inventory.getHistory(),
  });
}
