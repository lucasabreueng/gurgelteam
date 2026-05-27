import type { ProcessedTelemetrySession } from "../types";

const DB_NAME = "gurgel-telemetry";
const DB_VERSION = 2;
const STORE = "sessions";
const INDEX_LIST = "sessions-list";

type SessionListEntry = {
  id: string;
  dateLabel: string;
  trackName: string;
  sourceFileName: string;
  validLapCount: number;
  bestLapTime: number | null;
  createdAt: string;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB indisponível neste ambiente."));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error("Falha ao abrir IndexedDB"));
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(INDEX_LIST)) {
        db.createObjectStore(INDEX_LIST, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("user-tracks")) {
        db.createObjectStore("user-tracks", { keyPath: "id" });
      }
    };
  });
}

function toListEntry(session: ProcessedTelemetrySession): SessionListEntry {
  return {
    id: session.id,
    dateLabel: session.dateLabel,
    trackName: session.trackName,
    sourceFileName: session.sourceFileName,
    validLapCount: session.meta.validLapCount,
    bestLapTime: session.meta.bestLapTime,
    createdAt: session.createdAt,
  };
}

export async function saveProcessedSession(
  session: ProcessedTelemetrySession,
): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE, INDEX_LIST], "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).put(session);
    tx.objectStore(INDEX_LIST).put(toListEntry(session));
  });
  db.close();
}

export async function getProcessedSession(
  id: string,
): Promise<ProcessedTelemetrySession | null> {
  const db = await openDb();
  const session = await new Promise<ProcessedTelemetrySession | null>(
    (resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(id);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    },
  );
  db.close();
  return session;
}

export async function listProcessedSessions(): Promise<SessionListEntry[]> {
  const db = await openDb();
  const list = await new Promise<SessionListEntry[]>((resolve, reject) => {
    const tx = db.transaction(INDEX_LIST, "readonly");
    const req = tx.objectStore(INDEX_LIST).getAll();
    req.onsuccess = () => {
      const entries = (req.result as SessionListEntry[]).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      resolve(entries);
    };
    req.onerror = () => reject(req.error);
  });
  db.close();
  return list;
}

export async function deleteProcessedSession(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE, INDEX_LIST], "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).delete(id);
    tx.objectStore(INDEX_LIST).delete(id);
  });
  db.close();
}

export function isProcessedSessionId(id: string): boolean {
  return id.startsWith("proc-");
}

export type { SessionListEntry };
