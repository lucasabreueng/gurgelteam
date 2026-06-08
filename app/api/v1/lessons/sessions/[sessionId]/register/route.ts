import { NextRequest } from "next/server";

import { lessonRegistrationSchema } from "@/lib/contracts/api/v1/lessons.api.schemas";
import {
  isApiError,
  lessonsRepository,
} from "@/lib/server/lessons/lessons-repository";
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

type Params = { params: Promise<{ sessionId: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "registroAulas", "edit");
  if (isNextResponse(auth)) return auth;

  const { sessionId } = await params;
  const body = await parseJsonBody(request, lessonRegistrationSchema);
  if (isNextResponse(body)) return body;

  if (body.sessionId !== sessionId) {
    return jsonError({
      code: "VALIDATION_ERROR",
      message: "sessionId do corpo não confere com a URL.",
      httpStatus: 400,
    });
  }

  try {
    const data = await lessonsRepository.registerSession(sessionId, body);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[lessons/sessions/:id/register POST]", error);
    return jsonError(internalError());
  }
}
