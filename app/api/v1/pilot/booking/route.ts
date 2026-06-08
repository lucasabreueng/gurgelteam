import { NextRequest } from "next/server";

import { pilotBookingConfirmRequestSchema } from "@/lib/contracts/api/v1/pilot.api.schemas";
import { confirmPilotBooking } from "@/lib/server/pilot/confirm-pilot-booking";
import { isApiError } from "@/lib/server/pilot/pilot-repository";
import {
  isNextResponse,
  parseJsonBody,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
  unauthorizedError,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "pilotoAgenda", "edit");
  if (isNextResponse(auth)) return auth;

  if (!auth.user.clientId) {
    return jsonError(unauthorizedError());
  }

  const body = await parseJsonBody(request, pilotBookingConfirmRequestSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await confirmPilotBooking(auth.user, body);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[pilot/booking POST]", error);
    return jsonError(internalError());
  }
}
