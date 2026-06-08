import { NextRequest } from "next/server";

import { swapKartSchema } from "@/lib/contracts/api/v1/schedule.api.schemas";
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

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "agenda", "edit");
  if (isNextResponse(auth)) return auth;

  const { eventId } = await params;
  const body = await parseJsonBody(request, swapKartSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await scheduleRepository.swapKart(
      eventId,
      body.kartId,
      body.reason,
    );
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[schedule/events/:id/swap-kart]", error);
    return jsonError(internalError());
  }
}
