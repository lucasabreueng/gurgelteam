"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useKartTechnicalTimeline(kartId: string | null) {
  return useQuery({
    queryKey: queryKeys.karts.technicalTimeline(kartId ?? ""),
    queryFn: () =>
      getAppServices().maintenance.getKartTechnicalTimeline(kartId!),
    enabled: Boolean(kartId),
  });
}
