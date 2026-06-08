import { NextRequest } from "next/server";

import { getCurrentUser, extractSessionToken } from "@/lib/server/auth/session-service";
import { hashSessionToken } from "@/lib/server/auth/session-token";
import { prisma } from "@/lib/server/prisma";
import {
  internalError,
  jsonError,
  jsonSuccess,
  unauthorizedError,
} from "@/lib/server/api/responses";
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ sessionId: string }> };

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return jsonError(unauthorizedError());
    }

    const { sessionId } = await context.params;
    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: user.id },
    });

    if (!session) {
      return jsonError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Sessão não encontrada.",
        httpStatus: 404,
      });
    }

    const currentToken = extractSessionToken(request);
    if (
      currentToken &&
      hashSessionToken(currentToken) === session.tokenHash
    ) {
      return jsonError({
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: "Não é possível encerrar a sessão atual.",
        httpStatus: 400,
      });
    }

    await prisma.session.delete({ where: { id: sessionId } });
    return jsonSuccess({ ok: true });
  } catch (error) {
    console.error("[pilot/sessions/:id DELETE]", error);
    return jsonError(internalError());
  }
}
