import { PartsRepositoryMock } from "@/repositories/parts/PartsRepositoryMock";

export const PartsServiceMock = {
  getUsageTypeOptions: () => PartsRepositoryMock.getUsageTypeOptions(),
  getPartUnitOptions: () => PartsRepositoryMock.getPartUnitOptions(),
  getCatalog: () => PartsRepositoryMock.getCatalog(),
  getSmartSuggestions: () => PartsRepositoryMock.getSmartSuggestions(),
  getDefaultQuickHistory: () => PartsRepositoryMock.getDefaultQuickHistory(),
  getDefaultRegisterPartOs: () => PartsRepositoryMock.getDefaultRegisterPartOs(),
  orderToRegisterContext: PartsRepositoryMock.orderToRegisterContext,
  searchCatalog: PartsRepositoryMock.searchCatalog,
  getStockAlert: PartsRepositoryMock.getStockAlert,
  formatCurrency: PartsRepositoryMock.formatCurrency,
  mockBarcodeLookup: PartsRepositoryMock.mockBarcodeLookup,
};
