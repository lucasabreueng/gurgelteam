import { z } from "zod";

import { zMoneyCents, zUuid } from "../common.schemas";

export const supplierStatusSchema = z.enum(["ativo", "atrasado", "inativo"]);

export const supplierSchema = z.object({
  id: zUuid,
  code: z.string(),
  name: z.string(),
  cnpj: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  status: supplierStatusSchema,
  avgLeadDays: z.number().int().nullable().optional(),
});

export const createSupplierSchema = supplierSchema
  .omit({ id: true })
  .partial({ status: true, code: true });

export const inventoryPartSchema = z.object({
  id: zUuid,
  code: z.string(),
  name: z.string(),
  category: z.string(),
  stockQty: z.number().int().min(0),
  minStockQty: z.number().int().min(0),
  unitCostCents: zMoneyCents,
  supplierId: zUuid,
  supplierName: z.string().optional(),
});

export const createInventoryPartSchema = inventoryPartSchema
  .omit({ id: true, supplierName: true })
  .extend({ code: z.string().optional() });

export const updateInventoryPartSchema = createInventoryPartSchema.partial();

export const updateSupplierSchema = createSupplierSchema
  .omit({ code: true })
  .partial();

export const stockMovementTypeSchema = z.enum([
  "entrada",
  "saida",
  "ajuste",
  "perda",
  "devolucao",
]);

export const createStockMovementSchema = z.object({
  inventoryPartId: zUuid,
  type: stockMovementTypeSchema,
  qty: z.number().int().positive(),
  kartId: zUuid.optional(),
  maintenanceId: zUuid.optional(),
  notes: z.string().optional(),
});

export type CreateStockMovementRequest = z.infer<
  typeof createStockMovementSchema
>;
export type InventoryPartApiDTO = z.infer<typeof inventoryPartSchema>;
export type SupplierApiDTO = z.infer<typeof supplierSchema>;

export const purchaseOrderStatusSchema = z.enum([
  "solicitado",
  "aprovado",
  "comprado",
  "entregue",
]);

export const createPurchaseOrderSchema = z.object({
  supplierId: zUuid,
  lines: z
    .array(
      z.object({
        inventoryPartId: zUuid,
        qty: z.number().int().positive(),
        unitCostCents: zMoneyCents,
      }),
    )
    .min(1),
});
