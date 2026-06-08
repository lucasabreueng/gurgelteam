import { NextRequest } from "next/server";

import { telemetryRepository } from "@/lib/server/telemetry/telemetry-repository";
import {
  isNextResponse,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ sessionId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const auth = await requireModulePermission(_request, "telemetria", "view");
  if (isNextResponse(auth)) return auth;

  const { sessionId } = await context.params;

  try {
    const data = await telemetryRepository.getSessionById(sessionId);
    if (!data) {
      return jsonError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Sessão de telemetria não encontrada.",
        httpStatus: 404,
      });
    }
    return jsonSuccess(data);
  } catch (error) {
    console.error("[telemetry/sessions/:id GET]", error);
    return jsonError(internalError());
  }
}
