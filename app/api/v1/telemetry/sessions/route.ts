import { NextRequest } from "next/server";

import { telemetrySessionsQuerySchema } from "@/lib/contracts/api/v1/telemetry.api.schemas";
import { telemetryRepository } from "@/lib/server/telemetry/telemetry-repository";
import {
  isNextResponse,
  parseSearchParams,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "telemetria", "view");
  if (isNextResponse(auth)) return auth;

  const query = parseSearchParams(request, telemetrySessionsQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await telemetryRepository.listSessions(query);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[telemetry/sessions GET]", error);
    return jsonError(internalError());
  }
}
