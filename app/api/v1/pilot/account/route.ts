import { NextRequest } from "next/server";

import { isApiError } from "@/lib/server/pilot/pilot-repository";
import { buildPilotAccountBundle } from "@/lib/server/pilot/pilot-account-bundle";
import { getCurrentUser } from "@/lib/server/auth/session-service";
import { extractSessionToken } from "@/lib/server/auth/session-service";
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

    const token = extractSessionToken(request);
    const data = await buildPilotAccountBundle(user, token);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[pilot/account GET]", error);
    return jsonError(internalError());
  }
}
