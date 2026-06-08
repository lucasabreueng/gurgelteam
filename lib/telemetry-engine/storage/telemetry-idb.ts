/** Banco IndexedDB compartilhado entre sessões de telemetria e pistas do usuário. */
export const TELEMETRY_DB_NAME = "gurgel-telemetry";
export const TELEMETRY_DB_VERSION = 3;

export const TELEMETRY_STORES = {
  sessions: "sessions",
  sessionsList: "sessions-list",
  userTracks: "user-tracks",
} as const;

function ensureStores(db: IDBDatabase): void {
  if (!db.objectStoreNames.contains(TELEMETRY_STORES.sessions)) {
    db.createObjectStore(TELEMETRY_STORES.sessions, { keyPath: "id" });
  }
  if (!db.objectStoreNames.contains(TELEMETRY_STORES.sessionsList)) {
    db.createObjectStore(TELEMETRY_STORES.sessionsList, { keyPath: "id" });
  }
  if (!db.objectStoreNames.contains(TELEMETRY_STORES.userTracks)) {
    db.createObjectStore(TELEMETRY_STORES.userTracks, { keyPath: "id" });
  }
}

export function openTelemetryDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB indisponível neste ambiente."));
      return;
    }
    const req = indexedDB.open(TELEMETRY_DB_NAME, TELEMETRY_DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error("Falha ao abrir IndexedDB"));
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      ensureStores(req.result);
    };
  });
}
