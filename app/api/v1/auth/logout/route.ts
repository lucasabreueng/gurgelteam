import { NextRequest } from "next/server";

import {
  clearSessionCookie,
} from "@/lib/server/auth/cookies";
import {
  extractSessionToken,
  getCurrentUser,
  revokeSession,
} from "@/lib/server/auth/session-service";
import { writeAuthAuditLog } from "@/lib/server/auth/auth-utils";
import {
  internalError,
  jsonError,
  jsonSuccess,
  unauthorizedError,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const token = extractSessionToken(request);
    const user = await getCurrentUser(request);

    if (token) {
      await revokeSession(token);
    }

    if (user) {
      await writeAuthAuditLog({
        actorId: user.id,
        action: "AUTH_LOGOUT",
      });
    }

    const response = jsonSuccess({ ok: true });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error("[auth/logout]", error);
    return jsonError(internalError());
  }
}

export async function GET() {
  return jsonError(unauthorizedError("Método não permitido."));
}
