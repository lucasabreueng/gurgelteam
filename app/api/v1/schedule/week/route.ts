import { NextRequest } from "next/server";

import { replaceScheduleHoursSchema } from "@/lib/contracts/api/v1/schedule.api.schemas";
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
import { scheduleHoursRepository } from "@/lib/server/schedule/schedule-hours-repository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "configuracoes", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const config = await scheduleHoursRepository.getConfig();
    return jsonSuccess(config);
  } catch (error) {
    console.error("[schedule/week GET]", error);
    return jsonError(internalError());
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireModulePermission(request, "configuracoes", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, replaceScheduleHoursSchema);
  if (isNextResponse(body)) return body;

  try {
    const current = await scheduleHoursRepository.getConfig();
    const config = await scheduleHoursRepository.replaceConfig({
      days: body.days,
      specificDates: body.specificDates ?? current.specificDates,
      exceptions: body.exceptions ?? current.exceptions,
    });
    return jsonSuccess(config);
  } catch (error) {
    console.error("[schedule/week PUT]", error);
    return jsonError(internalError());
  }
}
