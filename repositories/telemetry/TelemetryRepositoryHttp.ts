import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type { TelemetrySessionApiDTO } from "@/lib/contracts/api/v1/telemetry.api.schemas";

export const TelemetryRepositoryHttp = {
  async listSessions(): Promise<TelemetrySessionApiDTO[]> {
    const res = await apiFetch<TelemetrySessionApiDTO[]>(
      v1ApiPaths.telemetry.sessions,
    );
    return unwrapApiResponse(res);
  },

  async getSessionById(sessionId: string): Promise<TelemetrySessionApiDTO> {
    const res = await apiFetch<TelemetrySessionApiDTO>(
      v1ApiPaths.telemetry.sessionById(sessionId),
    );
    return unwrapApiResponse(res);
  },
};
