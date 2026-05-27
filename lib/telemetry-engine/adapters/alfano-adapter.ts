import type { ColumnMapping, RawCsvRow, TelemetryPoint } from "../types";
import {
  buildAlfanoSessionTimes,
  forwardFillAlfanoMarkerColumns,
} from "../csv/alfano-timeline";
import {
  buildColumnMapping,
  getRowValue,
  resolveHeaderAny,
} from "../csv/column-mapper";
import { parseGpsPair } from "../csv/gps-coords";
import { parseNumber } from "../csv/parse-csv";
import { headerMatchScore } from "./base-adapter";
import type { TelemetryAdapter } from "./base-adapter";

export { looksLikeAlfanoWallClockSeconds } from "../csv/session-time";

function normalizeAlfanoPoints(
  rows: RawCsvRow[],
  mapping: ColumnMapping,
): TelemetryPoint[] {
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  const lapCol = resolveHeaderAny(headers, ["Lap"]);
  const stripCol = resolveHeaderAny(headers, ["Strip"]);
  const timeLapCol = resolveHeaderAny(headers, ["Time Lap"]);
  const timeStripCol = resolveHeaderAny(headers, ["Time Strip"]);
  const absoluteCol =
    resolveHeaderAny(headers, ["Absolute Time"]) ??
    mapping.sessionTime;
  const relativeTimeCol = resolveHeaderAny(headers, ["Time", "Tempo"]);

  const rowCopies = rows.map((r) => ({ ...r }));
  forwardFillAlfanoMarkerColumns(rowCopies, [
    lapCol,
    stripCol,
    timeLapCol,
    timeStripCol,
  ]);

  const sessionTimes = buildAlfanoSessionTimes(
    rowCopies,
    absoluteCol,
    relativeTimeCol,
    lapCol,
  );

  const points: TelemetryPoint[] = [];

  for (let i = 0; i < rowCopies.length; i++) {
    const row = rowCopies[i];
    const latRaw = parseNumber(getRowValue(row, mapping.latitude));
    const lonRaw = parseNumber(getRowValue(row, mapping.longitude));
    const gps = parseGpsPair(latRaw, lonRaw);
    const timestamp = parseNumber(getRowValue(row, mapping.timestamp));

    const lapNum = parseNumber(getRowValue(row, lapCol));
    const stripNum = parseNumber(getRowValue(row, stripCol));

    points.push({
      index: i,
      timestamp,
      sessionTime: sessionTimes[i] ?? 0,
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
      lapNumber: lapNum,
      sectorNumber: stripNum != null && stripNum > 0 ? stripNum : null,
    });
  }

  return points;
}

export const alfanoAdapter: TelemetryAdapter = {
  id: "alfano",
  label: "Alfano",
  canParse(headers) {
    return headerMatchScore(headers, [
      "time lap",
      "absolute time",
      "strip",
      "speed gps",
      "gf. x",
      "gf. y",
      "lat.",
      "lon.",
    ]);
  },
  getMapping(headers, sampleRows) {
    return buildColumnMapping(
      headers,
      {
        /** Igual ao MyChron: eixo temporal contínuo — no Alfano é `Absolute Time`. */
        sessionTime: resolveHeaderAny(headers, [
          "Absolute Time",
          "Time",
          "Tempo",
        ]),
        latitude: resolveHeaderAny(headers, ["Lat.", "Lat", "Latitude"]),
        longitude: resolveHeaderAny(headers, ["Lon.", "Lon", "Longitude"]),
        speed: "Speed GPS",
        rpm: "RPM",
        longitudinalG: "Gf. X",
        lateralG: "Gf. Y",
        heading: "Orientation",
        altitude: "Altitude",
        rawDistance: "Distance",
      },
      sampleRows,
    );
  },
  normalize(rows, mapping) {
    return normalizeAlfanoPoints(rows, mapping);
  },
};
