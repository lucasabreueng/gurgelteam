import { NextRequest } from "next/server";

import {
  createScheduleEventSchema,
  scheduleEventsQuerySchema,
} from "@/lib/contracts/api/v1/schedule.api.schemas";
import {
  isApiError,
  scheduleRepository,
} from "@/lib/server/schedule/schedule-repository";
import {
  isNextResponse,
  parseJsonBody,
  parseSearchParams,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "agenda", "view");
  if (isNextResponse(auth)) return auth;

  const query = parseSearchParams(request, scheduleEventsQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await scheduleRepository.listEvents(query);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[schedule/events GET]", error);
    return jsonError(internalError());
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "agenda", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, createScheduleEventSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await scheduleRepository.createEvent(body, auth.user.id);
    return jsonSuccess(data, 201);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[schedule/events POST]", error);
    return jsonError(internalError());
  }
}
