import { NextRequest } from "next/server";

import { changePasswordRequestSchema } from "@/lib/contracts/api/v1/auth.api.schemas";
import { changePasswordService } from "@/lib/server/auth/change-password-service";
import {
  isNextResponse,
  parseJsonBody,
} from "@/lib/server/api/require-auth";
import { getCurrentUser } from "@/lib/server/auth/session-service";
import {
  internalError,
  jsonError,
  jsonSuccess,
  unauthorizedError,
} from "@/lib/server/api/responses";
import type { ApiError } from "@/lib/contracts/api/api-error";

export const dynamic = "force-dynamic";

function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value
  );
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return jsonError(unauthorizedError());
    }

    const body = await parseJsonBody(request, changePasswordRequestSchema);
    if (isNextResponse(body)) return body;

    const data = await changePasswordService.changePassword(
      user.id,
      body.currentPassword,
      body.newPassword,
    );
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[auth/change-password]", error);
    return jsonError(internalError());
  }
}
