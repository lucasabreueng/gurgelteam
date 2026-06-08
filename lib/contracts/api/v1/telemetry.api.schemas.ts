import { z } from "zod";

import { TelemetryStatus } from "../../enums";
import { zIsoDateTime, zUuid } from "../common.schemas";

export const zTelemetryStatus = z.nativeEnum(TelemetryStatus);

export const telemetryLapSchema = z.object({
  lapNumber: z.number().int().positive(),
  lapTimeMs: z.number().int().positive(),
  valid: z.boolean().default(true),
  sectorTimesMs: z.array(z.number().int()).length(3).optional(),
});

export const telemetrySessionSchema = z.object({
  id: zUuid,
  clientId: zUuid.nullable().optional(),
  lessonSessionId: zUuid.nullable().optional(),
  status: zTelemetryStatus,
  source: z.string(),
  trackId: z.string().nullable().optional(),
  sourceFileName: z.string().nullable().optional(),
  rawFileKey: z.string().nullable().optional(),
  processedAt: zIsoDateTime.nullable().optional(),
  createdAt: zIsoDateTime.optional(),
  laps: z.array(telemetryLapSchema).optional(),
});

export type TelemetrySessionApiDTO = z.infer<typeof telemetrySessionSchema>;

export const createTelemetrySessionSchema = z.object({
  clientId: zUuid.optional(),
  lessonSessionId: zUuid.optional(),
  source: z.string().min(1),
  trackId: z.string().optional(),
  sourceFileName: z.string().optional(),
});

export const telemetryUploadCompleteSchema = z.object({
  fileSizeBytes: z.number().int().positive(),
  contentType: z.string().min(1),
  checksumSha256: z.string().length(64).optional(),
});

export const telemetrySessionsQuerySchema = z.object({
  clientId: zUuid.optional(),
  status: zTelemetryStatus.optional(),
  from: zIsoDateTime.optional(),
  to: zIsoDateTime.optional(),
});

export const presignedUploadResponseSchema = z.object({
  sessionId: zUuid,
  uploadUrl: z.string().url(),
  uploadMethod: z.literal("PUT"),
  expiresAt: zIsoDateTime,
  storageKey: z.string(),
});

export const pilotStatsQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  categoryId: zUuid.optional(),
});

export type PilotStatsQuery = z.infer<typeof pilotStatsQuerySchema>;

export const pilotStatsSchema = z.object({
  clientId: zUuid,
  bestLapMs: z.number().int().nullable(),
  consistencyPct: z.number().int().min(0).max(100).nullable(),
  totalSessions: z.number().int().min(0),
  validLapsCount: z.number().int().min(0),
});
