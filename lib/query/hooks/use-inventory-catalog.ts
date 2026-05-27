"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useInventoryKpis() {
  return useQuery({
    queryKey: queryKeys.inventory.kpis(),
    queryFn: () => getAppServices().inventory.getKpis(),
  });
}

export function useInventoryMovements() {
  return useQuery({
    queryKey: queryKeys.inventory.movements(),
    queryFn: () => getAppServices().inventory.getMovements(),
  });
}
