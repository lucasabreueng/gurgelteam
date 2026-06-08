"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function usePilotAchievements(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...queryKeys.student.all, "achievements"] as const,
    queryFn: () => getAppServices().studentArea.getAchievements(),
    enabled: options?.enabled !== false,
  });
}
