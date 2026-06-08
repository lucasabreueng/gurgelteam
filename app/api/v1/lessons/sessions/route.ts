import { NextRequest } from "next/server";

import { lessonRegistrationQuerySchema } from "@/lib/contracts/api/v1/lessons.api.schemas";
import { lessonsRepository } from "@/lib/server/lessons/lessons-repository";
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

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "registroAulas", "view");
  if (isNextResponse(auth)) return auth;

  const query = parseSearchParams(request, lessonRegistrationQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await lessonsRepository.listSessions(query);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[lessons/sessions GET]", error);
    return jsonError(internalError());
  }
}
