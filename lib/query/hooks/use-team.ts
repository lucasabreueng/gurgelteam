"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useTeamList() {
  return useQuery({
    queryKey: queryKeys.team.list(),
    queryFn: () => getAppServices().team.getList(),
  });
}

export function useTeamKpis() {
  return useQuery({
    queryKey: queryKeys.team.kpis(),
    queryFn: () => getAppServices().team.getKpis(),
  });
}
