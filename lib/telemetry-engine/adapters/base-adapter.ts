import type { ColumnMapping, RawCsvRow, TelemetryPoint } from "../types";
import { buildColumnMapping, getRowValue } from "../csv/column-mapper";
import { parseGpsPair } from "../csv/gps-coords";
import { parseNumber } from "../csv/parse-csv";
import { parseSessionTime } from "../csv/session-time";

export { parseSessionTime } from "../csv/session-time";

export type TelemetryAdapter = {
  id: string;
  label: string;
  canParse(headers: string[], sampleRows: RawCsvRow[]): number;
  getMapping(headers: string[], sampleRows?: RawCsvRow[]): ColumnMapping;
  normalize(rows: RawCsvRow[], mapping: ColumnMapping): TelemetryPoint[];
};

export function rowsToPoints(
  rows: RawCsvRow[],
  mapping: ColumnMapping,
): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  let lastValidTime = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const latRaw = parseNumber(getRowValue(row, mapping.latitude));
    const lonRaw = parseNumber(getRowValue(row, mapping.longitude));
    const gps = parseGpsPair(latRaw, lonRaw);

    let sessionTime = parseSessionTime(
      getRowValue(row, mapping.sessionTime),
      i,
    );
    if (sessionTime <= lastValidTime && i > 0) {
      sessionTime = lastValidTime + 0.05;
    }
    lastValidTime = sessionTime;

  const timestamp = parseNumber(getRowValue(row, mapping.timestamp));

    points.push({
      index: i,
      timestamp,
      sessionTime,
      latitude: gps?.latitude ?? NaN,
      longitude: gps?.longitude ?? NaN,
      speed: parseNumber(getRowValue(row, mapping.speed)),
      rpm: parseNumber(getRowValue(row, mapping.rpm)),
      longitudinalG: parseNumber(getRowValue(row, mapping.longitudinalG)),
      lateralG: parseNumber(getRowValue(row, mapping.lateralG)),
      gyro: parseNumber(getRowValue(row, mapping.gyro)),
      heading: parseNumber(getRowValue(row, mapping.heading)),
      altitude: parseNumber(getRowValue(row, mapping.altitude)),
      rawDistance: parseNumber(getRowValue(row, mapping.rawDistance)),
      lapDistance: null,
      lapNumber: null,
      sectorNumber: null,
    });
  }

  return points;
}

export function headerMatchScore(
  headers: string[],
  signals: string[],
): number {
  const joined = headers.map((h) => h.toLowerCase()).join(" ");
  let score = 0;
  for (const s of signals) {
    if (joined.includes(s.toLowerCase())) score++;
  }
  return score;
}

export function createAdapter(
  id: string,
  label: string,
  signals: string[],
  mappingOverrides?: Partial<ColumnMapping>,
): TelemetryAdapter {
  return {
    id,
    label,
    canParse(headers) {
      return headerMatchScore(headers, signals);
    },
    getMapping(headers, sampleRows) {
      return buildColumnMapping(headers, mappingOverrides, sampleRows);
    },
    normalize(rows, mapping) {
      return rowsToPoints(rows, mapping);
    },
  };
}
