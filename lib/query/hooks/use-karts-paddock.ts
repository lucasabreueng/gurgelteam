"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useKartsPaddock() {
  return useQuery({
    queryKey: [...queryKeys.karts.all, "paddock"] as const,
    queryFn: async () => {
      const karts = getAppServices().karts;
      const [alerts, boxes] = await Promise.all([
        karts.getFleetAlerts(),
        karts.getPadlockBoxes(),
      ]);
      return { alerts, boxes };
    },
  });
}
