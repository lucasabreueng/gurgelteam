import * as partsMocks from "@/lib/admin-parts-mocks";

export const PartsRepositoryMock = {
  getUsageTypeOptions: () => partsMocks.USAGE_TYPE_OPTIONS,
  getPartUnitOptions: () => partsMocks.PART_UNIT_OPTIONS,
  getCatalog: () => partsMocks.PARTS_CATALOG,
  getSmartSuggestions: () => partsMocks.SMART_PART_SUGGESTIONS,
  getDefaultQuickHistory: () => partsMocks.DEFAULT_QUICK_PART_HISTORY,
  getDefaultRegisterPartOs: () => partsMocks.DEFAULT_REGISTER_PART_OS,
  orderToRegisterContext: partsMocks.orderToRegisterContext,
  searchCatalog: partsMocks.searchPartsCatalog,
  getStockAlert: partsMocks.getStockAlert,
  formatCurrency: partsMocks.formatCurrency,
  mockBarcodeLookup: partsMocks.mockBarcodeLookup,
};
