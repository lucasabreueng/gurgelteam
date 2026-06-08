import { z } from "zod";

import { zIsoDateTime, zUuid } from "../common.schemas";

export const auditLogQuerySchema = z.object({
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  actorId: zUuid.optional(),
  action: z.string().optional(),
  from: zIsoDateTime.optional(),
  to: zIsoDateTime.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const auditLogSchema = z.object({
  id: zUuid,
  actorId: zUuid.nullable().optional(),
  action: z.string(),
  moduleKey: z.string().nullable().optional(),
  entityType: z.string().nullable().optional(),
  entityId: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  createdAt: zIsoDateTime,
});

export type AuditLogDTO = z.infer<typeof auditLogSchema>;
