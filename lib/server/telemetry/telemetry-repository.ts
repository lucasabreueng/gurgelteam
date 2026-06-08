import type { z } from "zod";
import type { telemetrySessionsQuerySchema } from "@/lib/contracts/api/v1/telemetry.api.schemas";
import type { TelemetrySessionApiDTO } from "@/lib/contracts/api/v1/telemetry.api.schemas";
import { TelemetryStatus } from "@/lib/contracts/enums";
import { prisma } from "@/lib/server/prisma";

type TelemetrySessionsQuery = z.infer<typeof telemetrySessionsQuerySchema>;

export const telemetryRepository = {
  async listSessions(
    query: TelemetrySessionsQuery,
  ): Promise<TelemetrySessionApiDTO[]> {
    const rows = await prisma.telemetrySession.findMany({
      where: {
        ...(query.clientId ? { clientId: query.clientId } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.from || query.to
          ? {
              createdAt: {
                ...(query.from ? { gte: new Date(query.from) } : {}),
                ...(query.to ? { lte: new Date(query.to) } : {}),
              },
            }
          : {}),
      },
      include: {
        laps: { orderBy: { lapNumber: "asc" } },
        client: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return rows.map((row) => ({
      id: row.id,
      clientId: row.clientId,
      lessonSessionId: row.lessonSessionId,
      status: row.status as TelemetryStatus,
      source: row.source,
      trackId: row.trackId,
      sourceFileName: row.rawFileKey?.split("/").pop() ?? null,
      rawFileKey: row.rawFileKey,
      processedAt: row.processedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      laps: row.laps.map((lap) => ({
        lapNumber: lap.lapNumber,
        lapTimeMs: lap.lapTimeMs,
        valid: lap.valid,
        sectorTimesMs: Array.isArray(lap.sectorTimesMs)
          ? (lap.sectorTimesMs as number[])
          : undefined,
      })),
    }));
  },

  async getSessionById(sessionId: string): Promise<TelemetrySessionApiDTO | null> {
    const row = await prisma.telemetrySession.findUnique({
      where: { id: sessionId },
      include: {
        laps: { orderBy: { lapNumber: "asc" } },
        client: { select: { name: true } },
      },
    });
    if (!row) return null;

    return {
      id: row.id,
      clientId: row.clientId,
      lessonSessionId: row.lessonSessionId,
      status: row.status as TelemetryStatus,
      source: row.source,
      trackId: row.trackId,
      sourceFileName: row.rawFileKey?.split("/").pop() ?? null,
      rawFileKey: row.rawFileKey,
      processedAt: row.processedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      laps: row.laps.map((lap) => ({
        lapNumber: lap.lapNumber,
        lapTimeMs: lap.lapTimeMs,
        valid: lap.valid,
        sectorTimesMs: Array.isArray(lap.sectorTimesMs)
          ? (lap.sectorTimesMs as number[])
          : undefined,
      })),
    };
  },
};
