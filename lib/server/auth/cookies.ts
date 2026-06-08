import type { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/server/auth/constants";
import { getSessionTtlSeconds } from "@/lib/server/auth/session-token";

type CookieOptions = {
  rememberMe: boolean;
  maxAgeSeconds?: number;
};

export function buildSessionCookie(
  token: string,
  options: CookieOptions,
): string {
  const maxAge = options.maxAgeSeconds ?? getSessionTtlSeconds(options.rememberMe);
  const secure = process.env.NODE_ENV === "production";
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function buildSessionClearCookie(): string {
  const secure = process.env.NODE_ENV === "production";
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function applySessionCookie(
  response: NextResponse,
  token: string,
  options: CookieOptions,
): void {
  response.headers.append("Set-Cookie", buildSessionCookie(token, options));
}

export function clearSessionCookie(response: NextResponse): void {
  response.headers.append("Set-Cookie", buildSessionClearCookie());
}
