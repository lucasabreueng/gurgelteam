import { getDataSourceMode } from "@/lib/data-source/mode";
import type { InventoryPart, InventorySupplier } from "@/lib/admin-inventory-mocks";
import {
  mapPartApiToUi,
  mapSupplierApiToUi,
} from "@/lib/inventory/map-api-to-ui";
import { InventoryCatalogRepositoryMock } from "@/repositories/inventory/InventoryCatalogRepositoryMock";
import { InventoryPartsRepositoryMock } from "@/repositories/inventory/inventoryPartsRepositoryMock";
import { InventorySuppliersRepositoryMock } from "@/repositories/inventory/inventorySuppliersRepositoryMock";
import { InventoryRepositoryHttp } from "@/repositories/inventory/InventoryRepositoryHttp";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

export function createInventoryService() {
  return {
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
    getKpis: () =>
      isHttpMode()
        ? InventoryRepositoryHttp.getKpis()
        : Promise.resolve(InventoryCatalogRepositoryMock.getKpis()),
    listParts: () =>
      isHttpMode()
        ? InventoryRepositoryHttp.listParts().then((rows) => rows.map(mapPartApiToUi))
        : Promise.resolve(InventoryPartsRepositoryMock.getAll()),
    getPartById: (id: string) =>
      isHttpMode()
        ? InventoryRepositoryHttp.getPartById(id).then((row) =>
            row ? mapPartApiToUi(row) : null,
          )
        : Promise.resolve(
            InventoryPartsRepositoryMock.getAll().find((p) => p.id === id) ?? null,
          ),
    savePart: (
      input: {
        id?: string;
        name: string;
        category: string;
        stock: number;
        minStock: number;
        unitCost: number;
        supplierId?: string;
      },
    ) => {
      const payload = {
        name: input.name,
        category: input.category,
        stockQty: input.stock,
        minStockQty: input.minStock,
        unitCostCents: Math.round(input.unitCost * 100),
        supplierId: input.supplierId ?? "",
      };
      if (isHttpMode()) {
        return input.id
          ? InventoryRepositoryHttp.updatePart(input.id, payload).then(mapPartApiToUi)
          : InventoryRepositoryHttp.createPart(payload).then(mapPartApiToUi);
      }
      return Promise.resolve(null as InventoryPart | null);
    },
    deletePart: (id: string) =>
      isHttpMode()
        ? InventoryRepositoryHttp.deletePart(id)
        : Promise.resolve(),
    listSuppliers: () =>
      isHttpMode()
        ? InventoryRepositoryHttp.listSuppliers().then((rows) =>
            rows.map(mapSupplierApiToUi),
          )
        : Promise.resolve(InventorySuppliersRepositoryMock.getAll()),
    getSupplierById: (id: string) =>
      isHttpMode()
        ? InventoryRepositoryHttp.getSupplierById(id).then((row) =>
            row ? mapSupplierApiToUi(row) : null,
          )
        : Promise.resolve(
            InventorySuppliersRepositoryMock.getAll().find((s) => s.id === id) ??
              null,
          ),
    saveSupplier: (
      input: {
        id?: string;
        name: string;
        cnpj?: string;
        city?: string;
        phone?: string;
        email?: string;
        status?: string;
        avgLeadDays?: number;
      },
    ) => {
      const payload = {
        name: input.name,
        cnpj: input.cnpj ?? null,
        city: input.city ?? null,
        phone: input.phone ?? null,
        email: input.email ?? null,
        status: (input.status ?? "ativo") as "ativo" | "atrasado" | "inativo",
        avgLeadDays: input.avgLeadDays ?? null,
      };
      if (isHttpMode()) {
        return input.id
          ? InventoryRepositoryHttp.updateSupplier(input.id, payload).then(
              mapSupplierApiToUi,
            )
          : InventoryRepositoryHttp.createSupplier(payload).then(mapSupplierApiToUi);
      }
      return Promise.resolve(null as InventorySupplier | null);
    },
    deleteSupplier: (id: string) =>
      isHttpMode()
        ? InventoryRepositoryHttp.deleteSupplier(id)
        : Promise.resolve(),
    getMovements: () =>
      isHttpMode()
        ? InventoryRepositoryHttp.listMovements()
        : Promise.resolve(
            InventoryCatalogRepositoryMock.getMovements() as unknown as Awaited<
              ReturnType<typeof InventoryRepositoryHttp.listMovements>
            >,
          ),
    createMovement: (payload: {
      inventoryPartId: string;
      type: "entrada" | "saida";
      qty: number;
      notes?: string;
    }) =>
      isHttpMode()
        ? InventoryRepositoryHttp.createMovement({
            inventoryPartId: payload.inventoryPartId,
            type: payload.type,
            qty: payload.qty,
            notes: payload.notes,
          })
        : Promise.resolve(null),
    getPurchaseOrders: () =>
      isHttpMode()
        ? InventoryRepositoryHttp.listPurchaseOrders()
        : Promise.resolve(InventoryCatalogRepositoryMock.getPurchaseOrders()),
    createPurchaseOrder: (payload: {
      supplierId: string;
      inventoryPartId: string;
      qty: number;
    }) =>
      isHttpMode()
        ? InventoryRepositoryHttp.createPurchaseOrder(payload)
        : Promise.resolve(null),
    getHistory: () =>
      isHttpMode()
        ? InventoryRepositoryHttp.listHistory()
        : Promise.resolve(InventoryCatalogRepositoryMock.getHistory()),
    getStaticParts: () => InventoryCatalogRepositoryMock.getStaticParts(),
    getMovementTypeLabels: () =>
      InventoryCatalogRepositoryMock.getMovementTypeLabels(),
    getPurchaseStatusLabels: () =>
      InventoryCatalogRepositoryMock.getPurchaseStatusLabels(),
    getCriticalStock: () => InventoryCatalogRepositoryMock.getCriticalStock(),
    getNfReferences: () => InventoryCatalogRepositoryMock.getNfReferences(),
    getStaticSuppliers: () => InventoryCatalogRepositoryMock.getStaticSuppliers(),
    getSupplierStatusLabels: () =>
      InventoryCatalogRepositoryMock.getSupplierStatusLabels(),
    getAlerts: () => InventoryCatalogRepositoryMock.getAlerts(),
    getPartDetail: InventoryCatalogRepositoryMock.getPartDetail,
    getWeeklyConsumption: () =>
      InventoryCatalogRepositoryMock.getWeeklyConsumption(),
    getConsumptionByCategory: () =>
      InventoryCatalogRepositoryMock.getConsumptionByCategory(),
    getTopUsedParts: () => InventoryCatalogRepositoryMock.getTopUsedParts(),
    getMonthlyMovements: () =>
      InventoryCatalogRepositoryMock.getMonthlyMovements(),
    getCostByCategory: () => InventoryCatalogRepositoryMock.getCostByCategory(),
    getCharts: () =>
      isHttpMode()
        ? InventoryRepositoryHttp.getCharts()
        : Promise.resolve({
            weeklyConsumption: InventoryCatalogRepositoryMock.getWeeklyConsumption(),
            monthlyMovements: InventoryCatalogRepositoryMock.getMonthlyMovements(),
            consumptionByCategory:
              InventoryCatalogRepositoryMock.getConsumptionByCategory(),
            topUsedParts: InventoryCatalogRepositoryMock.getTopUsedParts(),
            costByCategory: InventoryCatalogRepositoryMock.getCostByCategory(),
          }),
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
}

export type InventoryService = ReturnType<typeof createInventoryService>;
export const InventoryServiceMock = createInventoryService();
