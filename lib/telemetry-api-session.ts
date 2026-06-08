/** Prefixo no sessionStorage para sessões carregadas da API (UUID após o prefixo). */
export const API_SESSION_STORAGE_PREFIX = "api:";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isApiSessionId(sessionId: string): boolean {
  return sessionId.startsWith(API_SESSION_STORAGE_PREFIX);
}

export function toApiSessionStorageId(uuid: string): string {
  return `${API_SESSION_STORAGE_PREFIX}${uuid}`;
}

export function parseApiSessionUuid(sessionId: string): string | null {
  if (!isApiSessionId(sessionId)) return null;
  const uuid = sessionId.slice(API_SESSION_STORAGE_PREFIX.length);
  return UUID_RE.test(uuid) ? uuid : null;
}

export function isStoredTelemetrySessionId(sessionId: string): boolean {
  return (
    sessionId.startsWith("proc-") || isApiSessionId(sessionId)
  );
}
