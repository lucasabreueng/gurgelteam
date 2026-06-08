import type { InventoryPart, StockMovement, Supplier } from "@prisma/client";

import type {
  InventoryPartApiDTO,
  SupplierApiDTO,
} from "@/lib/contracts/api/v1/inventory.api.schemas";
import { isoDateFromDbDate } from "@/lib/server/format-money";

export function mapSupplierToApi(
  row: Supplier,
): SupplierApiDTO {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    cnpj: row.cnpj,
    city: row.city,
    phone: row.phone,
    email: row.email,
    status: row.active ? "ativo" : "inativo",
    avgLeadDays: row.avgLeadDays,
  };
}

export function mapPartToApi(
  row: InventoryPart & { supplier: Pick<Supplier, "name"> },
): InventoryPartApiDTO {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    category: row.category,
    stockQty: row.stockQty,
    minStockQty: row.minStockQty,
    unitCostCents: row.unitCostCents,
    supplierId: row.supplierId,
    supplierName: row.supplier.name,
  };
}

export type StockMovementApiDTO = {
  id: string;
  inventoryPartId: string;
  partCode: string;
  partName: string;
  type: StockMovement["type"];
  qty: number;
  notes: string | null;
  createdAt: string;
};

export function mapMovementToApi(
  row: StockMovement & {
    part: Pick<InventoryPart, "code" | "name">;
  },
): StockMovementApiDTO {
  return {
    id: row.id,
    inventoryPartId: row.inventoryPartId,
    partCode: row.part.code,
    partName: row.part.name,
    type: row.type,
    qty: row.qty,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
  };
}

export function formatInventoryDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "short",
  });
}

export { isoDateFromDbDate };
