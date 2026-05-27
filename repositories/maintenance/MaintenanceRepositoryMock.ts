import * as maintenanceMocks from "@/lib/admin-maintenance-mocks";
import type {
  MaintenanceOrderListItem,
  MaintenanceTabKey,
} from "@/lib/contracts/maintenance";

export const MaintenanceRepositoryMock = {
  getKpis: () => maintenanceMocks.MAINTENANCE_KPIS,
  getOrders: () => maintenanceMocks.MAINTENANCE_ORDERS,
  getAlerts: () => maintenanceMocks.MAINTENANCE_ALERTS,
  getPageMetrics: () => maintenanceMocks.MAINTENANCE_PAGE_METRICS,
  getTablePageSizes: () => maintenanceMocks.MAINTENANCE_TABLE_PAGE_SIZES,
  getFilterPriorities: () => maintenanceMocks.MAINTENANCE_FILTER_PRIORITIES,
  getFilterStatuses: () => maintenanceMocks.MAINTENANCE_FILTER_STATUSES,
  getFilterTypes: () => maintenanceMocks.MAINTENANCE_FILTER_TYPES,
  getMechanics: () => maintenanceMocks.MAINTENANCE_MECHANICS,
  getKartCategories: () => maintenanceMocks.MAINTENANCE_KART_CATEGORIES,
  getStatusLabels: () => maintenanceMocks.MAINTENANCE_STATUS_LABELS,
  getPriorityLabels: () => maintenanceMocks.MAINTENANCE_PRIORITY_LABELS,
  getTypeLabels: () => maintenanceMocks.MAINTENANCE_TYPE_LABELS,
  getFlowStatuses: () => maintenanceMocks.FLOW_STATUSES,
  getHistoryLines: () => maintenanceMocks.MAINTENANCE_HISTORY_LINES,
  getDetail: maintenanceMocks.getMaintenanceDetail,
  filterOrdersByTab: maintenanceMocks.filterOrdersByTab,
};

export type { MaintenanceOrderListItem, MaintenanceTabKey };
