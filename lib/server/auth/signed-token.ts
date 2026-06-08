import { createHmac, timingSafeEqual } from "crypto";

import { getSessionSecret } from "@/lib/server/env";

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

function getResetSecret(): string {
  return getSessionSecret();
}

export function createSignedResetToken(
  payload: {
    resetId: string;
    userId: string;
  },
  ttlMs: number = RESET_TOKEN_TTL_MS,
): string {
  const expiresAt = Date.now() + ttlMs;
  const body = `${payload.resetId}.${payload.userId}.${expiresAt}`;
  const signature = createHmac("sha256", getResetSecret())
    .update(body)
    .digest("base64url");
  return `${body}.${signature}`;
}

export function verifySignedResetToken(token: string): {
  resetId: string;
  userId: string;
} | null {
  const parts = token.split(".");
  if (parts.length !== 4) return null;

  const [resetId, userId, expiresRaw, signature] = parts;
  if (!resetId || !userId || !expiresRaw || !signature) return null;

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  const body = `${resetId}.${userId}.${expiresRaw}`;
  const expected = createHmac("sha256", getResetSecret())
    .update(body)
    .digest("base64url");

  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return null;
  }

  return { resetId, userId };
}

export function hashRecoveryCode(code: string): string {
  return createHmac("sha256", getResetSecret()).update(code).digest("hex");
}

export function generateRecoveryCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
