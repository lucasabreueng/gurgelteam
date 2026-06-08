import { isStoredTelemetrySessionId } from "@/lib/telemetry-api-session";

const STORAGE_KEY = "gurgel-telemetry-active-session";

/** Nenhuma sessão selecionada — não exibir dados mockados. */
export const TELEMETRY_NO_SESSION = "";

export function getStoredTelemetrySessionId(): string {
  if (typeof window === "undefined") return TELEMETRY_NO_SESSION;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return TELEMETRY_NO_SESSION;
  if (isStoredTelemetrySessionId(stored)) return stored;
  sessionStorage.removeItem(STORAGE_KEY);
  return TELEMETRY_NO_SESSION;
}

export function setStoredTelemetrySessionId(sessionId: string): void {
  if (typeof window === "undefined") return;
  if (!sessionId) {
    sessionStorage.removeItem(STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(STORAGE_KEY, sessionId);
}
