import type { ProcessedTelemetrySession } from "../types";
import { openTelemetryDb, TELEMETRY_STORES } from "./telemetry-idb";

const STORE = TELEMETRY_STORES.sessions;
const INDEX_LIST = TELEMETRY_STORES.sessionsList;

type SessionListEntry = {
  id: string;
  dateLabel: string;
  trackName: string;
  sourceFileName: string;
  validLapCount: number;
  bestLapTime: number | null;
  createdAt: string;
};

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
  const db = await openTelemetryDb();
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
  const db = await openTelemetryDb();
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
  const db = await openTelemetryDb();
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
  const db = await openTelemetryDb();
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
