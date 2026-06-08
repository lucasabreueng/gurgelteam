import { NextRequest } from "next/server";

import { pilotBookingSlotsQuerySchema } from "@/lib/contracts/api/v1/pilot.api.schemas";
import { buildGuardianBookingSlots } from "@/lib/server/pilot/build-guardian-booking-slots";
import {
  isNextResponse,
  parseSearchParams,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
  unauthorizedError,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "pilotoAgenda", "view");
  if (isNextResponse(auth)) return auth;

  const clientId = auth.user.clientId;
  if (!clientId) {
    return jsonError(unauthorizedError());
  }

  const query = parseSearchParams(request, pilotBookingSlotsQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await buildGuardianBookingSlots(auth.user, query.date);
    if (!data) {
      return jsonError({
        code: "NOT_FOUND",
        message: "Perfil de piloto não encontrado.",
        httpStatus: 404,
      });
    }
    return jsonSuccess(data);
  } catch (error) {
    console.error("[pilot/booking/slots GET]", error);
    return jsonError(internalError());
  }
}
