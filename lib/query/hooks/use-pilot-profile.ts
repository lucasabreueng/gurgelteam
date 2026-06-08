"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function usePilotProfileAccount(demoParam: string | null) {
  return useQuery({
    queryKey: [...queryKeys.student.all, "profile-account", demoParam ?? "live"] as const,
    queryFn: () => getAppServices().studentProfile.fetchProfileAccount(demoParam),
    staleTime: 60_000,
  });
}
