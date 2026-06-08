import { NextRequest } from "next/server";

import { updatePilotProfileSchema } from "@/lib/contracts/api/v1/pilot.api.schemas";
import {
  isApiError,
  pilotRepository,
} from "@/lib/server/pilot/pilot-repository";
import { getCurrentUser } from "@/lib/server/auth/session-service";
import {
  isNextResponse,
  parseJsonBody,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
  unauthorizedError,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user?.clientId) {
      return jsonError(unauthorizedError());
    }

    const data = await pilotRepository.getProfile(user.clientId);
    if (!data) {
      return jsonError({
        code: "NOT_FOUND",
        message: "Perfil não encontrado.",
        httpStatus: 404,
      });
    }
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[pilot/profile GET]", error);
    return jsonError(internalError());
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user?.clientId) {
      return jsonError(unauthorizedError());
    }

    const body = await parseJsonBody(request, updatePilotProfileSchema);
    if (isNextResponse(body)) return body;

    const data = await pilotRepository.updateProfile(user.clientId, body);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[pilot/profile PATCH]", error);
    return jsonError(internalError());
  }
}
