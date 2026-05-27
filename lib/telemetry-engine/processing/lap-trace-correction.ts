import type {
  GpsLine,
  LapManualCorrection,
  SessionLap,
  TelemetryPoint,
  Track,
} from "../types";
import { buildLineDefinitions } from "../geometry/line-crossing";
import {
  extendLineSegment,
  interpolateCrossing,
  isValidGps,
  segmentsCross,
} from "../geometry/geo";
import { buildSectorsForLap, MIN_LAP_TIME_SEC } from "./reconstruct";
import { diagnoseLapSectorIssues } from "./lap-quality";

const GATE_EXTEND_METERS = 8;

function sectorLine(
  lines: { startFinishLine: GpsLine; sectors: Track["sectors"] },
  sector: 1 | 2 | 3,
): GpsLine | undefined {
  const s = lines.sectors.find((x) => x.sector === sector);
  return s?.endLine;
}

function findStrictCrossingInRange(
  points: TelemetryPoint[],
  startIndex: number,
  endIndex: number,
  line: GpsLine,
  afterTime: number,
  beforeTime: number,
): number | null {
  const gate = extendLineSegment(
    line.latA,
    line.lonA,
    line.latB,
    line.lonB,
    GATE_EXTEND_METERS,
  );

  const i0 = Math.max(1, startIndex + 1);
  const i1 = Math.min(endIndex, points.length - 1);

  for (let i = i0; i <= i1; i++) {
    const p1 = points[i - 1];
    const p2 = points[i];
    if (
      !isValidGps(p1.latitude, p1.longitude) ||
      !isValidGps(p2.latitude, p2.longitude) ||
      p2.sessionTime <= afterTime + 0.001 ||
      p2.sessionTime >= beforeTime - 0.001
    ) {
      continue;
    }

    if (
      segmentsCross(
        p1.latitude,
        p1.longitude,
        p2.latitude,
        p2.longitude,
        gate.latA,
        gate.lonA,
        gate.latB,
        gate.lonB,
      )
    ) {
      const hit = interpolateCrossing(
        p1.latitude,
        p1.longitude,
        p1.sessionTime,
        p2.latitude,
        p2.longitude,
        p2.sessionTime,
        line.latA,
        line.lonA,
        line.latB,
        line.lonB,
      );
      return hit.sessionTime;
    }
  }

  return null;
}

export function lapTrailCentroid(
  points: TelemetryPoint[],
  lap: SessionLap,
): { lat: number; lng: number } | null {
  let sumLat = 0;
  let sumLon = 0;
  let n = 0;
  for (let i = lap.startIndex; i <= lap.endIndex && i < points.length; i++) {
    const p = points[i];
    if (!isValidGps(p.latitude, p.longitude)) continue;
    sumLat += p.latitude;
    sumLon += p.longitude;
    n += 1;
  }
  if (n === 0) return null;
  return { lat: sumLat / n, lng: sumLon / n };
}

export function lapTrailPath(
  points: TelemetryPoint[],
  lap: SessionLap,
  offset?: { dLat: number; dLon: number },
): { lat: number; lng: number }[] {
  const path: { lat: number; lng: number }[] = [];
  const dLat = offset?.dLat ?? 0;
  const dLon = offset?.dLon ?? 0;
  for (let i = lap.startIndex; i <= lap.endIndex && i < points.length; i++) {
    const p = points[i];
    if (!isValidGps(p.latitude, p.longitude)) continue;
    // Deslocamento rígido do trecho (somente os pontos da volta).
    path.push({ lat: p.latitude + dLat, lng: p.longitude + dLon });
  }
  return path;
}

export function previewLapWithTraceOffset(
  points: TelemetryPoint[],
  lap: SessionLap,
  offset: { dLat: number; dLon: number },
  lines: { startFinishLine: GpsLine; sectors: Track["sectors"] },
): SessionLap {
  // Observação: TrackSectorConfig.sector=1 costuma ser o fim do setor 1 (linha S2),
  // e sector=2 o fim do setor 2 (linha S3). S1 é startFinishLine.
  const lineS2 = sectorLine(lines, 1);
  const lineS3 = sectorLine(lines, 2);
  if (!lineS2 || !lineS3) return lap;

  const slice: TelemetryPoint[] = points.map((p, idx) => {
    if (idx < lap.startIndex || idx > lap.endIndex) return p;
    if (!isValidGps(p.latitude, p.longitude)) return p;
    return {
      ...p,
      latitude: p.latitude + offset.dLat,
      longitude: p.longitude + offset.dLon,
    };
  });

  const s2Time = findStrictCrossingInRange(
    slice,
    lap.startIndex,
    lap.endIndex,
    lineS2,
    lap.startTime,
    lap.endTime,
  );
  const s3Time =
    s2Time != null
      ? findStrictCrossingInRange(
          slice,
          lap.startIndex,
          lap.endIndex,
          lineS3,
          s2Time,
          lap.endTime,
        )
      : null;

  const sectors = buildSectorsForLap(
    slice,
    lap.startTime,
    lap.endTime,
    s2Time,
    s3Time,
  );
  const hasThree = sectors.length === 3;
  const isValid =
    hasThree &&
    lap.lapTime >= MIN_LAP_TIME_SEC &&
    sectors.every((s) => s.sectorTime > 0.5);

  return {
    ...lap,
    sectors,
    isValid,
    isIncomplete: !hasThree,
  };
}

export function applyTraceOffsetToLapPoints(
  points: TelemetryPoint[],
  lap: SessionLap,
  dLat: number,
  dLon: number,
): void {
  for (let i = lap.startIndex; i <= lap.endIndex && i < points.length; i++) {
    const p = points[i];
    if (!isValidGps(p.latitude, p.longitude)) continue;
    p.latitude += dLat;
    p.longitude += dLon;
  }
}

export function applyTraceCorrectionToLap(
  points: TelemetryPoint[],
  lap: SessionLap,
  correction: Extract<LapManualCorrection["action"], { type: "trace_offset" }>,
  lines: { startFinishLine: GpsLine; sectors: Track["sectors"] },
): SessionLap {
  applyTraceOffsetToLapPoints(
    points,
    lap,
    correction.dLat,
    correction.dLon,
  );
  return previewLapWithTraceOffset(
    points,
    lap,
    { dLat: 0, dLon: 0 },
    lines,
  );
}

export function applyAllTraceCorrections(
  points: TelemetryPoint[],
  laps: SessionLap[],
  corrections: LapManualCorrection[],
  lines: { startFinishLine: GpsLine; sectors: Track["sectors"] },
): SessionLap[] {
  const byLap = new Map(corrections.map((c) => [c.lapNumber, c]));

  return laps.map((lap) => {
    const correction = byLap.get(lap.lapNumber);
    if (!correction) return lap;
    if (correction.action.type === "exclude") {
      return { ...lap, isValid: false, isIncomplete: true };
    }
    if (correction.action.type === "trace_offset") {
      return applyTraceCorrectionToLap(points, lap, correction.action, lines);
    }
    return lap;
  });
}

export function reassignPointsFromLaps(
  points: TelemetryPoint[],
  laps: SessionLap[],
): void {
  for (const p of points) {
    p.lapNumber = null;
    p.sectorNumber = null;
  }

  for (const lap of laps) {
    if (lap.isOutLap) continue;
    for (let i = lap.startIndex; i <= lap.endIndex && i < points.length; i++) {
      points[i].lapNumber = lap.lapNumber;
      const t = points[i].sessionTime;
      for (const sector of lap.sectors) {
        if (t >= sector.startTime && t < sector.endTime) {
          points[i].sectorNumber = sector.sector;
        }
      }
    }
  }
}

export function commitTraceCorrectionsToPreview(
  points: TelemetryPoint[],
  laps: SessionLap[],
  corrections: LapManualCorrection[],
  lines: { startFinishLine: GpsLine; sectors: Track["sectors"] },
): {
  laps: SessionLap[];
  lapIssues: ReturnType<typeof diagnoseLapSectorIssues>;
} {
  const nextLaps = applyAllTraceCorrections(points, laps, corrections, lines);
  reassignPointsFromLaps(points, nextLaps);
  return {
    laps: nextLaps,
    lapIssues: diagnoseLapSectorIssues(nextLaps),
  };
}
