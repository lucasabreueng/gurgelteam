import { NextRequest } from "next/server";

import { setLinkedPilotPasswordSchema } from "@/lib/contracts/api/v1/pilot.api.schemas";
import { setLinkedPilotPassword } from "@/lib/server/pilot/set-linked-pilot-password";
import { isApiError } from "@/lib/server/pilot/pilot-repository";
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
import type { ApiError } from "@/lib/contracts/api/api-error";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ clientId: string }> };

function isPilotApiError(value: unknown): value is ApiError {
  return isApiError(value);
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser(request);
    if (!user?.clientId) {
      return jsonError(unauthorizedError());
    }

    const { clientId } = await context.params;
    const body = await parseJsonBody(request, setLinkedPilotPasswordSchema);
    if (isNextResponse(body)) return body;

    const data = await setLinkedPilotPassword(user, clientId, body);
    return jsonSuccess(data);
  } catch (error) {
    if (isPilotApiError(error)) return jsonError(error);
    console.error("[pilot/linked-pilots/:clientId/password POST]", error);
    return jsonError(internalError());
  }
}
