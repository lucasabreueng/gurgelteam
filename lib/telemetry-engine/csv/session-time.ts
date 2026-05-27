import { parseNumber } from "./parse-csv";

/** Valores no formato relógio HHMMSS (ex.: 115809 = 11:58:09 UTC) — não usar como tempo de sessão. */
export function looksLikeAlfanoWallClockSeconds(value: number): boolean {
  if (!Number.isFinite(value) || value < 10_000 || value >= 240_000) {
    return false;
  }
  const hours = Math.floor(value / 10_000);
  const mins = Math.floor((value % 10_000) / 100);
  const secs = value % 100;
  return hours < 24 && mins < 60 && secs < 60;
}

export function parseSessionTime(raw: string, index: number): number {
  const trimmed = raw.trim();
  if (!trimmed) return index * 0.05;

  const n = parseNumber(trimmed);
  if (n != null && !looksLikeAlfanoWallClockSeconds(n)) return n;

  const parts = trimmed.split(":");
  if (parts.length === 3) {
    const h = parseNumber(parts[0]) ?? 0;
    const m = parseNumber(parts[1]) ?? 0;
    const s = parseNumber(parts[2]) ?? 0;
    const total = h * 3600 + m * 60 + s;
    if (total > 0) return total;
  }
  if (parts.length === 2) {
    const m = parseNumber(parts[0]) ?? 0;
    const s = parseNumber(parts[1]) ?? 0;
    const total = m * 60 + s;
    if (total > 0) return total;
  }
  return index * 0.05;
}
