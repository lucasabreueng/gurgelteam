import { InventoryCatalogRepositoryMock } from "@/repositories/inventory/InventoryCatalogRepositoryMock";
import { InventoryPartsRepositoryMock } from "@/repositories/inventory/inventoryPartsRepositoryMock";
import { InventorySuppliersRepositoryMock } from "@/repositories/inventory/inventorySuppliersRepositoryMock";

export const InventoryServiceMock = {
  subscribeInventoryParts: InventoryPartsRepositoryMock.subscribe,
  getInventoryParts: InventoryPartsRepositoryMock.getAll,
  subscribeInventorySuppliers: InventorySuppliersRepositoryMock.subscribe,
  getInventorySuppliers: InventorySuppliersRepositoryMock.getAll,

  getTabs: () => InventoryCatalogRepositoryMock.getTabs(),
  getTabMeta: () => InventoryCatalogRepositoryMock.getTabMeta(),
  getTablePageSizes: () => InventoryCatalogRepositoryMock.getTablePageSizes(),
  getStockHealthFilterOptions: () =>
    InventoryCatalogRepositoryMock.getStockHealthFilterOptions(),
  getCategories: () => InventoryCatalogRepositoryMock.getCategories(),
  getKpis: () => InventoryCatalogRepositoryMock.getKpis(),
  getStaticParts: () => InventoryCatalogRepositoryMock.getStaticParts(),
  getMovements: () => InventoryCatalogRepositoryMock.getMovements(),
  getMovementTypeLabels: () => InventoryCatalogRepositoryMock.getMovementTypeLabels(),
  getPurchaseOrders: () => InventoryCatalogRepositoryMock.getPurchaseOrders(),
  getPurchaseStatusLabels: () =>
    InventoryCatalogRepositoryMock.getPurchaseStatusLabels(),
  getCriticalStock: () => InventoryCatalogRepositoryMock.getCriticalStock(),
  getNfReferences: () => InventoryCatalogRepositoryMock.getNfReferences(),
  getStaticSuppliers: () => InventoryCatalogRepositoryMock.getStaticSuppliers(),
  getSupplierStatusLabels: () =>
    InventoryCatalogRepositoryMock.getSupplierStatusLabels(),
  getAlerts: () => InventoryCatalogRepositoryMock.getAlerts(),
  getHistory: () => InventoryCatalogRepositoryMock.getHistory(),
  getPartDetail: InventoryCatalogRepositoryMock.getPartDetail,
  getWeeklyConsumption: () => InventoryCatalogRepositoryMock.getWeeklyConsumption(),
  getConsumptionByCategory: () =>
    InventoryCatalogRepositoryMock.getConsumptionByCategory(),
  getTopUsedParts: () => InventoryCatalogRepositoryMock.getTopUsedParts(),
  getMonthlyMovements: () => InventoryCatalogRepositoryMock.getMonthlyMovements(),
  getCostByCategory: () => InventoryCatalogRepositoryMock.getCostByCategory(),
  getFinancialIntegration: () =>
    InventoryCatalogRepositoryMock.getFinancialIntegration(),
  getSupplierNames: () => InventoryCatalogRepositoryMock.getSupplierNames(),
  getLocations: () => InventoryCatalogRepositoryMock.getLocations(),
  filterPartsList: InventoryCatalogRepositoryMock.filterPartsList,
  filterParts: InventoryCatalogRepositoryMock.filterParts,
  filterSuppliersList: InventoryCatalogRepositoryMock.filterSuppliersList,
  filterSuppliers: InventoryCatalogRepositoryMock.filterSuppliers,
  formatInventoryDate: InventoryCatalogRepositoryMock.formatInventoryDate,
  formatCurrency: InventoryCatalogRepositoryMock.formatCurrency,
};
