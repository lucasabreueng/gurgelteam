import type { RawCsvRow } from "../types";
import { getRowValue } from "./column-mapper";
import { parseNumber } from "./parse-csv";
import {
  looksLikeAlfanoWallClockSeconds,
  parseSessionTime,
} from "./session-time";

const SAMPLE_STEP_SEC = 0.01;

export function readAlfanoRowTimeSeconds(
  row: RawCsvRow,
  timeCol: string | undefined,
  index: number,
): number | null {
  const timeRaw = getRowValue(row, timeCol).trim();
  if (!timeRaw) return null;
  const n = parseNumber(timeRaw);
  if (n != null && !looksLikeAlfanoWallClockSeconds(n)) return n;
  const parsed = parseSessionTime(timeRaw, index);
  if (!looksLikeAlfanoWallClockSeconds(parsed)) return parsed;
  return null;
}

export function readAlfanoAbsoluteTimeSeconds(
  row: RawCsvRow,
  absoluteCol: string | undefined,
  index: number,
): number | null {
  const raw = getRowValue(row, absoluteCol).trim();
  if (!raw) return null;
  const n = parseNumber(raw);
  if (n != null && !looksLikeAlfanoWallClockSeconds(n)) return n;
  const parsed = parseSessionTime(raw, index);
  if (!looksLikeAlfanoWallClockSeconds(parsed)) return parsed;
  return null;
}

/**
 * Alfano: `Absolute Time` = tempo de sessão (como `Time` no MyChron).
 * `Time` = tempo relativo à volta; só entra se `Absolute Time` estiver vazio.
 */
export function buildAlfanoSessionTimes(
  rows: RawCsvRow[],
  absoluteCol: string | undefined,
  relativeTimeCol: string | undefined,
  lapCol: string | undefined,
): number[] {
  const times: number[] = [];
  let lastSession = 0;
  let lapBase = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const isLapMarker = Boolean(lapCol && getRowValue(row, lapCol).trim());

    const absolute = readAlfanoAbsoluteTimeSeconds(row, absoluteCol, i);
    const relative = readAlfanoRowTimeSeconds(row, relativeTimeCol, i);

    if (isLapMarker && absolute != null) {
      lapBase = absolute;
    }

    let sessionTime: number;
    if (absolute != null) {
      sessionTime = absolute;
    } else if (relative != null) {
      sessionTime = lapBase + relative;
    } else {
      sessionTime = lastSession + SAMPLE_STEP_SEC;
    }

    if (sessionTime <= lastSession && i > 0) {
      sessionTime = lastSession + SAMPLE_STEP_SEC;
    }

    times.push(sessionTime);
    lastSession = sessionTime;
  }

  return times;
}

export function forwardFillAlfanoMarkerColumns(
  rows: RawCsvRow[],
  columns: (string | undefined)[],
): void {
  const lastValues = new Map<string, string>();

  for (const row of rows) {
    for (const col of columns) {
      if (!col) continue;
      const raw = getRowValue(row, col).trim();
      if (raw) {
        lastValues.set(col, raw);
        row[col] = raw;
      } else if (lastValues.has(col)) {
        row[col] = lastValues.get(col)!;
      }
    }
  }
}
