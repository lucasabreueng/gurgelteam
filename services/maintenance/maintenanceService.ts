import { getDataSourceMode } from "@/lib/data-source/mode";
import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type { MaintenanceFleetKart } from "@/lib/contracts/maintenance/simple";
import type {
  MaintenanceOrderListItem,
  MaintenanceTabKey,
} from "@/lib/contracts/maintenance";
import {
  mapInspectionToChecklistHistoryRow,
  mapInspectionToSimpleRow,
  type MaintenanceInspectionApiRow,
} from "@/services/maintenance/map-inspection-api";
import { COMPLETE_CHECKLIST_TYPE_LABELS } from "@/lib/contracts/maintenance/complete-checklist";
import { InspectionRepositoryHttp } from "@/repositories/maintenance/InspectionRepositoryHttp";
import { MaintenanceRepositoryHttp } from "@/repositories/maintenance/MaintenanceRepositoryHttp";
import { MaintenanceRepositoryMock } from "@/repositories/maintenance/MaintenanceRepositoryMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

async function fetchHttpMaintenanceFleet(): Promise<MaintenanceFleetKart[]> {
  const res = await apiFetch<MaintenanceFleetKart[]>(v1ApiPaths.maintenance.fleet);
  return unwrapApiResponse(res);
}

export function createMaintenanceService() {
  return {
    getKpis: () =>
      isHttpMode()
        ? MaintenanceRepositoryHttp.getSimpleKpis()
        : Promise.resolve(MaintenanceRepositoryMock.getKpis()),
    getOrders: () =>
      isHttpMode()
        ? MaintenanceRepositoryHttp.listOrderListItems()
        : Promise.resolve(MaintenanceRepositoryMock.getOrders()),
    getAlerts: () => MaintenanceRepositoryMock.getAlerts(),
    getPageMetrics: () => MaintenanceRepositoryMock.getPageMetrics(),
    getTablePageSizes: () => MaintenanceRepositoryMock.getTablePageSizes(),
    getFilterPriorities: () => MaintenanceRepositoryMock.getFilterPriorities(),
    getFilterStatuses: () => MaintenanceRepositoryMock.getFilterStatuses(),
    getFilterTypes: () => MaintenanceRepositoryMock.getFilterTypes(),
    getMechanics: () => MaintenanceRepositoryMock.getMechanics(),
    getKartCategories: () => MaintenanceRepositoryMock.getKartCategories(),
    getStatusLabels: () => MaintenanceRepositoryMock.getStatusLabels(),
    getPriorityLabels: () => MaintenanceRepositoryMock.getPriorityLabels(),
    getTypeLabels: () => MaintenanceRepositoryMock.getTypeLabels(),
    getFlowStatuses: () => MaintenanceRepositoryMock.getFlowStatuses(),
    getHistoryLines: () => MaintenanceRepositoryMock.getHistoryLines(),
    getDetail: (orderId: string) =>
      isHttpMode()
        ? MaintenanceRepositoryHttp.getOrderDetail(orderId)
        : Promise.resolve(MaintenanceRepositoryMock.getDetail(orderId)),
    createOrder: (payload: {
      kartId: string;
      title: string;
      description?: string;
      assignedTo?: string;
    }) =>
      isHttpMode()
        ? MaintenanceRepositoryHttp.createOrder(payload)
        : Promise.resolve(null),
    filterOrdersByTab: (
      orders: MaintenanceOrderListItem[],
      tab: MaintenanceTabKey,
    ) => MaintenanceRepositoryMock.filterOrdersByTab(orders, tab),
    getSimpleKpis: () =>
      isHttpMode()
        ? MaintenanceRepositoryHttp.getSimpleKpis()
        : Promise.resolve(MaintenanceRepositoryMock.getSimpleKpis()),
    getSimpleFleet: () =>
      isHttpMode()
        ? fetchHttpMaintenanceFleet()
        : Promise.resolve(MaintenanceRepositoryMock.getSimpleFleet()),
    getRecentActivity: () => MaintenanceRepositoryMock.getRecentActivity(),
    getResponsibles: () => MaintenanceRepositoryMock.getResponsibles(),
    getSimpleFilterOptions: () =>
      MaintenanceRepositoryMock.getSimpleFilterOptions(),
    getKartHistory: MaintenanceRepositoryMock.getKartHistory,
    getKartById: (kartId: string) =>
      isHttpMode()
        ? MaintenanceRepositoryHttp.getKartById(kartId)
        : Promise.resolve(MaintenanceRepositoryMock.getKartById(kartId)),
    formatCurrency: MaintenanceRepositoryMock.formatCurrency,
    filterFleet: MaintenanceRepositoryMock.filterFleet,
    filterInspectionsList: MaintenanceRepositoryMock.filterInspectionsList,
    filterMaintenancesList: MaintenanceRepositoryMock.filterMaintenancesList,
    filterChecklistsList: MaintenanceRepositoryMock.filterChecklistsList,
    getMaintenancePageTabs: MaintenanceRepositoryMock.getMaintenancePageTabs,
    getInspectionsList: async () => {
      if (!isHttpMode()) {
        return MaintenanceRepositoryMock.getInspectionsList();
      }
      const rows = (await InspectionRepositoryHttp.list()) as MaintenanceInspectionApiRow[];
      const completeTypes = new Set(Object.keys(COMPLETE_CHECKLIST_TYPE_LABELS));
      return rows
        .filter((r) => r.checklistType === "simple" || !completeTypes.has(r.checklistType))
        .map(mapInspectionToSimpleRow);
    },
    getMaintenancesList: () =>
      isHttpMode()
        ? MaintenanceRepositoryHttp.getMaintenancesList()
        : Promise.resolve(MaintenanceRepositoryMock.getMaintenancesList()),
    getChecklistHistory: async () => {
      if (!isHttpMode()) {
        return MaintenanceRepositoryMock.getChecklistHistory();
      }
      const rows = (await InspectionRepositoryHttp.list()) as MaintenanceInspectionApiRow[];
      return rows
        .map(mapInspectionToChecklistHistoryRow)
        .filter((r): r is NonNullable<typeof r> => r !== null);
    },
    getChecklistRecordById: MaintenanceRepositoryMock.getChecklistRecordById,
    getKartTechnicalTimeline: (kartId: string) =>
      isHttpMode()
        ? MaintenanceRepositoryHttp.getKartTechnicalTimeline(kartId)
        : Promise.resolve(
            MaintenanceRepositoryMock.getKartTechnicalTimeline(kartId),
          ),
    getCompleteChecklistTemplate: MaintenanceRepositoryMock.getCompleteChecklistTemplate,
  };
}

export type MaintenanceService = ReturnType<typeof createMaintenanceService>;
export const MaintenanceServiceMock = createMaintenanceService();
