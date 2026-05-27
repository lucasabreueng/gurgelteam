import { KartsRepositoryMock } from "@/repositories/karts/KartsRepositoryMock";

export const KartsServiceMock = {
  getStatusLabels: () => KartsRepositoryMock.getStatusLabels(),
  getFilterCategories: () => KartsRepositoryMock.getFilterCategories(),
  getFilterStatuses: () => KartsRepositoryMock.getFilterStatuses(),
  getMaintenanceWindows: () => KartsRepositoryMock.getMaintenanceWindows(),
  getOwnershipTypeOptions: () => KartsRepositoryMock.getOwnershipTypeOptions(),
  getRegisteredMotors: () => KartsRepositoryMock.getRegisteredMotors(),
  getKpis: () => KartsRepositoryMock.getKpis(),
  getTablePageSizes: () => KartsRepositoryMock.getTablePageSizes(),
  getFleet: () => KartsRepositoryMock.getFleet(),
  getFleetAlerts: () => KartsRepositoryMock.getFleetAlerts(),
  getPadlockBoxes: () => KartsRepositoryMock.getPadlockBoxes(),
  getDetail: KartsRepositoryMock.getDetail,
  filterByTab: KartsRepositoryMock.filterByTab,
};
