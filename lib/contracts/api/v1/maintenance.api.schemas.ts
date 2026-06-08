import { z } from "zod";

import { SIMPLE_MAINTENANCE_STATUSES } from "../../enums";
import { zIsoDate, zMoneyCents, zUuid } from "../common.schemas";

export const zSimpleMaintenanceStatus = z.enum(SIMPLE_MAINTENANCE_STATUSES);

export const inspectionItemKeys = [
  "pneus",
  "corrente",
  "freios",
  "motor",
  "chassi",
  "direcao",
] as const;

export const zInspectionItemKey = z.enum(inspectionItemKeys);
export const zInspectionItemRating = z.enum([
  "bom",
  "atencao",
  "necessita_manutencao",
]);

export const maintenanceOrderSchema = z.object({
  id: zUuid,
  kartId: zUuid,
  kartNumber: z.number().int().optional(),
  status: zSimpleMaintenanceStatus,
  title: z.string(),
  description: z.string().nullable().optional(),
  detectedAt: z.string().datetime({ offset: true }),
  assignedTo: z.string().nullable().optional(),
  closedAt: z.string().datetime({ offset: true }).nullable().optional(),
});

export const createMaintenanceOrderSchema = z.object({
  kartId: zUuid,
  title: z.string().min(1),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
});

export const updateMaintenanceOrderSchema = z.object({
  status: zSimpleMaintenanceStatus.optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
});

export type CreateMaintenanceOrderRequest = z.infer<
  typeof createMaintenanceOrderSchema
>;
export type UpdateMaintenanceOrderRequest = z.infer<
  typeof updateMaintenanceOrderSchema
>;
export type MaintenanceOrderApiDTO = z.infer<typeof maintenanceOrderSchema>;

export const maintenanceOrderPartSchema = z.object({
  id: zUuid,
  inventoryPartId: zUuid,
  name: z.string(),
  qty: z.number().int().positive(),
  unitCostCents: zMoneyCents,
  supplierName: z.string(),
});

export const maintenanceOrderDetailSchema = maintenanceOrderSchema.extend({
  checklistData: z.unknown().nullable().optional(),
  parts: z.array(maintenanceOrderPartSchema).optional(),
});

export type MaintenanceOrderDetailApiDTO = z.infer<
  typeof maintenanceOrderDetailSchema
>;

export const inspectionFormSchema = z.object({
  kartId: zUuid,
  date: zIsoDate,
  responsible: z.string().min(1),
  notes: z.string().default(""),
  items: z.record(zInspectionItemKey, zInspectionItemRating),
});

export const maintenancePartLineSchema = z.object({
  inventoryPartId: zUuid,
  qty: z.number().int().positive(),
  notes: z.string().optional(),
});

export const completeMaintenanceSchema = z.object({
  status: z.literal("concluida"),
  parts: z.array(maintenancePartLineSchema).default([]),
  notes: z.string().optional(),
});

export const simpleMaintenanceFormSchema = z.object({
  kartId: zUuid,
  type: z.enum(["preventiva", "corretiva"]),
  category: zInspectionItemKey.or(z.literal("outros")),
  description: z.string().min(1),
  status: zSimpleMaintenanceStatus,
  date: zIsoDate,
  costCents: zMoneyCents,
  parts: z
    .array(
      z.object({
        name: z.string(),
        quantity: z.number().int().positive(),
        unitValueCents: zMoneyCents,
      }),
    )
    .default([]),
});
