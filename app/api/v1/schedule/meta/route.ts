import { NextRequest } from "next/server";

import {
  isNextResponse,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import { internalError, jsonError, jsonSuccess } from "@/lib/server/api/responses";
import { buildScheduleMetaDTO } from "@/lib/server/schedule/schedule-meta";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "agenda", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const data = await buildScheduleMetaDTO();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[schedule/meta]", error);
    return jsonError(internalError());
  }
}
