import { NextRequest } from "next/server";

import { buildPilotAchievements } from "@/lib/server/pilot/build-pilot-area";
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

    const achievements = await buildPilotAchievements(user.clientId);
    return jsonSuccess({ achievements });
  } catch (error) {
    console.error("[pilot/achievements GET]", error);
    return jsonError(internalError());
  }
}
