import { createHash, randomBytes } from "crypto";

export { SESSION_COOKIE_NAME } from "@/lib/server/auth/constants";

const REMEMBER_TTL_SECONDS = 30 * 24 * 60 * 60;
const DEFAULT_TTL_SECONDS = 24 * 60 * 60;

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function getSessionTtlSeconds(rememberMe: boolean): number {
  return rememberMe ? REMEMBER_TTL_SECONDS : DEFAULT_TTL_SECONDS;
}

export function getSessionExpiresAt(rememberMe: boolean): Date {
  const ttl = getSessionTtlSeconds(rememberMe);
  return new Date(Date.now() + ttl * 1000);
}
