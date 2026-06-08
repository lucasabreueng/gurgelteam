"use client";

import { useQuery } from "@tanstack/react-query";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { getAppServices } from "@/lib/data-source/app-services";

export const telemetrySessionsQueryKey = ["telemetry", "sessions"] as const;

export function useTelemetrySessionsList() {
  const http = getDataSourceMode() === "http";

  return useQuery({
    queryKey: telemetrySessionsQueryKey,
    enabled: http,
    queryFn: () => getAppServices().telemetry.listSessions(),
  });
}
