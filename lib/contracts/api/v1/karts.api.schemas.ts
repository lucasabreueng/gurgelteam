import { z } from "zod";

import { KART_OWNERSHIP_TYPES, KART_STATUSES } from "../../enums";
import { zIsoDate, zUuid } from "../common.schemas";

export const zKartOwnership = z.enum(KART_OWNERSHIP_TYPES);
export const zKartStatus = z.enum(KART_STATUSES);

export const kartSchema = z.object({
  id: zUuid,
  number: z.number().int().positive(),
  categoryId: zUuid,
  categoryName: z.string().optional(),
  ownership: zKartOwnership,
  clientId: zUuid.nullable().optional(),
  status: zKartStatus,
  motorRef: z.string().nullable().optional(),
  chassisRef: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  clientName: z.string().nullable().optional(),
  engineHours: z.number().nullable().optional(),
  lastMaintenanceAt: zIsoDate.nullable().optional(),
  nextMaintenanceHours: z.number().nullable().optional(),
  preventiveMaintenanceHours: z
    .record(z.string(), z.number())
    .nullable()
    .optional(),
});

export type KartApiDTO = z.infer<typeof kartSchema>;

export type KartsQuery = z.infer<typeof kartsQuerySchema>;
export type UpdateKartStatusRequest = z.infer<typeof updateKartStatusSchema>;
export type AssignKartToClientRequest = z.infer<typeof assignKartToClientSchema>;

export const kartsQuerySchema = z.object({
  status: zKartStatus.or(z.literal("")).default(""),
  categoryId: zUuid.optional(),
  ownership: zKartOwnership.optional(),
  clientId: zUuid.optional(),
});

export const updateKartStatusSchema = z.object({
  status: zKartStatus,
  reason: z.string().optional(),
});

export const assignKartToClientSchema = z.object({
  clientId: zUuid,
  ownership: z.literal("client"),
});

export const createKartSchema = z
  .object({
    number: z.coerce.number().int().positive(),
    categoryId: zUuid,
    ownership: zKartOwnership,
    clientId: zUuid.nullable().optional(),
    motorRef: z.string().min(1),
    chassisRef: z.string().min(1),
    photoUrl: z.string().min(1).nullable().optional(),
    engineHours: z.coerce.number().min(0).optional(),
    lastMaintenanceAt: zIsoDate.nullable().optional(),
    preventiveMaintenanceHours: z
      .record(z.string(), z.number())
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.ownership === "client" && !data.clientId) {
      ctx.addIssue({
        code: "custom",
        message: "Cliente obrigatório para kart de cliente.",
        path: ["clientId"],
      });
    }
  });

export const updateKartSchema = z
  .object({
    number: z.coerce.number().int().positive().optional(),
    categoryId: zUuid.optional(),
    ownership: zKartOwnership.optional(),
    clientId: zUuid.nullable().optional(),
    motorRef: z.string().min(1).optional(),
    chassisRef: z.string().min(1).optional(),
    photoUrl: z.string().nullable().optional(),
    engineHours: z.coerce.number().min(0).optional(),
    lastMaintenanceAt: zIsoDate.nullable().optional(),
    preventiveMaintenanceHours: z
      .record(z.string(), z.number())
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.ownership === "client" && data.clientId === null) {
      ctx.addIssue({
        code: "custom",
        message: "Cliente obrigatório para kart de cliente.",
        path: ["clientId"],
      });
    }
  });

export type CreateKartRequest = z.infer<typeof createKartSchema>;
export type UpdateKartRequest = z.infer<typeof updateKartSchema>;

export const kartAlertSchema = z.object({
  id: z.string(),
  message: z.string(),
  severity: z.enum(["info", "warn", "urgent"]),
  kartNumber: z.number().int(),
});

export const paddockBoxSchema = z.object({
  slot: z.string(),
  kartId: zUuid.optional(),
  status: z.union([zKartStatus, z.literal("empty")]),
});

export const kartsPaddockSchema = z.object({
  alerts: z.array(kartAlertSchema),
  boxes: z.array(paddockBoxSchema),
});

export type KartsPaddockApiDTO = z.infer<typeof kartsPaddockSchema>;
