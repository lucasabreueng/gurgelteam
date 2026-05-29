"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useMaintenanceOrders() {
  return useQuery({
    queryKey: queryKeys.maintenance.orders(),
    queryFn: () => getAppServices().maintenance.getOrders(),
  });
}

export function useMaintenanceKpis() {
  return useQuery({
    queryKey: queryKeys.maintenance.kpis(),
    queryFn: () => getAppServices().maintenance.getKpis(),
  });
}

export function useMaintenanceSimplePage() {
  return useQuery({
    queryKey: [...queryKeys.maintenance.all, "simple-page"] as const,
    queryFn: () => {
      const m = getAppServices().maintenance;
      return {
        kpis: m.getSimpleKpis(),
        fleet: m.getSimpleFleet(),
        activity: m.getRecentActivity(),
        responsibles: m.getResponsibles(),
        filterOptions: m.getSimpleFilterOptions(),
        inspections: m.getInspectionsList(),
        maintenances: m.getMaintenancesList(),
        checklistHistory: m.getChecklistHistory(),
        pageTabs: m.getMaintenancePageTabs(),
      };
    },
  });
}
