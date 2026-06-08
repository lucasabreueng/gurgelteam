import { NextRequest } from "next/server";

import { updatePilotProfileSchema } from "@/lib/contracts/api/v1/pilot.api.schemas";
import { assertGuardianManagesClient } from "@/lib/server/pilot/guardian-client-access";
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

type RouteContext = { params: Promise<{ clientId: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser(request);
    if (!user?.clientId) {
      return jsonError(unauthorizedError());
    }

    const { clientId } = await context.params;
    await assertGuardianManagesClient(user, clientId);

    const body = await parseJsonBody(request, updatePilotProfileSchema);
    if (isNextResponse(body)) return body;

    const data = await pilotRepository.updateProfile(clientId, body);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[pilot/linked-pilots/:clientId/profile PATCH]", error);
    return jsonError(internalError());
  }
}
