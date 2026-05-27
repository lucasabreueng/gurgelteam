import * as kartsMocks from "@/lib/admin-karts-mocks";

export const KartsRepositoryMock = {
  getStatusLabels: () => kartsMocks.KART_STATUS_LABELS,
  getFilterCategories: () => kartsMocks.KART_FILTER_CATEGORIES,
  getFilterStatuses: () => kartsMocks.KART_FILTER_STATUSES,
  getMaintenanceWindows: () => kartsMocks.KART_MAINTENANCE_WINDOWS,
  getOwnershipTypeOptions: () => kartsMocks.KART_OWNERSHIP_TYPE_OPTIONS,
  getRegisteredMotors: () => kartsMocks.REGISTERED_MOTORS,
  getKpis: () => kartsMocks.KARTS_KPIS,
  getTablePageSizes: () => kartsMocks.KARTS_TABLE_PAGE_SIZES,
  getFleet: () => kartsMocks.FLEET_KARTS,
  getFleetAlerts: () => kartsMocks.FLEET_ALERTS,
  getPadlockBoxes: () => kartsMocks.PADLOCK_BOXES,
  getDetail: kartsMocks.getKartDetail,
  filterByTab: kartsMocks.filterKartsByTab,
};
