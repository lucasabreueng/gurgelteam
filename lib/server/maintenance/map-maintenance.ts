import type { MaintenanceOrder, MaintenancePartUse, InventoryPart, Supplier } from "@prisma/client";

import type {
  MaintenanceOrderApiDTO,
  MaintenanceOrderDetailApiDTO,
} from "@/lib/contracts/api/v1/maintenance.api.schemas";
type OrderRow = MaintenanceOrder & {
  kart?: { number: number } | null;
  parts?: (MaintenancePartUse & {
    part: InventoryPart & { supplier?: Supplier | null };
  })[];
};

export function mapMaintenanceOrderToApi(
  row: OrderRow,
): MaintenanceOrderApiDTO {
  return {
    id: row.id,
    kartId: row.kartId,
    kartNumber: row.kart?.number,
    status: row.status,
    title: row.title,
    description: row.description,
    detectedAt: row.detectedAt.toISOString(),
    assignedTo: row.assignedTo,
    closedAt: row.closedAt?.toISOString() ?? null,
  };
}

export function mapMaintenanceOrderToDetailApi(
  row: OrderRow,
): MaintenanceOrderDetailApiDTO {
  const base = mapMaintenanceOrderToApi(row);
  return {
    ...base,
    checklistData: row.checklistData ?? null,
    parts: (row.parts ?? []).map((use) => ({
      id: use.id,
      inventoryPartId: use.inventoryPartId,
      name: use.part.name,
      qty: use.qty,
      unitCostCents: use.part.unitCostCents,
      supplierName: use.part.supplier?.name ?? "—",
    })),
  };
}
