"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useClientsRankings() {
  return useQuery({
    queryKey: [...queryKeys.clients.all, "rankings"] as const,
    queryFn: () => getAppServices().clients.getEvolutionRankings(),
  });
}
