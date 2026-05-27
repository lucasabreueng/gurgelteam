import type { GpsLine, LineCrossing, TelemetryPoint } from "../types";
import {
  extendLineSegment,
  interpolateCrossing,
  lineSideSign,
  pointToSegmentDistanceMeters,
  segmentsCross,
} from "./geo";

/** Faixa de tolerância quando o GPS “descola” mas o traçado passa junto à linha. */
export const GPS_TRACE_CORRIDOR_METERS = 14;
const GATE_EXTEND_METERS = 10;
const MIN_SECTOR_GAP_SEC = 2;

export type TracePassageHit = {
  sessionTime: number;
  pointIndex: number;
  latitude: number;
  longitude: number;
  method: "cross" | "side_flip" | "closest";
  distanceM: number;
};

export function passageFromSegment(
  p1: TelemetryPoint,
  p2: TelemetryPoint,
  line: GpsLine,
  gate: ReturnType<typeof extendLineSegment>,
): TracePassageHit | null {
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
    return {
      sessionTime: hit.sessionTime,
      pointIndex: p2.index,
      latitude: hit.latitude,
      longitude: hit.longitude,
      method: "cross",
      distanceM: 0,
    };
  }

  const s1 = lineSideSign(
    p1.latitude,
    p1.longitude,
    line.latA,
    line.lonA,
    line.latB,
    line.lonB,
  );
  const s2 = lineSideSign(
    p2.latitude,
    p2.longitude,
    line.latA,
    line.lonA,
    line.latB,
    line.lonB,
  );
  const d1 = pointToSegmentDistanceMeters(
    p1.latitude,
    p1.longitude,
    line.latA,
    line.lonA,
    line.latB,
    line.lonB,
  );
  const d2 = pointToSegmentDistanceMeters(
    p2.latitude,
    p2.longitude,
    line.latA,
    line.lonA,
    line.latB,
    line.lonB,
  );

  if (
    s1 !== 0 &&
    s2 !== 0 &&
    s1 * s2 < 0 &&
    Math.min(d1, d2) <= GPS_TRACE_CORRIDOR_METERS
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
    return {
      sessionTime: hit.sessionTime,
      pointIndex: p2.index,
      latitude: hit.latitude,
      longitude: hit.longitude,
      method: "side_flip",
      distanceM: Math.min(d1, d2),
    };
  }

  return null;
}

/**
 * Detecta passagem pela linha usando cruzamento estrito ou proximidade do traçado GPS.
 */
export function findTracePassageInRange(
  points: TelemetryPoint[],
  startIndex: number,
  endIndex: number,
  line: GpsLine,
  afterTime: number,
  beforeTime: number,
): TracePassageHit | null {
  const gate = extendLineSegment(
    line.latA,
    line.lonA,
    line.latB,
    line.lonB,
    GATE_EXTEND_METERS,
  );

  let bestClosest: TracePassageHit | null = null;

  const i0 = Math.max(1, startIndex + 1);
  const i1 = Math.min(endIndex, points.length - 1);

  for (let i = i0; i <= i1; i++) {
    const p1 = points[i - 1];
    const p2 = points[i];
    if (
      !Number.isFinite(p1.latitude) ||
      !Number.isFinite(p2.latitude) ||
      p2.sessionTime <= afterTime + 0.001 ||
      p2.sessionTime >= beforeTime - 0.001
    ) {
      continue;
    }

    const hit = passageFromSegment(p1, p2, line, gate);
    if (hit && hit.sessionTime > afterTime + MIN_SECTOR_GAP_SEC) {
      return hit;
    }

    const d2 = pointToSegmentDistanceMeters(
      p2.latitude,
      p2.longitude,
      line.latA,
      line.lonA,
      line.latB,
      line.lonB,
    );
    if (
      d2 <= GPS_TRACE_CORRIDOR_METERS &&
      p2.sessionTime > afterTime + MIN_SECTOR_GAP_SEC &&
      (!bestClosest || d2 < bestClosest.distanceM)
    ) {
      bestClosest = {
        sessionTime: p2.sessionTime,
        pointIndex: p2.index,
        latitude: p2.latitude,
        longitude: p2.longitude,
        method: "closest",
        distanceM: d2,
      };
    }
  }

  return bestClosest;
}

export function tracePassageToCrossing(
  lineId: LineCrossing["lineId"],
  hit: TracePassageHit,
): LineCrossing {
  return {
    lineId,
    sessionTime: hit.sessionTime,
    pointIndex: hit.pointIndex,
    latitude: hit.latitude,
    longitude: hit.longitude,
  };
}
