import type {
  GpsLine,
  LineCrossing,
  RawCsvRow,
  SessionLap,
  TelemetryPoint,
  Track,
} from "../types";
import { getRowValue, resolveHeaderAny } from "../csv/column-mapper";
import { parseNumber } from "../csv/parse-csv";
import { readAlfanoAbsoluteTimeSeconds } from "../csv/alfano-timeline";
import {
  buildLineDefinitions,
  detectLineCrossings,
} from "../geometry/line-crossing";
import type { ReconstructResult } from "./reconstruct";
import {
  assignLapDistances,
  buildSectorsForLap,
  findPointIndexAtTime,
  MIN_LAP_TIME_SEC,
} from "./reconstruct";

/** Volta de kart válida; acima disso trata como pit/out (ex. 3'00 no Alfano). */
export const ALFANO_MAX_VALID_LAP_SEC = 120;

export type AlfanoLapMarker = {
  lapNumber: number;
  rowIndex: number;
  sessionTime: number;
  timeLap: number | null;
  timeStrip: number | null;
  strip: number | null;
};

export function extractAlfanoLapMarkers(
  rows: RawCsvRow[],
  headers: string[],
): AlfanoLapMarker[] {
  const lapCol = resolveHeaderAny(headers, ["Lap"]);
  const timeLapCol = resolveHeaderAny(headers, ["Time Lap"]);
  const absCol = resolveHeaderAny(headers, ["Absolute Time"]);
  const stripCol = resolveHeaderAny(headers, ["Strip"]);
  const timeStripCol = resolveHeaderAny(headers, ["Time Strip"]);

  if (!lapCol || !absCol) return [];

  const markers: AlfanoLapMarker[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const lapRaw = getRowValue(row, lapCol).trim();
    if (!lapRaw || /pit/i.test(lapRaw)) continue;

    const lapNum = parseNumber(lapRaw);
    if (lapNum == null || lapNum < 1 || !Number.isFinite(lapNum)) continue;

    const sessionTime = readAlfanoAbsoluteTimeSeconds(row, absCol, i);
    if (sessionTime == null) continue;

    const prev = markers[markers.length - 1];
    if (prev && Math.abs(prev.sessionTime - sessionTime) < 0.001) continue;

    markers.push({
      lapNumber: Math.round(lapNum),
      rowIndex: i,
      sessionTime,
      timeLap: parseNumber(getRowValue(row, timeLapCol)),
      timeStrip: parseNumber(getRowValue(row, timeStripCol)),
      strip: parseNumber(getRowValue(row, stripCol)),
    });
  }

  markers.sort((a, b) => a.rowIndex - b.rowIndex);
  return markers;
}

function findEndIndexForLap(
  points: TelemetryPoint[],
  endMarkerRowIndex: number,
  endTime: number,
): number {
  const beforeMarker = Math.max(0, endMarkerRowIndex - 1);
  for (let i = beforeMarker; i >= 0; i--) {
    if (points[i].sessionTime <= endTime + 0.001) return i;
  }
  return findPointIndexAtTime(points, endTime);
}

function sectorCrossingsInRange(
  crossings: LineCrossing[],
  startTime: number,
  endTime: number,
): { s2: number | null; s3: number | null } {
  let s2: number | null = null;
  let s3: number | null = null;

  for (const c of crossings) {
    if (c.sessionTime <= startTime || c.sessionTime > endTime) continue;
    if (c.lineId === "sector_1" && s2 == null) s2 = c.sessionTime;
    else if (c.lineId === "sector_2" && s2 != null && s3 == null) s3 = c.sessionTime;
  }

  return { s2, s3 };
}

function buildLapFromSegment(
  points: TelemetryPoint[],
  lapNumber: number,
  startMarker: AlfanoLapMarker,
  endMarker: AlfanoLapMarker,
  crossings: LineCrossing[],
): SessionLap {
  const startTime = startMarker.sessionTime;
  const endTime = endMarker.sessionTime;
  const startIndex = startMarker.rowIndex;
  const endIndex = findEndIndexForLap(points, endMarker.rowIndex, endTime);

  let lapTime = Math.max(0, endTime - startTime);
  const fileLapTime = endMarker.timeLap;
  if (
    fileLapTime != null &&
    fileLapTime > 0 &&
    Math.abs(fileLapTime - lapTime) < 2
  ) {
    lapTime = fileLapTime;
  }

  const { s2, s3 } = sectorCrossingsInRange(crossings, startTime, endTime);
  const sectors = buildSectorsForLap(points, startTime, endTime, s2, s3);

  const isPitOrOut = lapTime > ALFANO_MAX_VALID_LAP_SEC;
  const tooShort = lapTime < MIN_LAP_TIME_SEC;
  const isValid = !isPitOrOut && !tooShort && sectors.length > 0;

  return {
    lapNumber,
    lapTime,
    sectors,
    isValid,
    isOutLap: isPitOrOut,
    isIncomplete: tooShort || sectors.length === 0,
    startTime,
    endTime,
    startIndex,
    endIndex,
  };
}

function buildTailLap(
  points: TelemetryPoint[],
  lastMarker: AlfanoLapMarker,
  crossings: LineCrossing[],
): SessionLap | null {
  const lastPoint = points[points.length - 1];
  if (!lastPoint) return null;

  const startTime = lastMarker.sessionTime;
  const endTime = lastPoint.sessionTime;
  const lapTime = endTime - startTime;
  if (lapTime < MIN_LAP_TIME_SEC * 0.5) return null;

  const endMarker: AlfanoLapMarker = {
    lapNumber: lastMarker.lapNumber,
    rowIndex: lastPoint.index,
    sessionTime: endTime,
    timeLap: lapTime,
    timeStrip: null,
    strip: null,
  };

  return buildLapFromSegment(
    points,
    lastMarker.lapNumber,
    lastMarker,
    endMarker,
    crossings,
  );
}

export function buildLapsFromAlfanoMarkers(
  points: TelemetryPoint[],
  markers: AlfanoLapMarker[],
  crossings: LineCrossing[],
): SessionLap[] {
  if (markers.length < 2) return [];

  const laps: SessionLap[] = [];

  for (let k = 0; k < markers.length - 1; k++) {
    const lapNumber = markers[k].lapNumber;
    if (lapNumber < 1) continue;

    laps.push(
      buildLapFromSegment(
        points,
        lapNumber,
        markers[k],
        markers[k + 1],
        crossings,
      ),
    );
  }

  const tail = buildTailLap(points, markers[markers.length - 1], crossings);
  if (tail) laps.push(tail);

  return laps;
}

function assignSectorNumbers(
  points: TelemetryPoint[],
  laps: SessionLap[],
): void {
  for (const lap of laps) {
    if (lap.isOutLap) continue;
    for (const sector of lap.sectors) {
      for (let i = lap.startIndex; i <= lap.endIndex && i < points.length; i++) {
        const t = points[i].sessionTime;
        if (t >= sector.startTime && t < sector.endTime) {
          points[i].sectorNumber = sector.sector;
        }
      }
    }
  }
}

export function reconstructAlfanoLapsAndSectors(
  rawPoints: TelemetryPoint[],
  markers: AlfanoLapMarker[],
  lines: { startFinishLine: GpsLine; sectors: Track["sectors"] },
): ReconstructResult {
  const lineDefs = buildLineDefinitions(
    lines.startFinishLine,
    lines.sectors,
  );
  const crossings = detectLineCrossings(rawPoints, lineDefs, {
    minIntervalSec: 3,
    startFinishMinIntervalSec: 12,
  });

  const points: TelemetryPoint[] = rawPoints.map((p) => ({
    ...p,
    lapDistance: null,
    lapNumber: null,
    sectorNumber: null,
  }));

  const laps = buildLapsFromAlfanoMarkers(points, markers, crossings);

  for (const lap of laps) {
    if (lap.isOutLap) continue;
    for (let pi = lap.startIndex; pi <= lap.endIndex && pi < points.length; pi++) {
      points[pi].lapNumber = lap.lapNumber;
    }
  }

  assignSectorNumbers(points, laps);
  assignLapDistances(points, laps);

  return { points, laps, crossings };
}
