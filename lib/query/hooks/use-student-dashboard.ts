"use client";

import { useQuery } from "@tanstack/react-query";
import type { StudentSessionKind } from "@/lib/contracts/student/dashboard-view";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useStudentDashboardView(pilotViewId: string) {
  return useQuery({
    queryKey: queryKeys.student.dashboardView(pilotViewId),
    queryFn: () => getAppServices().studentDashboard.getDashboardViewData(pilotViewId),
    enabled: Boolean(pilotViewId),
  });
}

export function useStudentPilotViewOptions(sessionKind: StudentSessionKind) {
  return useQuery({
    queryKey: [...queryKeys.student.all, "pilot-options", sessionKind] as const,
    queryFn: () => getAppServices().studentDashboard.getPilotViewOptions(sessionKind),
  });
}
