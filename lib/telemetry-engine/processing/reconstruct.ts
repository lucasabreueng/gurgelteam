import type {
  GpsLine,
  LapSector,
  LineCrossing,
  SessionLap,
  TelemetryPoint,
  Track,
  ValidationIssue,
} from "../types";
import { avg, haversineMeters, isValidGps, max, pointInBounds } from "../geometry/geo";
import {
  buildLineDefinitions,
  detectLineCrossings,
} from "../geometry/line-crossing";

export const MIN_LAP_TIME_SEC = 25;
export const MIN_GPS_POINTS = 30;
/** S1 a menos de 15 s sem S2/S3 intermediários é oscilação GPS — reinicia a volta. */
const SPURIOUS_S1_MAX_SEC = 15;

export function validateTelemetryInput(
  points: TelemetryPoint[],
  track: Track,
  lines: { startFinishLine: GpsLine; sectors: Track["sectors"] },
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const gpsValid = points.filter((p) =>
    isValidGps(p.latitude, p.longitude),
  );

  if (points.length < MIN_GPS_POINTS) {
    issues.push({
      code: "MIN_POINTS",
      message: `Poucos pontos GPS (${points.length}). Mínimo: ${MIN_GPS_POINTS}.`,
      severity: "error",
    });
  }

  if (gpsValid.length < points.length * 0.5) {
    issues.push({
      code: "GPS_INVALID",
      message: `Apenas ${gpsValid.length} de ${points.length} pontos têm GPS válido. Verifique colunas Latitude/Longitude no CSV (MyChron: GPS Latitude / GPS Longitude).`,
      severity: gpsValid.length === 0 ? "error" : "warning",
    });
  }

  const inTrack = gpsValid.filter((p) =>
    pointInBounds(p.latitude, p.longitude, track.bounds),
  );
  const ratio = gpsValid.length > 0 ? inTrack.length / gpsValid.length : 0;
  if (!track.isUserTrack && ratio < 0.4) {
    issues.push({
      code: "TRACK_MISMATCH",
      message: `Trajetória incompatível com ${track.name} (${Math.round(ratio * 100)}% dentro da área).`,
      severity: "warning",
    });
  }

  const sfLen = haversineMeters(
    lines.startFinishLine.latA,
    lines.startFinishLine.lonA,
    lines.startFinishLine.latB,
    lines.startFinishLine.lonB,
  );
  if (sfLen < 5) {
    issues.push({
      code: "INVALID_SF_LINE",
      message: "Linha de largada/chegada muito curta ou inválida.",
      severity: "error",
    });
  }

  return issues;
}

export function buildSectorsForLap(
  points: TelemetryPoint[],
  lapStart: number,
  lapEnd: number,
  s2Time: number | null,
  s3Time: number | null,
): LapSector[] {
  const sectors: LapSector[] = [];

  const pushSector = (sector: 1 | 2 | 3, start: number, end: number) => {
    if (end <= start) return;
    const metrics = computeSectorMetrics(points, start, end);
    sectors.push({
      sector,
      sectorTime: end - start,
      startTime: start,
      endTime: end,
      ...metrics,
    });
  };

  if (
    s2Time != null &&
    s3Time != null &&
    s2Time > lapStart &&
    s3Time > s2Time &&
    s3Time < lapEnd
  ) {
    pushSector(1, lapStart, s2Time);
    pushSector(2, s2Time, s3Time);
    pushSector(3, s3Time, lapEnd);
  } else if (s2Time != null && s2Time > lapStart && s2Time < lapEnd) {
    pushSector(1, lapStart, s2Time);
    pushSector(2, s2Time, lapEnd);
  } else {
    pushSector(1, lapStart, lapEnd);
  }

  return sectors;
}

function computeSectorMetrics(
  points: TelemetryPoint[],
  startTime: number,
  endTime: number,
): Omit<LapSector, "sector" | "sectorTime" | "startTime" | "endTime"> {
  const slice = points.filter(
    (p) => p.sessionTime >= startTime && p.sessionTime <= endTime,
  );
  return {
    avgSpeed: avg(slice.map((p) => p.speed)),
    maxSpeed: max(slice.map((p) => p.speed)),
    avgRpm: avg(slice.map((p) => p.rpm)),
    avgLongitudinalG: avg(slice.map((p) => p.longitudinalG)),
  };
}

export function findPointIndexAtTime(
  points: TelemetryPoint[],
  time: number,
): number {
  for (let i = 0; i < points.length; i++) {
    if (points[i].sessionTime >= time) return i;
  }
  return points.length - 1;
}

function lapEndIndexFromCrossing(startIndex: number, endCross: LineCrossing): number {
  return Math.max(startIndex, endCross.pointIndex - 1);
}

/**
 * Máquina de estados por cruzamento GPS.
 * Volta = S1 → S2 → S3 → S1 (início/fim na linha start_finish).
 * sector_1 = fim do setor 1 (S2), sector_2 = fim do setor 2 (S3).
 * 0=aguardando S1, 1=aguardando S2, 2=aguardando S3, 3=aguardando S1 (fechar).
 */
type LapStep = 0 | 1 | 2 | 3;

function buildLapsFromCrossings(
  points: TelemetryPoint[],
  crossings: LineCrossing[],
): { laps: SessionLap[] } {
  let step: LapStep = 0;
  let lapStart: number | null = null;
  let lapStartCross: LineCrossing | null = null;
  let s2Time: number | null = null;
  let s3Time: number | null = null;
  let firstS1Cross: LineCrossing | null = null;
  const laps: SessionLap[] = [];

  const resetLapStart = (cross: LineCrossing) => {
    lapStart = cross.sessionTime;
    lapStartCross = cross;
    s2Time = null;
    s3Time = null;
    step = 1;
  };

  const closeLap = (endCross: LineCrossing, incomplete = false) => {
    if (lapStart == null || lapStartCross == null) return;
    const startIndex = lapStartCross.pointIndex;
    const endIndex = lapEndIndexFromCrossing(startIndex, endCross);
    const lapTime = endCross.sessionTime - lapStart;
    const sectors = buildSectorsForLap(
      points,
      lapStart,
      endCross.sessionTime,
      s2Time,
      s3Time,
    );
    const hasThree = sectors.length === 3;
    const isValid =
      !incomplete &&
      lapTime >= MIN_LAP_TIME_SEC &&
      hasThree &&
      sectors.every((s) => s.sectorTime > 0.5);

    const lapNumber = laps.filter((l) => !l.isOutLap).length + 1;
    laps.push({
      lapNumber,
      lapTime,
      sectors,
      isValid,
      isOutLap: false,
      isIncomplete: incomplete || !hasThree,
      startTime: lapStart,
      endTime: endCross.sessionTime,
      startIndex,
      endIndex,
    });

    resetLapStart(endCross);
  };

  for (const c of crossings) {
    const st = step as number;

    if (c.lineId === "start_finish") {
      if (st === 0) {
        if (firstS1Cross == null) firstS1Cross = c;
        resetLapStart(c);
        continue;
      }

      if (lapStart == null || lapStartCross == null) continue;
      const sinceStart = c.sessionTime - lapStart;

      if (st === 3 && s2Time != null && s3Time != null) {
        if (sinceStart < MIN_LAP_TIME_SEC * 0.85) continue;
        closeLap(c, false);
        continue;
      }

      if (st === 1 || st === 2) {
        if (sinceStart < SPURIOUS_S1_MAX_SEC) {
          resetLapStart(c);
        } else {
          closeLap(c, true);
        }
      }
      continue;
    }

    if (lapStart == null) continue;

    if (c.lineId === "sector_1" && st === 1 && c.sessionTime > lapStart) {
      s2Time = c.sessionTime;
      step = 2;
      continue;
    }

    if (
      c.lineId === "sector_2" &&
      st === 2 &&
      s2Time != null &&
      c.sessionTime > s2Time
    ) {
      s3Time = c.sessionTime;
      step = 3;
    }
  }

  if (
    firstS1Cross != null &&
    firstS1Cross.sessionTime > points[0].sessionTime + 1
  ) {
    laps.unshift({
      lapNumber: 0,
      lapTime: firstS1Cross.sessionTime - points[0].sessionTime,
      sectors: [],
      isValid: false,
      isOutLap: true,
      isIncomplete: false,
      startTime: points[0].sessionTime,
      endTime: firstS1Cross.sessionTime,
      startIndex: 0,
      endIndex: Math.max(0, firstS1Cross.pointIndex - 1),
    });
  }

  if (lapStart != null && step !== 0) {
    const lastPoint = points[points.length - 1];
    if (lastPoint.sessionTime - lapStart > MIN_LAP_TIME_SEC * 0.4) {
      const startIndex = findPointIndexAtTime(points, lapStart);
      const sectors = buildSectorsForLap(
        points,
        lapStart,
        lastPoint.sessionTime,
        s2Time,
        s3Time,
      );
      laps.push({
        lapNumber: laps.filter((l) => !l.isOutLap && l.isValid).length + 1,
        lapTime: lastPoint.sessionTime - lapStart,
        sectors,
        isValid: false,
        isOutLap: false,
        isIncomplete: true,
        startTime: lapStart,
        endTime: lastPoint.sessionTime,
        startIndex,
        endIndex: points.length - 1,
      });
    }
  }

  return { laps };
}

/**
 * Distância percorrida na volta: 0 m na passagem por S1, acumulada via GPS
 * até a próxima passagem por S1. Não usa "Distance on GPS Speed" do CSV (sessão inteira).
 */
export function assignLapDistances(
  points: TelemetryPoint[],
  laps: SessionLap[],
): void {
  for (const p of points) {
    p.lapDistance = null;
  }

  for (const lap of laps) {
    if (lap.isOutLap) continue;
    const start = lap.startIndex;
    if (start < 0 || start >= points.length) continue;

    points[start].lapDistance = 0;
    let cumulative = 0;

    for (let i = start + 1; i <= lap.endIndex && i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      if (
        isValidGps(prev.latitude, prev.longitude) &&
        isValidGps(cur.latitude, cur.longitude)
      ) {
        cumulative += haversineMeters(
          prev.latitude,
          prev.longitude,
          cur.latitude,
          cur.longitude,
        );
      }
      points[i].lapDistance = cumulative;
    }
  }
}

export type ReconstructResult = {
  points: TelemetryPoint[];
  laps: SessionLap[];
  crossings: LineCrossing[];
};

export function reconstructLapsAndSectors(
  rawPoints: TelemetryPoint[],
  lines: { startFinishLine: GpsLine; sectors: Track["sectors"] },
): ReconstructResult {
  const lineDefs = buildLineDefinitions(
    lines.startFinishLine,
    lines.sectors,
  );
  const allCrossings = detectLineCrossings(rawPoints, lineDefs, {
    minIntervalSec: 3,
    startFinishMinIntervalSec: 12,
  });

  const points = rawPoints.map((p) => ({ ...p, lapDistance: null }));
  const { laps } = buildLapsFromCrossings(rawPoints, allCrossings);

  for (const lap of laps) {
    if (lap.isOutLap) continue;
    for (let pi = lap.startIndex; pi <= lap.endIndex && pi < points.length; pi++) {
      points[pi].lapNumber = lap.lapNumber;
    }
  }

  assignSectorNumbers(points, laps);
  assignLapDistances(points, laps);

  return { points, laps, crossings: allCrossings };
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

/** @deprecated Distância de volta é calculada após reconstrução (assignLapDistances). */
export function computeLapDistance(points: TelemetryPoint[]): TelemetryPoint[] {
  return points.map((p) => ({ ...p, lapDistance: null }));
}
