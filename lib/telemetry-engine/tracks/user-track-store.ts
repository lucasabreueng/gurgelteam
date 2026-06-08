import type { UserTrackRecord } from "./user-track-types";
import { openTelemetryDb, TELEMETRY_STORES } from "../storage/telemetry-idb";

const STORE = TELEMETRY_STORES.userTracks;

export async function listUserTracks(): Promise<UserTrackRecord[]> {
  const db = await openTelemetryDb();
  const list = await new Promise<UserTrackRecord[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => {
      const rows = (req.result as UserTrackRecord[]).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      resolve(rows);
    };
    req.onerror = () => reject(req.error);
  });
  db.close();
  return list;
}

export async function getUserTrack(id: string): Promise<UserTrackRecord | null> {
  const db = await openTelemetryDb();
  const row = await new Promise<UserTrackRecord | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return row;
}

export async function saveUserTrack(record: UserTrackRecord): Promise<void> {
  const db = await openTelemetryDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).put(record);
  });
  db.close();
}

export async function deleteUserTrack(id: string): Promise<void> {
  const db = await openTelemetryDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).delete(id);
  });
  db.close();
}
