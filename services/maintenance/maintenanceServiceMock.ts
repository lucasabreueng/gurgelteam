import type {
  MaintenanceOrderListItem,
  MaintenanceTabKey,
} from "@/lib/contracts/maintenance";
import { MaintenanceRepositoryMock } from "@/repositories/maintenance/MaintenanceRepositoryMock";

export const MaintenanceServiceMock = {
  getKpis: () => MaintenanceRepositoryMock.getKpis(),
  getOrders: () => MaintenanceRepositoryMock.getOrders(),
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
  getDetail: MaintenanceRepositoryMock.getDetail,
  filterOrdersByTab: (
    orders: MaintenanceOrderListItem[],
    tab: MaintenanceTabKey,
  ) => MaintenanceRepositoryMock.filterOrdersByTab(orders, tab),
};
