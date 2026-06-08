import { NextRequest } from "next/server";

import { passwordRecoveryVerifySchema } from "@/lib/contracts/api/v1/auth.api.schemas";
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import { passwordRecoveryService } from "@/lib/server/auth/password-recovery-service";
import { isApiError } from "@/lib/server/clients/clients-repository";
import {
  internalError,
  jsonError,
  jsonSuccess,
  serviceUnavailableError,
  validationError,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError({
      code: API_ERROR_CODES.VALIDATION_ERROR,
      message: "Corpo da requisição inválido.",
      httpStatus: 400,
    });
  }

  const parsed = passwordRecoveryVerifySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(validationError(parsed.error));
  }

  try {
    const data = await passwordRecoveryService.verifyCode(parsed.data.code);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);

    if (
      error instanceof Error &&
      (error.name === "PrismaClientInitializationError" ||
        error.message.includes("Can't reach database"))
    ) {
      return jsonError(serviceUnavailableError("Banco de dados indisponível."));
    }

    console.error("[auth/password-recovery/verify]", error);
    return jsonError(internalError());
  }
}
