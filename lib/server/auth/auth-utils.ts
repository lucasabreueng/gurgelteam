import type { Prisma } from "@prisma/client";
import type { NextRequest } from "next/server";

import { normalizeUsername } from "@/lib/auth-accounts-mocks";
import { prisma } from "@/lib/server/prisma";

export async function findUserByIdentifier(identifier: string) {
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  if (trimmed.includes("@")) {
    return prisma.user.findUnique({
      where: { email: trimmed.toLowerCase() },
    });
  }

  return prisma.user.findUnique({
    where: { username: normalizeUsername(trimmed) },
  });
}

export async function writeAuthAuditLog(params: {
  actorId: string | null;
  action: "AUTH_LOGIN" | "AUTH_LOGOUT" | "AUTH_PASSWORD_RESET";
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      moduleKey: "configuracoes",
      metadata: (params.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
