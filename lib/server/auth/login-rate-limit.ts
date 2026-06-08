import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";

type AttemptWindow = {
  count: number;
  resetAt: number;
};

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;

const attemptsByKey = new Map<string, AttemptWindow>();

function getAttemptKey(ip: string): string {
  return ip || "unknown";
}

export function checkLoginRateLimit(ip: string): ApiError | null {
  const key = getAttemptKey(ip);
  const now = Date.now();
  const current = attemptsByKey.get(key);

  if (!current || now >= current.resetAt) {
    return null;
  }

  if (current.count >= LOGIN_MAX_ATTEMPTS) {
    return {
      code: API_ERROR_CODES.RATE_LIMITED,
      message: "Muitas tentativas de login. Tente novamente em alguns minutos.",
      httpStatus: 429,
    };
  }

  return null;
}

export function recordFailedLoginAttempt(ip: string): void {
  const key = getAttemptKey(ip);
  const now = Date.now();
  const current = attemptsByKey.get(key);

  if (!current || now >= current.resetAt) {
    attemptsByKey.set(key, {
      count: 1,
      resetAt: now + LOGIN_WINDOW_MS,
    });
    return;
  }

  current.count += 1;
  attemptsByKey.set(key, current);
}

export function clearLoginAttempts(ip: string): void {
  attemptsByKey.delete(getAttemptKey(ip));
}
