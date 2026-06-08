"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useChecklistContext() {
  return useQuery({
    queryKey: [...queryKeys.maintenance.all, "checklist-context"] as const,
    queryFn: async () => {
      const checklist = getAppServices().checklist;
      const [smartAlerts, history] = await Promise.all([
        checklist.getSmartAlerts(),
        checklist.getHistory(),
      ]);
      return { smartAlerts, history };
    },
  });
}
