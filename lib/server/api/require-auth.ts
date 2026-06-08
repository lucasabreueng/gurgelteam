import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { z } from "zod";

import { ADMIN_MODULE_KEYS } from "@/lib/contracts/enums";
import { prisma } from "@/lib/server/prisma";
import {
  extractSessionToken,
  resolveSessionAuth,
} from "@/lib/server/auth/session-service";
import {
  forbiddenError,
  jsonError,
  unauthorizedError,
} from "@/lib/server/api/responses";

export type ModuleAction = "view" | "edit" | "delete";

export type AuthContext = {
  user: User;
};

function isNextResponse(value: unknown): value is NextResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "headers" in value &&
    "status" in value
  );
}

export async function requireAuth(
  request: NextRequest,
): Promise<AuthContext | NextResponse> {
  const token = extractSessionToken(request);
  if (!token) {
    return jsonError(unauthorizedError());
  }

  const auth = await resolveSessionAuth(token);
  if (!auth) {
    return jsonError(unauthorizedError());
  }
  if (!auth.user.active) {
    return jsonError(forbiddenError("Conta inativa."));
  }
  return { user: auth.user };
}

export async function requireModulePermission(
  request: NextRequest,
  moduleKey: string,
  action: ModuleAction,
): Promise<AuthContext | NextResponse> {
  const token = extractSessionToken(request);
  if (!token) {
    return jsonError(unauthorizedError());
  }

  const auth = await resolveSessionAuth(token, moduleKey);
  const user = auth?.user;
  if (!user) {
    return jsonError(unauthorizedError());
  }
  if (!user.active) {
    return jsonError(forbiddenError("Conta inativa."));
  }

  const permission = user.modulePermissions[0];

  const allowed =
    action === "view"
      ? permission?.canView
      : action === "edit"
        ? permission?.canEdit
        : permission?.canDelete;

  if (!allowed) {
    if (
      auth.user.roleKey === "admin" &&
      auth.user.clientId === null &&
      (ADMIN_MODULE_KEYS as readonly string[]).includes(moduleKey)
    ) {
      return auth;
    }
    return jsonError(
      forbiddenError("Você não tem permissão para esta ação."),
    );
  }

  return { user };
}

/** Qualquer permissão de visualização em módulo admin (ex.: financeiro com alunos, sem dashboard explícito). */
export async function requireAnyAdminModulePermission(
  request: NextRequest,
  action: ModuleAction = "view",
): Promise<AuthContext | NextResponse> {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const permissions = await prisma.modulePermission.findMany({
    where: {
      userId: auth.user.id,
      moduleKey: { in: [...ADMIN_MODULE_KEYS] },
    },
  });

  const allowed = permissions.some((permission) =>
    action === "view"
      ? permission.canView
      : action === "edit"
        ? permission.canEdit
        : permission.canDelete,
  );

  if (!allowed) {
    // Conta staff com role admin sem permissões admin no banco (estado inconsistente).
    if (
      auth.user.roleKey === "admin" &&
      auth.user.clientId === null
    ) {
      return auth;
    }
    return jsonError(
      forbiddenError("Você não tem permissão para esta ação."),
    );
  }

  return auth;
}

export function parseSearchParams<T extends z.ZodType>(
  request: NextRequest,
  schema: T,
): z.infer<T> | NextResponse {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = schema.safeParse(params);
  if (!parsed.success) {
    return jsonError({
      code: "VALIDATION_ERROR",
      message: "Parâmetros de consulta inválidos.",
      details: parsed.error.flatten(),
      httpStatus: 400,
    });
  }
  return parsed.data;
}

export async function parseJsonBody<T extends z.ZodType>(
  request: NextRequest,
  schema: T,
): Promise<z.infer<T> | NextResponse> {
  let body: unknown;
  try {
    const text = await request.text();
    body = text.trim() ? JSON.parse(text) : {};
  } catch {
    return jsonError({
      code: "VALIDATION_ERROR",
      message: "Corpo da requisição inválido.",
      httpStatus: 400,
    });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError({
      code: "VALIDATION_ERROR",
      message: "Dados inválidos.",
      details: parsed.error.flatten(),
      httpStatus: 400,
    });
  }
  return parsed.data;
}

export { isNextResponse };
