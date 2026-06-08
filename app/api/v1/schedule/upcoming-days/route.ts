import { format } from "date-fns";
import { NextRequest } from "next/server";

import { upcomingDaysQuerySchema } from "@/lib/contracts/api/v1/schedule.api.schemas";
import {
  isNextResponse,
  parseSearchParams,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import { internalError, jsonError, jsonSuccess } from "@/lib/server/api/responses";
import { buildUpcomingDays } from "@/lib/server/schedule/schedule-meta";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "agenda", "view");
  if (isNextResponse(auth)) return auth;

  const query = parseSearchParams(request, upcomingDaysQuerySchema);
  if (isNextResponse(query)) return query;

  const from = query.from ?? format(new Date(), "yyyy-MM-dd");

  try {
    const data = await buildUpcomingDays(from, query.days);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[schedule/upcoming-days]", error);
    return jsonError(internalError());
  }
}
