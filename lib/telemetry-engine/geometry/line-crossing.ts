import type { GpsLine, LineCrossing, TelemetryPoint } from "../types";
import { extendLineSegment, interpolateCrossing, linesEquivalent, segmentsCross } from "./geo";

const GATE_EXTEND_METERS = 8;

export type DetectCrossingsOptions = {
  /** Intervalo mínimo entre cruzamentos da mesma linha (geral). */
  minIntervalSec?: number;
  /** Intervalo mínimo para largada/chegada — evita voltas fantasma por oscilação GPS. */
  startFinishMinIntervalSec?: number;
};
const LINE_IDS = [
  "start_finish",
  "sector_1",
  "sector_2",
  "sector_3",
] as const;

function lineIdForKey(key: string): LineCrossing["lineId"] {
  if (key === "start_finish") return "start_finish";
  if (key === "sector_1") return "sector_1";
  if (key === "sector_2") return "sector_2";
  return "sector_3";
}

/**
 * Detecta cruzamentos de linha GPS analisando segmentos consecutivos.
 * Ignora cruzamentos duplicados dentro de minIntervalSec.
 */
export function detectLineCrossings(
  points: TelemetryPoint[],
  lines: { id: LineCrossing["lineId"]; line: GpsLine }[],
  options: DetectCrossingsOptions = {},
): LineCrossing[] {
  const minInterval = options.minIntervalSec ?? 3;
  const sfMinInterval = options.startFinishMinIntervalSec ?? 15;
  const crossings: LineCrossing[] = [];
  const lastCrossTime: Partial<Record<LineCrossing["lineId"], number>> = {};

  for (let i = 1; i < points.length; i++) {    const p1 = points[i - 1];
    const p2 = points[i];
    if (
      !Number.isFinite(p1.latitude) ||
      !Number.isFinite(p2.latitude) ||
      !Number.isFinite(p1.sessionTime) ||
      !Number.isFinite(p2.sessionTime)
    ) {
      continue;
    }

    for (const { id, line } of lines) {
      const gate = extendLineSegment(
        line.latA,
        line.lonA,
        line.latB,
        line.lonB,
        GATE_EXTEND_METERS,
      );

      if (
        !segmentsCross(
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
        continue;
      }

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

      const prev = lastCrossTime[id];
      const gapRequired = id === "start_finish" ? sfMinInterval : minInterval;
      if (prev != null && hit.sessionTime - prev < gapRequired) continue;
      lastCrossTime[id] = hit.sessionTime;
      crossings.push({
        lineId: id,
        sessionTime: hit.sessionTime,
        pointIndex: i,
        latitude: hit.latitude,
        longitude: hit.longitude,
      });
    }
  }

  return crossings.sort((a, b) => a.sessionTime - b.sessionTime);
}

export function buildLineDefinitions(
  startFinishLine: GpsLine,
  sectorLines: { sector: 1 | 2 | 3; endLine: GpsLine }[],
): { id: LineCrossing["lineId"]; line: GpsLine }[] {
  const out: { id: LineCrossing["lineId"]; line: GpsLine }[] = [
    { id: "start_finish", line: startFinishLine },
  ];
  for (const s of sectorLines) {
    if (s.sector === 3 && linesEquivalent(s.endLine, startFinishLine)) continue;
    if (linesEquivalent(s.endLine, startFinishLine)) continue;
    const id = lineIdForKey(`sector_${s.sector}` as "sector_1");
    out.push({ id, line: s.endLine });
  }
  return out;
}
export { LINE_IDS };
