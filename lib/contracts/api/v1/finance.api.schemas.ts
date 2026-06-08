import { z } from "zod";

import {
  PACKAGE_CREDIT_STATUSES,
  RECEIVABLE_STATUSES,
} from "../../enums";
import { zIsoDate, zMoneyCents, zUuid } from "../common.schemas";

export const zReceivableStatus = z.enum(RECEIVABLE_STATUSES);
export const zPackageCreditStatus = z.enum(PACKAGE_CREDIT_STATUSES);

export const accountReceivableSchema = z.object({
  id: zUuid,
  clientId: zUuid,
  clientName: z.string(),
  scheduleEventId: zUuid.nullable().optional(),
  amountCents: zMoneyCents,
  dueDate: zIsoDate,
  status: zReceivableStatus,
  paymentMethod: z.string().nullable().optional(),
  serviceLabel: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type AccountReceivableApiDTO = z.infer<typeof accountReceivableSchema>;
export type AccountPayableApiDTO = z.infer<typeof accountPayableSchema>;

export type ReceivablesQuery = z.infer<typeof receivablesQuerySchema>;
export type PayablesQuery = z.infer<typeof payablesQuerySchema>;

export const accountPayableSchema = z.object({
  id: zUuid,
  supplierName: z.string(),
  category: z.string(),
  amountCents: zMoneyCents,
  dueDate: zIsoDate,
  status: zReceivableStatus,
  paymentMethod: z.string().nullable().optional(),
});

export const receivablesQuerySchema = z.object({
  query: z.string().default(""),
  status: zReceivableStatus.or(z.literal("")).default(""),
  method: z.string().default(""),
  service: z.string().default(""),
  from: zIsoDate.optional(),
  to: zIsoDate.optional(),
  clientId: zUuid.optional(),
});

export const payablesQuerySchema = z.object({
  query: z.string().default(""),
  status: zReceivableStatus.or(z.literal("")).default(""),
  method: z.string().default(""),
  category: z.string().default(""),
  from: zIsoDate.optional(),
  to: zIsoDate.optional(),
});

export const createReceivableSchema = z.object({
  clientId: zUuid,
  scheduleEventId: zUuid.optional(),
  amountCents: zMoneyCents,
  dueDate: zIsoDate,
  serviceLabel: z.string().min(1),
  paymentMethod: z.string().optional(),
});

export type CreateReceivableRequest = z.infer<typeof createReceivableSchema>;

export const recordPaymentSchema = z.object({
  receivableId: zUuid,
  amountCents: zMoneyCents,
  paidAt: z.string().datetime({ offset: true }),
  method: z.string().min(1),
});

export type RecordPaymentRequest = z.infer<typeof recordPaymentSchema>;

export const packageCreditSchema = z.object({
  id: zUuid,
  clientId: zUuid,
  name: z.string(),
  lessonsTotal: z.number().int().positive(),
  lessonsUsed: z.number().int().min(0),
  expiresAt: zIsoDate.nullable().optional(),
  status: zPackageCreditStatus,
});

export const createPackageCreditSchema = z.object({
  clientId: zUuid,
  name: z.string().min(1),
  lessonsTotal: z.number().int().positive(),
  expiresAt: zIsoDate.optional(),
});

export const cashflowQuerySchema = z.object({
  from: zIsoDate,
  to: zIsoDate,
  granularity: z.enum(["day", "week", "month"]).default("day"),
});

export const dreQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12).optional(),
});

export const drePeriodQuerySchema = z.object({
  key: z.enum([
    "current-month",
    "previous-month",
    "current-year",
    "last-12-months",
    "custom",
  ]),
  customStart: zIsoDate.optional(),
  customEnd: zIsoDate.optional(),
});

export const cashFlowPeriodQuerySchema = z.object({
  key: z.enum(["today", "week", "current-month", "last-3-months", "custom"]),
  customStart: zIsoDate.optional(),
  customEnd: zIsoDate.optional(),
});
