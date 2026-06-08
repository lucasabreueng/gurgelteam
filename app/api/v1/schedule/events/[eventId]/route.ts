import { NextRequest } from "next/server";

import { updateScheduleEventSchema } from "@/lib/contracts/api/v1/schedule.api.schemas";
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import {
  isApiError,
  scheduleRepository,
} from "@/lib/server/schedule/schedule-repository";
import {
  isNextResponse,
  parseJsonBody,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ eventId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "agenda", "view");
  if (isNextResponse(auth)) return auth;

  const { eventId } = await params;

  try {
    const data = await scheduleRepository.getEventById(eventId);
    if (!data) {
      return jsonError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Evento não encontrado.",
        httpStatus: 404,
      });
    }
    return jsonSuccess(data);
  } catch (error) {
    console.error("[schedule/events/:id GET]", error);
    return jsonError(internalError());
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "agenda", "edit");
  if (isNextResponse(auth)) return auth;

  const { eventId } = await params;
  const body = await parseJsonBody(request, updateScheduleEventSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await scheduleRepository.updateEvent(eventId, body);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[schedule/events/:id PATCH]", error);
    return jsonError(internalError());
  }
}
