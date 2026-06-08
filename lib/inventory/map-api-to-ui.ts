import type {
  InventoryPartApiDTO,
  SupplierApiDTO,
} from "@/lib/contracts/api/v1/inventory.api.schemas";
import type {
  InventoryCategory,
  InventoryPart,
  InventorySupplier,
  SupplierStatus,
} from "@/lib/admin-inventory-mocks";
import type { StockLevel } from "@/lib/admin-parts-mocks";

export function computeStockLevel(stock: number, minStock: number): StockLevel {
  if (stock <= 0 || stock < minStock * 0.5) return "critical";
  if (stock < minStock) return "low";
  return "ok";
}

export function mapPartApiToUi(dto: InventoryPartApiDTO): InventoryPart {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    category: dto.category as InventoryCategory,
    compatibility: "—",
    stock: dto.stockQty,
    minStock: dto.minStockQty,
    stockLevel: computeStockLevel(dto.stockQty, dto.minStockQty),
    location: "Depósito",
    unitCost: dto.unitCostCents / 100,
    supplierId: dto.supplierId,
    supplierName: dto.supplierName ?? "—",
    image: "/images/gallery-1.jpg",
  };
}

export function mapSupplierApiToUi(dto: SupplierApiDTO): InventorySupplier {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    cnpj: dto.cnpj ?? "",
    city: dto.city ?? "",
    phone: dto.phone ?? "",
    whatsapp: dto.phone ?? "",
    email: dto.email ?? undefined,
    status: dto.status as SupplierStatus,
    avgLeadDays: dto.avgLeadDays ?? 0,
    partsSupplied: [],
    lastPurchase: "",
  };
}
