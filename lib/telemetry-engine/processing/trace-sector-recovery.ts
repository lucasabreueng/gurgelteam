import type {
  GpsLine,
  LapSector,
  LineCrossing,
  SessionLap,
  TelemetryPoint,
  Track,
} from "../types";
import { buildLineDefinitions } from "../geometry/line-crossing";
import {
  findTracePassageInRange,
  tracePassageToCrossing,
} from "../geometry/trace-crossing";
import { buildSectorsForLap, MIN_LAP_TIME_SEC } from "./reconstruct";

function sectorLine(
  lines: { startFinishLine: GpsLine; sectors: Track["sectors"] },
  sector: 1 | 2 | 3,
): GpsLine | undefined {
  if (sector === 1) {
    const s1 = lines.sectors.find((s) => s.sector === 1);
    return s1?.endLine;
  }
  const s = lines.sectors.find((x) => x.sector === sector);
  return s?.endLine;
}

function sectorBoundaryTime(
  lap: SessionLap,
  afterSector: 1 | 2,
): number | null {
  const s = lap.sectors.find((x) => x.sector === afterSector);
  if (!s) return null;
  if (s.endTime >= lap.endTime - 0.5) return null;
  return s.endTime;
}

function recoverLapSectorTimes(
  points: TelemetryPoint[],
  lap: SessionLap,
  lines: { startFinishLine: GpsLine; sectors: Track["sectors"] },
): { s2Time: number | null; s3Time: number | null; recovered: boolean } {
  const lineS1 = sectorLine(lines, 1);
  const lineS2 = sectorLine(lines, 2);
  if (!lineS1 || !lineS2) {
    return { s2Time: null, s3Time: null, recovered: false };
  }

  let s2Time = sectorBoundaryTime(lap, 1);
  let s3Time = sectorBoundaryTime(lap, 2);
  let recovered = false;

  if (s2Time == null) {
    const hit = findTracePassageInRange(
      points,
      lap.startIndex,
      lap.endIndex,
      lineS1,
      lap.startTime,
      lap.endTime,
    );
    if (hit) {
      s2Time = hit.sessionTime;
      recovered = true;
    }
  }

  if (s3Time == null && s2Time != null) {
    const hit = findTracePassageInRange(
      points,
      lap.startIndex,
      lap.endIndex,
      lineS2,
      s2Time,
      lap.endTime,
    );
    if (hit) {
      s3Time = hit.sessionTime;
      recovered = true;
    }
  }

  return { s2Time, s3Time, recovered };
}

function rebuildLapWithSectorTimes(
  points: TelemetryPoint[],
  lap: SessionLap,
  s2Time: number | null,
  s3Time: number | null,
): SessionLap {
  const sectors = buildSectorsForLap(
    points,
    lap.startTime,
    lap.endTime,
    s2Time,
    s3Time,
  );
  const hasThree = sectors.length === 3;
  const isValid =
    !lap.isOutLap &&
    lap.lapTime >= MIN_LAP_TIME_SEC &&
    hasThree &&
    sectors.every((s) => s.sectorTime > 0.5);

  return {
    ...lap,
    sectors,
    isValid,
    isIncomplete: !hasThree || lap.isOutLap,
  };
}

export type TraceCorrectionResult = {
  laps: SessionLap[];
  correctedLapCount: number;
  extraCrossings: LineCrossing[];
};

/**
 * Recupera setores ausentes analisando o traçado GPS da volta
 * (proximidade + troca de lado da linha), sem ajuste manual de tempos.
 */
export function autoCorrectLapsFromGpsTrace(
  points: TelemetryPoint[],
  laps: SessionLap[],
  lines: { startFinishLine: GpsLine; sectors: Track["sectors"] },
): TraceCorrectionResult {
  const lineDefs = buildLineDefinitions(
    lines.startFinishLine,
    lines.sectors,
  );
  const extraCrossings: LineCrossing[] = [];
  let correctedLapCount = 0;

  const correctedLaps = laps.map((lap) => {
    if (lap.isOutLap) return lap;
    const hasThree =
      lap.sectors.length === 3 &&
      lap.sectors.every((s) => s.sectorTime > 0.5);
    if (hasThree && lap.isValid) return lap;

    const { s2Time, s3Time, recovered } = recoverLapSectorTimes(
      points,
      lap,
      lines,
    );
    if (!recovered && s2Time == null && s3Time == null) return lap;

    if (s2Time != null && sectorBoundaryTime(lap, 1) == null) {
      const lineS1 = lineDefs.find((l) => l.id === "sector_1");
      if (lineS1) {
        const hit = findTracePassageInRange(
          points,
          lap.startIndex,
          lap.endIndex,
          lineS1.line,
          lap.startTime,
          lap.endTime,
        );
        if (hit) extraCrossings.push(tracePassageToCrossing("sector_1", hit));
      }
    }

    if (s3Time != null && sectorBoundaryTime(lap, 2) == null) {
      const lineS2 = lineDefs.find((l) => l.id === "sector_2");
      if (lineS2 && s2Time != null) {
        const hit = findTracePassageInRange(
          points,
          lap.startIndex,
          lap.endIndex,
          lineS2.line,
          s2Time,
          lap.endTime,
        );
        if (hit) extraCrossings.push(tracePassageToCrossing("sector_2", hit));
      }
    }

    const next = rebuildLapWithSectorTimes(points, lap, s2Time, s3Time);
    if (next.sectors.length === 3 && !lap.isValid && next.isValid) {
      correctedLapCount += 1;
    } else if (recovered && next.sectors.length > lap.sectors.length) {
      correctedLapCount += 1;
    }
    return next;
  });

  return {
    laps: correctedLaps,
    correctedLapCount,
    extraCrossings,
  };
}
