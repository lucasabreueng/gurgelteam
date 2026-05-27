import { StudentAreaRepositoryMock } from "@/repositories/student/StudentAreaRepositoryMock";

const STORAGE_KEY = "gurgel-telemetry-active-session";

function defaultSessionId(): string {
  return StudentAreaRepositoryMock.getTelemetryDefaultSessionId();
}

export function getStoredTelemetrySessionId(): string {
  if (typeof window === "undefined") return defaultSessionId();
  return sessionStorage.getItem(STORAGE_KEY) ?? defaultSessionId();
}

export function setStoredTelemetrySessionId(sessionId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, sessionId);
}
