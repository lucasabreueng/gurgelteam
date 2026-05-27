"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useClientsList() {
  return useQuery({
    queryKey: queryKeys.clients.list(),
    queryFn: () => getAppServices().clients.getList(),
  });
}

export function useClientsKpis() {
  return useQuery({
    queryKey: queryKeys.clients.kpis(),
    queryFn: () => getAppServices().clients.getKpis(),
  });
}
