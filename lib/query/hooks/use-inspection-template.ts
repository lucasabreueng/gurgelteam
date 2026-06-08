"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useInspectionTemplate() {
  return useQuery({
    queryKey: [...queryKeys.maintenance.all, "inspection-template"] as const,
    queryFn: () => getAppServices().inspection.getTemplate(),
    staleTime: 5 * 60_000,
  });
}
