"use client";

import { useQuery } from "@tanstack/react-query";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { getAppServices } from "@/lib/data-source/app-services";
import { normalizeMaintenanceFleet } from "@/lib/maintenance/normalize-fleet-kart";
import { queryKeys } from "@/lib/query/keys";
import { MaintenanceRepositoryHttp } from "@/repositories/maintenance/MaintenanceRepositoryHttp";

export function useMaintenanceOrders() {
  return useQuery({
    queryKey: queryKeys.maintenance.orders(),
    queryFn: async () =>
      getDataSourceMode() === "http"
        ? MaintenanceRepositoryHttp.listOrders()
        : getAppServices().maintenance.getOrders(),
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
    queryKey: [...queryKeys.maintenance.all, "simple-page", "v2"] as const,
    queryFn: async () => {
      const m = getAppServices().maintenance;
      const [
        kpis,
        fleetRaw,
        inspections,
        maintenances,
        checklistHistory,
      ] = await Promise.all([
        m.getSimpleKpis(),
        m.getSimpleFleet(),
        m.getInspectionsList(),
        m.getMaintenancesList(),
        m.getChecklistHistory(),
      ]);

      const fleet = normalizeMaintenanceFleet(fleetRaw);

      return {
        kpis,
        fleet,
        activity: m.getRecentActivity(),
        responsibles: m.getResponsibles(),
        filterOptions: m.getSimpleFilterOptions(),
        inspections,
        maintenances,
        checklistHistory,
        pageTabs: m.getMaintenancePageTabs(),
      };
    },
  });
}
