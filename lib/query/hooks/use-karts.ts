"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useKartsFleet() {
  return useQuery({
    queryKey: queryKeys.karts.fleet(),
    queryFn: () => getAppServices().karts.getFleet(),
  });
}

export function useKartsKpis() {
  return useQuery({
    queryKey: queryKeys.karts.kpis(),
    queryFn: () => getAppServices().karts.getKpis(),
  });
}

/** Frota + KPIs em uma query (bundle HTTP ou hidratação RSC). */
export function useKartsPageData() {
  const query = useQuery({
    queryKey: queryKeys.karts.pageBundle(),
    queryFn: () => getAppServices().karts.getPageBundle(),
  });

  return {
    ...query,
    fleet: query.data?.fleet ?? [],
    kpis: query.data?.kpis ?? [],
    isPageLoading: query.isPending && !query.data,
  };
}

export function useKartDetail(kartId: string | null) {
  return useQuery({
    queryKey: queryKeys.karts.detail(kartId ?? ""),
    queryFn: () =>
      Promise.resolve(getAppServices().karts.getDetail(kartId!)),
    enabled: Boolean(kartId),
  });
}
