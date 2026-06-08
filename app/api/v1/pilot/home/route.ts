import { NextRequest } from "next/server";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import { buildPilotHome } from "@/lib/server/pilot/build-pilot-home";
import { getCurrentUser } from "@/lib/server/auth/session-service";
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

    const data = await buildPilotHome(user.clientId);
    if (!data) {
      return jsonError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Perfil de piloto não encontrado.",
        httpStatus: 404,
      });
    }
    return jsonSuccess(data);
  } catch (error) {
    console.error("[pilot/home GET]", error);
    return jsonError(internalError());
  }
}
