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

export function useKartDetail(kartId: string | null) {
  return useQuery({
    queryKey: queryKeys.karts.detail(kartId ?? ""),
    queryFn: () =>
      Promise.resolve(getAppServices().karts.getDetail(kartId!)),
    enabled: Boolean(kartId),
  });
}
