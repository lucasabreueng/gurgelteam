import { NextRequest } from "next/server";

import { pilotConsentRequestSchema } from "@/lib/contracts/api/v1/pilot.api.schemas";
import { upsertPilotConsent } from "@/lib/server/pilot/pilot-consent-service";
import { buildPilotAccountBundle } from "@/lib/server/pilot/pilot-account-bundle";
import { isApiError } from "@/lib/server/pilot/pilot-repository";
import { getCurrentUser, extractSessionToken } from "@/lib/server/auth/session-service";
import { prisma } from "@/lib/server/prisma";
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import {
  isNextResponse,
  parseJsonBody,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
  unauthorizedError,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user?.clientId) {
      return jsonError(unauthorizedError());
    }

    const body = await parseJsonBody(request, pilotConsentRequestSchema);
    if (isNextResponse(body)) return body;

    if (body.type === "image") {
      const client = await prisma.client.findUnique({
        where: { id: user.clientId },
        select: { isMinor: true },
      });
      if (client?.isMinor) {
        return jsonError({
          code: API_ERROR_CODES.FORBIDDEN,
          message:
            "A autorização de uso de imagem deve ser feita pelo perfil responsável.",
          httpStatus: 403,
        });
      }
    }

    await upsertPilotConsent(user.id, body);

    const token = extractSessionToken(request);
    const data = await buildPilotAccountBundle(user, token);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[pilot/consents POST]", error);
    return jsonError(internalError());
  }
}
