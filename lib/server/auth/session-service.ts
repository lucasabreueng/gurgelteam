import type { NextRequest } from "next/server";
import type { ModulePermission, User } from "@prisma/client";

import { prisma } from "@/lib/server/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/server/auth/constants";
import {
  generateSessionToken,
  getSessionExpiresAt,
  hashSessionToken,
} from "@/lib/server/auth/session-token";

export type SessionAuthUser = User & {
  modulePermissions: ModulePermission[];
};

export type SessionAuthResult = {
  user: SessionAuthUser;
};

function extractBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

export function extractSessionToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (cookieToken) return cookieToken;
  return extractBearerToken(request);
}

/** Sessão + usuário (+ permissão opcional do módulo) em uma única query. */
export async function resolveSessionAuth(
  token: string,
  moduleKey?: string,
): Promise<SessionAuthResult | null> {
  const session = await prisma.session.findFirst({
    where: {
      tokenHash: hashSessionToken(token),
      expiresAt: { gt: new Date() },
    },
    include: {
      user: moduleKey
        ? {
            include: {
              modulePermissions: { where: { moduleKey } },
            },
          }
        : true,
    },
  });

  if (!session?.user) return null;

  const { user } = session;
  const modulePermissions: ModulePermission[] =
    moduleKey && "modulePermissions" in user
      ? (user as User & { modulePermissions: ModulePermission[] })
          .modulePermissions
      : [];

  return {
    user: {
      ...user,
      modulePermissions,
    },
  };
}

export async function findUserBySessionToken(
  token: string,
): Promise<User | null> {
  const auth = await resolveSessionAuth(token);
  return auth?.user ?? null;
}

export async function getCurrentUser(
  request: NextRequest,
): Promise<User | null> {
  const token = extractSessionToken(request);
  if (!token) return null;
  return findUserBySessionToken(token);
}

export async function createSession(params: {
  userId: string;
  rememberMe: boolean;
  userAgent?: string | null;
  ipAddress?: string | null;
}): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSessionToken();
  const expiresAt = getSessionExpiresAt(params.rememberMe);

  await prisma.session.create({
    data: {
      userId: params.userId,
      tokenHash: hashSessionToken(token),
      expiresAt,
      rememberMe: params.rememberMe,
      userAgent: params.userAgent ?? null,
      ipAddress: params.ipAddress ?? null,
    },
  });

  return { token, expiresAt };
}

export async function revokeSession(token: string): Promise<void> {
  const tokenHash = hashSessionToken(token);
  await prisma.session.deleteMany({ where: { tokenHash } });
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}
