import { NextRequest } from "next/server";

import { scheduleSlotsQuerySchema } from "@/lib/contracts/api/v1/schedule.api.schemas";
import {
  isNextResponse,
  parseSearchParams,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";
import { scheduleSlotsRepository } from "@/lib/server/schedule/schedule-slots-repository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "agenda", "view");
  if (isNextResponse(auth)) return auth;

  const query = parseSearchParams(request, scheduleSlotsQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await scheduleSlotsRepository.getDayScheduleForDate(query.date);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[schedule/slots GET]", error);
    return jsonError(internalError());
  }
}
