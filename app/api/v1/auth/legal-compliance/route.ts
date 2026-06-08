import { NextRequest } from "next/server";

import { legalComplianceAcceptSchema } from "@/lib/contracts/api/v1/auth.api.schemas";
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import {
  acceptUserLegalCompliance,
  getUserLegalComplianceStatus,
} from "@/lib/server/auth/legal-compliance-service";
import { getCurrentUser } from "@/lib/server/auth/session-service";
import {
  internalError,
  jsonError,
  jsonSuccess,
  unauthorizedError,
} from "@/lib/server/api/responses";
import {
  isNextResponse,
  parseJsonBody,
} from "@/lib/server/api/require-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return jsonError(unauthorizedError());
    }

    const status = await getUserLegalComplianceStatus(user.id);
    return jsonSuccess(status);
  } catch (error) {
    console.error("[auth/legal-compliance GET]", error);
    return jsonError(internalError());
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return jsonError(unauthorizedError());
    }

    const body = await parseJsonBody(request, legalComplianceAcceptSchema);
    if (isNextResponse(body)) return body;

    await acceptUserLegalCompliance(user.id, body);
    const status = await getUserLegalComplianceStatus(user.id);
    return jsonSuccess(status);
  } catch (error) {
    console.error("[auth/legal-compliance POST]", error);
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível registrar os aceites.";
    return jsonError({
      code: API_ERROR_CODES.BUSINESS_RULE,
      message,
      httpStatus: 422,
    });
  }
}
