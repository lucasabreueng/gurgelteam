import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";

import { v1ApiPaths } from "@/lib/api/v1-api-paths";

import type {

  InventoryPartApiDTO,

  SupplierApiDTO,

} from "@/lib/contracts/api/v1/inventory.api.schemas";

import type { InventoryKpi, InventoryHistoryEvent, PurchaseOrder } from "@/lib/contracts/inventory";

import { buildInventoryKpisFromStats } from "@/lib/inventory/build-inventory-kpis";

import type { StockMovementApiDTO } from "@/lib/server/inventory/map-inventory";



type InventoryStats = {
  totalParts: number;
  lowStock: number;
  critical: number;
  totalValueCents: number;
  formattedTotalValue: string;
  usedToday?: number;
  pendingPurchases?: number;
  lastMovementLabel?: string;
};



export type CreatePartPayload = {

  name: string;

  category: string;

  stockQty: number;

  minStockQty: number;

  unitCostCents: number;

  supplierId: string;

  code?: string;

};



export type UpdatePartPayload = Partial<CreatePartPayload>;



export type CreateSupplierPayload = {
  code?: string;
  name: string;
  cnpj?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  status?: SupplierApiDTO["status"];
  avgLeadDays?: number | null;
};



export type UpdateSupplierPayload = Partial<

  Omit<SupplierApiDTO, "id" | "code">

>;



export const InventoryRepositoryHttp = {

  async listParts(): Promise<InventoryPartApiDTO[]> {

    const res = await apiFetch<InventoryPartApiDTO[]>(v1ApiPaths.inventory.parts);

    return unwrapApiResponse(res);

  },



  async getPartById(partId: string): Promise<InventoryPartApiDTO> {

    const res = await apiFetch<InventoryPartApiDTO>(

      v1ApiPaths.inventory.partById(partId),

    );

    return unwrapApiResponse(res);

  },



  async createPart(payload: CreatePartPayload): Promise<InventoryPartApiDTO> {

    const res = await apiFetch<InventoryPartApiDTO>(v1ApiPaths.inventory.parts, {

      method: "POST",

      body: JSON.stringify(payload),

    });

    return unwrapApiResponse(res);

  },



  async updatePart(

    partId: string,

    payload: UpdatePartPayload,

  ): Promise<InventoryPartApiDTO> {

    const res = await apiFetch<InventoryPartApiDTO>(

      v1ApiPaths.inventory.partById(partId),

      { method: "PATCH", body: JSON.stringify(payload) },

    );

    return unwrapApiResponse(res);

  },



  async deletePart(partId: string): Promise<void> {

    const res = await apiFetch<{ ok: boolean }>(

      v1ApiPaths.inventory.partById(partId),

      { method: "DELETE" },

    );

    unwrapApiResponse(res);

  },



  async listSuppliers(): Promise<SupplierApiDTO[]> {

    const res = await apiFetch<SupplierApiDTO[]>(

      v1ApiPaths.inventory.suppliers,

    );

    return unwrapApiResponse(res);

  },



  async getSupplierById(supplierId: string): Promise<SupplierApiDTO> {

    const res = await apiFetch<SupplierApiDTO>(

      v1ApiPaths.inventory.supplierById(supplierId),

    );

    return unwrapApiResponse(res);

  },



  async createSupplier(

    payload: CreateSupplierPayload,

  ): Promise<SupplierApiDTO> {

    const res = await apiFetch<SupplierApiDTO>(v1ApiPaths.inventory.suppliers, {

      method: "POST",

      body: JSON.stringify(payload),

    });

    return unwrapApiResponse(res);

  },



  async updateSupplier(

    supplierId: string,

    payload: UpdateSupplierPayload,

  ): Promise<SupplierApiDTO> {

    const res = await apiFetch<SupplierApiDTO>(

      v1ApiPaths.inventory.supplierById(supplierId),

      { method: "PATCH", body: JSON.stringify(payload) },

    );

    return unwrapApiResponse(res);

  },



  async deleteSupplier(supplierId: string): Promise<void> {

    const res = await apiFetch<{ ok: boolean }>(

      v1ApiPaths.inventory.supplierById(supplierId),

      { method: "DELETE" },

    );

    unwrapApiResponse(res);

  },



  async listMovements(): Promise<StockMovementApiDTO[]> {

    const res = await apiFetch<StockMovementApiDTO[]>(

      v1ApiPaths.inventory.movements,

    );

    return unwrapApiResponse(res);

  },



  async getStats(): Promise<InventoryStats> {

    const res = await apiFetch<InventoryStats>(v1ApiPaths.inventory.stats);

    return unwrapApiResponse(res);

  },



  async getKpis(): Promise<InventoryKpi[]> {
    const stats = await InventoryRepositoryHttp.getStats();
    return buildInventoryKpisFromStats(stats);
  },

  async createMovement(payload: {
    inventoryPartId: string;
    type: "entrada" | "saida" | "ajuste" | "perda" | "devolucao";
    qty: number;
    notes?: string;
  }): Promise<StockMovementApiDTO> {
    const res = await apiFetch<StockMovementApiDTO>(v1ApiPaths.inventory.movements, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return unwrapApiResponse(res);
  },

  async listPurchaseOrders(): Promise<PurchaseOrder[]> {
    const res = await apiFetch<PurchaseOrder[]>(v1ApiPaths.inventory.purchaseOrders);
    return unwrapApiResponse(res);
  },

  async createPurchaseOrder(payload: {
    supplierId: string;
    inventoryPartId: string;
    qty: number;
    unitCostCents?: number;
  }) {
    const res = await apiFetch<unknown>(v1ApiPaths.inventory.purchaseOrders, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return unwrapApiResponse(res);
  },

  async listHistory(): Promise<InventoryHistoryEvent[]> {
    const res = await apiFetch<InventoryHistoryEvent[]>(v1ApiPaths.inventory.history);
    return unwrapApiResponse(res);
  },

  async getCharts() {
    const res = await apiFetch<{
      weeklyConsumption: { day: string; value: number }[];
      monthlyMovements: { month: string; entrada: number; saida: number }[];
      consumptionByCategory: { category: string; value: number }[];
      topUsedParts: { name: string; count: number }[];
      costByCategory: { category: string; value: number }[];
    }>(v1ApiPaths.inventory.charts);
    return unwrapApiResponse(res);
  },
};

