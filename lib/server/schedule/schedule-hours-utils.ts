import { randomUUID } from "crypto";

export function isPersistedUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );
}

export function resolvePersistedId(id: string): string {
  return isPersistedUuid(id) ? id : randomUUID();
}

export function isoDateToDbDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000-03:00`);
}

export function dbDateToIsoDate(date: Date): string {
  // DATE do Postgres chega como meia-noite UTC — não aplicar fuso operacional.
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function normalizeLevelId(levelId: string): string {
  return levelId.startsWith("lvl-") ? levelId.slice(4) : levelId;
}
