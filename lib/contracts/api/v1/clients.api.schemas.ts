import { z } from "zod";

import { CLIENT_STATUSES } from "../../enums";
import { zIsoDate, zUuid } from "../common.schemas";

export const zClientStatus = z.enum(CLIENT_STATUSES);

export const clientListItemSchema = z.object({
  id: zUuid,
  name: z.string(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  skillLevelId: zUuid,
  skillLevelName: z.string().optional(),
  status: zClientStatus,
  isMinor: z.boolean(),
  categoryIds: z.array(zUuid).optional(),
  memberSince: zIsoDate.nullable().optional(),
});

export type ClientListItemDTO = z.infer<typeof clientListItemSchema>;

export const clientsQuerySchema = z.object({
  query: z.string().default(""),
  status: zClientStatus.or(z.literal("")).default(""),
  categoryId: zUuid.optional(),
  skillLevelId: zUuid.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ClientsQuery = z.infer<typeof clientsQuerySchema>;

export const createClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  skillLevelId: zUuid,
  categoryIds: z.array(zUuid).min(1),
  isMinor: z.boolean().default(false),
  birthDate: zIsoDate.optional(),
  sendInvite: z.boolean().default(true),
});

export type CreateClientRequest = z.infer<typeof createClientSchema>;

export const updateClientSchema = createClientSchema.partial().extend({
  status: zClientStatus.optional(),
});

export type UpdateClientRequest = z.infer<typeof updateClientSchema>;

export const clientDetailSchema = clientListItemSchema.extend({
  bestLapMs: z.number().int().nullable().optional(),
  consistencyPct: z.number().int().min(0).max(100).nullable().optional(),
  totalSessions: z.number().int().min(0).optional(),
  categoryNames: z.array(z.string()).optional(),
});

export type ClientDetailDTO = z.infer<typeof clientDetailSchema>;

export const clientTimelineEventSchema = z.object({
  id: zUuid,
  type: z.enum(["schedule", "lesson", "payment"]),
  label: z.string(),
  at: z.string().datetime({ offset: true }),
  status: z.string().optional(),
});

export type ClientTimelineEventDTO = z.infer<typeof clientTimelineEventSchema>;

export { pilotStatsQuerySchema, pilotStatsSchema } from "./telemetry.api.schemas";

export const guardianSchema = z.object({
  id: zUuid,
  name: z.string(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
});

export const guardianLinkSchema = z.object({
  guardianId: zUuid,
  clientId: zUuid,
  authorizationSigned: z.boolean(),
  documentsOnFile: z.boolean(),
});

export const linkGuardianSchema = z.object({
  guardianId: zUuid.optional(),
  guardian: guardianSchema
    .omit({ id: true })
    .partial()
    .extend({ name: z.string().min(2) })
    .optional(),
  authorizationSigned: z.boolean().default(false),
  documentsOnFile: z.boolean().default(false),
});

export type LinkGuardianRequest = z.infer<typeof linkGuardianSchema>;

export const evolutionRankingEntrySchema = z.object({
  id: zUuid,
  name: z.string(),
  avatar: z.string(),
  metric: z.string(),
  value: z.string(),
  rank: z.number().int().min(1),
});

export const clientRankingsSchema = z.object({
  evolution: z.array(evolutionRankingEntrySchema),
  training: z.array(evolutionRankingEntrySchema),
  laps: z.array(evolutionRankingEntrySchema),
  consistency: z.array(evolutionRankingEntrySchema),
});

export type ClientRankingsApiDTO = z.infer<typeof clientRankingsSchema>;
