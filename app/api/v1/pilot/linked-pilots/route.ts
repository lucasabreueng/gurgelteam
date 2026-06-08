import { NextRequest } from "next/server";

import { registerLinkedPilotSchema } from "@/lib/contracts/api/v1/pilot.api.schemas";
import { isApiError } from "@/lib/server/pilot/pilot-repository";
import { registerLinkedPilot } from "@/lib/server/pilot/register-linked-pilot";
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

function isPilotApiError(value: unknown): value is ApiError {
  return isApiError(value);
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user?.clientId) {
      return jsonError(unauthorizedError());
    }

    const body = await parseJsonBody(request, registerLinkedPilotSchema);
    if (isNextResponse(body)) return body;

    const data = await registerLinkedPilot(user, body);
    return jsonSuccess(data);
  } catch (error) {
    if (isPilotApiError(error)) return jsonError(error);
    console.error("[pilot/linked-pilots POST]", error);
    return jsonError(internalError());
  }
}
