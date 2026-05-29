import type { TelemetryTabKey } from "@/lib/contracts/student-area";
import type { ProcessedTelemetrySession, SessionLap, TelemetryPoint } from "../types";

export type SectorFilter = 1 | 2 | 3 | null;

function resampleByDistance(
  values: number[],
  targetLen: number,
): number[] {
  if (values.length === 0) return Array(targetLen + 1).fill(0);
  if (values.length === targetLen + 1) return values;
  const out: number[] = [];
  for (let m = 0; m <= targetLen; m++) {
    const t = m / targetLen;
    const idx = t * (values.length - 1);
    const i0 = Math.floor(idx);
    const i1 = Math.min(values.length - 1, i0 + 1);
    const frac = idx - i0;
    out.push(values[i0] + frac * (values[i1] - values[i0]));
  }
  return out;
}

function lapPoints(session: ProcessedTelemetrySession, lap: SessionLap): TelemetryPoint[] {
  return session.points.slice(lap.startIndex, lap.endIndex + 1);
}

function findLap(
  session: ProcessedTelemetrySession,
  lapNumber: number,
): SessionLap | undefined {
  return session.laps.find((l) => l.lapNumber === lapNumber && !l.isOutLap);
}

function normalizedLapDistances(pts: TelemetryPoint[]): number[] {
  const rawDists = pts.map((p) => p.lapDistance ?? 0);
  const baseDist = rawDists.length > 0 ? Math.min(...rawDists) : 0;
  return rawDists.map((d) => Math.max(0, d - baseDist));
}

function metricValue(p: TelemetryPoint, tab: TelemetryTabKey): number | null {
  switch (tab) {
    case "velocidade":
      return p.speed;
    case "rpm":
      return p.rpm;
    case "aceleracao_lateral":
      return p.lateralG;
    case "aceleracao_longitudinal":
      return p.longitudinalG;
    case "giro":
      return p.gyro;
    default:
      return null;
  }
}

function distanceAtTime(pts: TelemetryPoint[], time: number): number {
  const dists = normalizedLapDistances(pts);
  for (let i = 0; i < pts.length; i++) {
    if (pts[i].sessionTime >= time) return dists[i] ?? 0;
  }
  return dists[dists.length - 1] ?? 0;
}

export function sectorDistanceRange(
  session: ProcessedTelemetrySession,
  lapNumber: number,
  sector: 1 | 2 | 3,
): { startM: number; endM: number } | null {
  const lap = findLap(session, lapNumber);
  if (!lap) return null;
  const sec = lap.sectors.find((s) => s.sector === sector);
  if (!sec) return null;
  const pts = lapPoints(session, lap);
  if (pts.length === 0) return null;
  const startM = distanceAtTime(pts, sec.startTime);
  const endM = distanceAtTime(pts, sec.endTime);
  if (endM <= startM) return null;
  return { startM, endM };
}

export function maxSectorLengthM(
  session: ProcessedTelemetrySession,
  lapNumbers: number[],
  sector: 1 | 2 | 3,
): number {
  let max = 0;
  for (const lapNumber of lapNumbers) {
    const range = sectorDistanceRange(session, lapNumber, sector);
    if (range) max = Math.max(max, range.endM - range.startM);
  }
  return Math.max(Math.round(max), 50);
}

export function maxChartDistanceM(
  session: ProcessedTelemetrySession,
  lapNumbers: number[],
  sectorFilter: SectorFilter = null,
): number {
  if (sectorFilter != null) {
    return maxSectorLengthM(session, lapNumbers, sectorFilter);
  }
  let max = 0;
  for (const lapNumber of lapNumbers) {
    const lap = findLap(session, lapNumber);
    if (!lap) continue;
    const pts = lapPoints(session, lap);
    const dists = normalizedLapDistances(pts);
    max = Math.max(max, dists.length ? Math.max(...dists) : 0);
  }
  return Math.max(Math.round(max), 50);
}

function buildSeriesFromPoints(
  pts: TelemetryPoint[],
  tab: TelemetryTabKey,
  trackLengthM: number,
  distStart = 0,
  distEnd?: number,
): number[] {
  const dists = normalizedLapDistances(pts);
  const endDist = distEnd ?? Math.max(...dists, 1);
  const span = Math.max(endDist - distStart, 1);
  const raw: number[] = [];

  for (let m = 0; m <= trackLengthM; m++) {
    const targetDist = distStart + (m / trackLengthM) * span;
    let best = 0;
    let bestDiff = Infinity;
    for (let i = 0; i < pts.length; i++) {
      if (dists[i] < distStart - 0.5 || dists[i] > endDist + 0.5) continue;
      const d = Math.abs(dists[i] - targetDist);
      if (d < bestDiff) {
        bestDiff = d;
        best = metricValue(pts[i], tab) ?? 0;
      }
    }
    raw.push(best);
  }

  return resampleByDistance(raw, trackLengthM);
}

export function chartSeriesForProcessedLap(
  session: ProcessedTelemetrySession,
  lapNumber: number,
  tab: TelemetryTabKey,
  trackLengthM: number,
  sectorFilter: SectorFilter = null,
): number[] {
  const lap = session.laps.find(
    (l) => l.lapNumber === lapNumber && l.isValid,
  );
  if (!lap) return Array(trackLengthM + 1).fill(0);

  const pts = lapPoints(session, lap);

  if (sectorFilter != null) {
    const range = sectorDistanceRange(session, lapNumber, sectorFilter);
    if (!range) return Array(trackLengthM + 1).fill(0);
    return buildSeriesFromPoints(
      pts,
      tab,
      trackLengthM,
      range.startM,
      range.endM,
    );
  }

  return buildSeriesFromPoints(pts, tab, trackLengthM);
}

export function gpsPositionAtLapDistance(
  session: ProcessedTelemetrySession,
  lapNumber: number,
  distanceM: number,
  trackLengthM: number,
  sectorFilter: SectorFilter = null,
): { latitude: number; longitude: number } | null {
  const lap = findLap(session, lapNumber);
  if (!lap) return null;

  const pts = lapPoints(session, lap);
  if (pts.length === 0) return null;

  const dists = normalizedLapDistances(pts);
  let distStart = 0;
  let distEnd = Math.max(...dists, 1);

  if (sectorFilter != null) {
    const range = sectorDistanceRange(session, lapNumber, sectorFilter);
    if (!range) return null;
    distStart = range.startM;
    distEnd = range.endM;
  }

  const span = Math.max(distEnd - distStart, 1);
  const targetDist = distStart + (distanceM / trackLengthM) * span;

  let bestIdx = 0;
  let bestDiff = Infinity;
  for (let i = 0; i < dists.length; i++) {
    const diff = Math.abs(dists[i] - targetDist);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }

  const p = pts[bestIdx];
  if (!Number.isFinite(p.latitude) || !Number.isFinite(p.longitude)) return null;
  return { latitude: p.latitude, longitude: p.longitude };
}

export function processedSessionLapsList(
  session: ProcessedTelemetrySession,
): { lap: number; timeLabel: string; invalid?: boolean }[] {
  return session.laps
    .filter((l) => !l.isOutLap)
    .map((l) => ({
      lap: l.lapNumber,
      timeLabel: l.lapTime.toFixed(3).replace(".", ","),
      invalid: !l.isValid || l.isIncomplete,
    }));
}

/** Índice na lista de `processedSessionLapsList` da melhor volta válida. */
export function findBestLapListIndex(
  session: ProcessedTelemetrySession,
  sessionLaps: ReturnType<typeof processedSessionLapsList>,
): number {
  if (sessionLaps.length === 0) return 0;

  const bestTime = session.meta.bestLapTime;
  if (bestTime != null) {
    for (let i = 0; i < sessionLaps.length; i++) {
      const lap = session.laps.find(
        (l) => l.lapNumber === sessionLaps[i].lap && !l.isOutLap && l.isValid,
      );
      if (lap && Math.abs(lap.lapTime - bestTime) < 0.0005) return i;
    }
  }

  let bestIdx = 0;
  let minTime = Infinity;
  for (let i = 0; i < sessionLaps.length; i++) {
    const lap = session.laps.find(
      (l) => l.lapNumber === sessionLaps[i].lap && !l.isOutLap && l.isValid,
    );
    if (lap && lap.lapTime < minTime) {
      minTime = lap.lapTime;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export function processedSessionStats(session: ProcessedTelemetrySession) {
  const valid = session.laps.filter((l) => l.isValid);
  const best = session.meta.bestLapTime;
  const avg = session.meta.averageLapTime;
  return {
    bestLap: best != null ? best.toFixed(3).replace(".", ",") : "—",
    bestTheoretical: session.idealLap.idealTime.toFixed(3).replace(".", ","),
    average: avg != null ? avg.toFixed(3).replace(".", ",") : "—",
    consistency:
      valid.length >= 2 && avg && best
        ? `${Math.round((1 - (avg - best) / avg) * 100)}%`
        : "—",
    refLap: best?.toFixed(3) ?? "—",
    delta: session.idealLap.potentialGain
      ? `-${session.idealLap.potentialGain.toFixed(3)}s`
      : "—",
    sectorDiff: valid.length
      ? [1, 2, 3]
          .map((s) => {
            const t = session.idealLap[`bestS${s}` as "bestS1"];
            return t > 0 ? t.toFixed(2) : "—";
          })
          .join(" • ")
      : "—",
    fuel: "—",
    tireWear: "—",
  };
}

export function gpsTrailForSession(
  session: ProcessedTelemetrySession,
): { latitude: number; longitude: number }[] {
  return session.points
    .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
    .map((p) => ({ latitude: p.latitude, longitude: p.longitude }));
}

/** Traçado GPS de uma volta específica (S1 → S1). */
export function gpsTrailForLap(
  session: ProcessedTelemetrySession,
  lapNumber: number,
): { latitude: number; longitude: number }[] {
  const lap = findLap(session, lapNumber);
  if (!lap) return [];

  return lapPoints(session, lap)
    .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
    .map((p) => ({ latitude: p.latitude, longitude: p.longitude }));
}
