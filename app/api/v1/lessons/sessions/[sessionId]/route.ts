import { NextRequest } from "next/server";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import { lessonsRepository } from "@/lib/server/lessons/lessons-repository";
import {
  isNextResponse,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ sessionId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "registroAulas", "view");
  if (isNextResponse(auth)) return auth;

  const { sessionId } = await params;

  try {
    const data = await lessonsRepository.getSessionById(sessionId);
    if (!data) {
      return jsonError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Sessão de aula não encontrada.",
        httpStatus: 404,
      });
    }
    return jsonSuccess(data);
  } catch (error) {
    console.error("[lessons/sessions/:id GET]", error);
    return jsonError(internalError());
  }
}
