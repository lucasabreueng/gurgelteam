import { NextRequest } from "next/server";

import { loginRequestSchema } from "@/lib/contracts/api/v1/auth.api.schemas";
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import {
  findUserByIdentifier,
  getClientIp,
  writeAuthAuditLog,
} from "@/lib/server/auth/auth-utils";
import { applySessionCookie } from "@/lib/server/auth/cookies";
import {
  checkLoginRateLimit,
  clearLoginAttempts,
  recordFailedLoginAttempt,
} from "@/lib/server/auth/login-rate-limit";
import { mapUserToAuthDTO } from "@/lib/server/auth/map-user";
import { verifyPassword } from "@/lib/server/auth/password";
import { createSession } from "@/lib/server/auth/session-service";
import { syncStaffUserPermissions } from "@/lib/server/auth/sync-staff-permissions";
import { getSessionTtlSeconds } from "@/lib/server/auth/session-token";
import {
  forbiddenError,
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

  const parsed = loginRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(validationError(parsed.error));
  }

  const ip = getClientIp(request);
  const rateLimitError = checkLoginRateLimit(ip);
  if (rateLimitError) {
    return jsonError(rateLimitError);
  }

  try {
    const user = await findUserByIdentifier(parsed.data.identifier);
    if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
      recordFailedLoginAttempt(ip);
      return jsonError({
        code: API_ERROR_CODES.UNAUTHORIZED,
        message: "E-mail/usuário ou senha incorretos.",
        httpStatus: 401,
      });
    }

    if (!user.active) {
      return jsonError(
        forbiddenError("Conta inativa. Entre em contato com a equipe."),
      );
    }

    clearLoginAttempts(ip);

    await syncStaffUserPermissions(user);

    const { token, expiresAt } = await createSession({
      userId: user.id,
      rememberMe: parsed.data.remember,
      userAgent: request.headers.get("user-agent"),
      ipAddress: ip,
    });

    await writeAuthAuditLog({
      actorId: user.id,
      action: "AUTH_LOGIN",
      metadata: { rememberMe: parsed.data.remember },
    });

    const expiresIn = Math.max(
      1,
      Math.floor((expiresAt.getTime() - Date.now()) / 1000),
    );

    const response = jsonSuccess({
      user: mapUserToAuthDTO(user),
      accessToken: token,
      expiresIn,
    });

    applySessionCookie(response, token, {
      rememberMe: parsed.data.remember,
      maxAgeSeconds: getSessionTtlSeconds(parsed.data.remember),
    });

    return response;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Variável de ambiente")
    ) {
      return jsonError(serviceUnavailableError("Banco de dados não configurado."));
    }

    if (
      error instanceof Error &&
      (error.name === "PrismaClientInitializationError" ||
        error.message.includes("Can't reach database"))
    ) {
      return jsonError(
        serviceUnavailableError(
          "Não foi possível conectar ao banco de dados. Verifique DATABASE_URL.",
        ),
      );
    }

    console.error("[auth/login]", error);
    return jsonError(internalError());
  }
}
