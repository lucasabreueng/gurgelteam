import * as maintenanceMocks from "@/lib/admin-maintenance-mocks";
import * as simpleMocks from "@/lib/admin-maintenance-simple-mocks";
import { COMPLETE_CHECKLIST_TEMPLATE } from "@/lib/contracts/maintenance/complete-checklist";
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
  getSimpleKpis: () => simpleMocks.MAINTENANCE_SIMPLE_KPIS,
  getSimpleFleet: () => simpleMocks.MAINTENANCE_SIMPLE_FLEET,
  getRecentActivity: () => simpleMocks.MAINTENANCE_RECENT_ACTIVITY,
  getResponsibles: () => simpleMocks.MAINTENANCE_RESPONSIBLES,
  getSimpleFilterOptions: () => ({
    kartStatus: simpleMocks.MAINTENANCE_FILTER_KART_STATUS,
    types: simpleMocks.MAINTENANCE_FILTER_TYPES,
    periods: simpleMocks.MAINTENANCE_FILTER_PERIODS,
  }),
  getKartHistory: simpleMocks.getKartHistory,
  getKartById: simpleMocks.getMaintenanceKartById,
  formatCurrency: simpleMocks.formatMaintenanceCurrency,
  filterFleet: simpleMocks.filterMaintenanceFleet,
  filterInspectionsList: simpleMocks.filterInspectionsList,
  filterMaintenancesList: simpleMocks.filterMaintenancesList,
  filterChecklistsList: simpleMocks.filterChecklistsList,
  getMaintenancePageTabs: simpleMocks.getMaintenancePageTabs,
  getInspectionsList: simpleMocks.getInspectionsList,
  getMaintenancesList: simpleMocks.getMaintenancesList,
  getChecklistHistory: simpleMocks.getChecklistHistory,
  getChecklistRecordById: simpleMocks.getChecklistRecordById,
  getKartTechnicalTimeline: simpleMocks.getKartTechnicalTimeline,
  getCompleteChecklistTemplate: () => COMPLETE_CHECKLIST_TEMPLATE,
};

export type { MaintenanceOrderListItem, MaintenanceTabKey };
