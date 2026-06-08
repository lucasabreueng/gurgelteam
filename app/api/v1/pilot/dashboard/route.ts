import { NextRequest } from "next/server";

import {
  isApiError,
  pilotRepository,
} from "@/lib/server/pilot/pilot-repository";
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

    const data = await pilotRepository.getDashboard(user.clientId);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[pilot/dashboard GET]", error);
    return jsonError(internalError());
  }
}
