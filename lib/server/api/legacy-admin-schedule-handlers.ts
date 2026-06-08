import { format } from "date-fns";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

import { mapScheduleEventDtoToLegacy } from "@/lib/api/mappers/v1-mappers";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import { upcomingDaysQuerySchema } from "@/lib/contracts/api/v1/schedule.api.schemas";
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import {
  applyLegacyAdminHeaders,
  legacyAdminJsonError,
  legacyAdminJsonSuccess,
} from "@/lib/server/api/legacy-admin-proxy";
import {
  isNextResponse,
  parseSearchParams,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import { internalError } from "@/lib/server/api/responses";
import { scheduleRepository } from "@/lib/server/schedule/schedule-repository";
import {
  buildScheduleMetaDTO,
  buildUpcomingDays,
} from "@/lib/server/schedule/schedule-meta";

function withLegacyHeaders(
  response: NextResponse,
  successorPath: string,
): NextResponse {
  return applyLegacyAdminHeaders(response, successorPath);
}

export async function handleLegacyAdminScheduleEvents(request: NextRequest) {
  const successor = v1ApiPaths.schedule.events;
  const auth = await requireModulePermission(request, "agenda", "view");
  if (isNextResponse(auth)) return withLegacyHeaders(auth, successor);

  try {
    const events = await scheduleRepository.listEvents({});
    const legacy = events.map(mapScheduleEventDtoToLegacy);
    return legacyAdminJsonSuccess(legacy, successor);
  } catch (error) {
    console.error("[legacy admin schedule/events]", error);
    return legacyAdminJsonError(internalError(), successor);
  }
}

export async function handleLegacyAdminScheduleEventById(
  request: NextRequest,
  eventId: string,
) {
  const successor = v1ApiPaths.schedule.eventById(eventId);
  const auth = await requireModulePermission(request, "agenda", "view");
  if (isNextResponse(auth)) return withLegacyHeaders(auth, successor);

  try {
    const event = await scheduleRepository.getEventById(eventId);
    if (!event) {
      return legacyAdminJsonError(
        {
          code: API_ERROR_CODES.NOT_FOUND,
          message: "Evento não encontrado.",
          httpStatus: 404,
        },
        successor,
      );
    }
    return legacyAdminJsonSuccess(mapScheduleEventDtoToLegacy(event), successor);
  } catch (error) {
    console.error("[legacy admin schedule/events/:id]", error);
    return legacyAdminJsonError(internalError(), successor);
  }
}

export async function handleLegacyAdminScheduleMeta(request: NextRequest) {
  const successor = v1ApiPaths.schedule.meta;
  const auth = await requireModulePermission(request, "agenda", "view");
  if (isNextResponse(auth)) return withLegacyHeaders(auth, successor);

  try {
    const data = await buildScheduleMetaDTO();
    return legacyAdminJsonSuccess(data, successor);
  } catch (error) {
    console.error("[legacy admin schedule/meta]", error);
    return legacyAdminJsonError(internalError(), successor);
  }
}

export async function handleLegacyAdminScheduleUpcomingDays(
  request: NextRequest,
) {
  const successor = v1ApiPaths.schedule.upcomingDays;
  const auth = await requireModulePermission(request, "agenda", "view");
  if (isNextResponse(auth)) return withLegacyHeaders(auth, successor);

  const query = parseSearchParams(request, upcomingDaysQuerySchema);
  if (isNextResponse(query)) return withLegacyHeaders(query, successor);

  const from = query.from ?? format(new Date(), "yyyy-MM-dd");

  try {
    const data = await buildUpcomingDays(from, query.days);
    return legacyAdminJsonSuccess(data, successor);
  } catch (error) {
    console.error("[legacy admin schedule/upcoming-days]", error);
    return legacyAdminJsonError(internalError(), successor);
  }
}
