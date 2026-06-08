"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function usePilotHome(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...queryKeys.student.all, "home"] as const,
    queryFn: () => getAppServices().studentArea.getHome(),
    staleTime: 60_000,
    enabled: options?.enabled !== false,
  });
}
