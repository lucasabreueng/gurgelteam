import type { TelemetryPilotSession } from "@/lib/contracts/student-area";
import type {
  IdealLapData,
  SectorId,
  SectorsLapRecord,
  SectorsPageData,
  SectorPerformance,
} from "@/lib/contracts/telemetry/sectors";
import type { ProcessedTelemetrySession } from "../types";
import { formatLapTime } from "../processing/ideal-lap";

function sectorPerformance(
  time: number,
  best: number,
): SectorPerformance {
  const delta = time - best;
  if (delta <= 0.02) return "personal_best";
  if (delta <= 0.08) return "gain";
  if (delta >= 0.15) return "loss";
  return "neutral";
}

export function processedSessionToSectorsPage(
  session: ProcessedTelemetrySession,
): SectorsPageData {
  const validLaps = session.laps.filter((l) => l.isValid);
  const laps: SectorsLapRecord[] = session.laps
    .filter((l) => !l.isOutLap)
    .map((l) => {
      const s1 = l.sectors.find((s) => s.sector === 1)?.sectorTime ?? 0;
      const s2 = l.sectors.find((s) => s.sector === 2)?.sectorTime ?? 0;
      const s3 = l.sectors.find((s) => s.sector === 3)?.sectorTime ?? 0;
      return {
        lap: l.lapNumber,
        s1,
        s2,
        s3,
        total: l.lapTime,
        invalid: !l.isValid || l.isIncomplete,
      };
    });

  const bestS1 = Math.min(...validLaps.flatMap((l) => l.sectors.filter((s) => s.sector === 1).map((s) => s.sectorTime)).filter(Boolean), Infinity);
  const bestS2 = Math.min(...validLaps.flatMap((l) => l.sectors.filter((s) => s.sector === 2).map((s) => s.sectorTime)).filter(Boolean), Infinity);
  const bestS3 = Math.min(...validLaps.flatMap((l) => l.sectors.filter((s) => s.sector === 3).map((s) => s.sectorTime)).filter(Boolean), Infinity);

  const pilotSession: TelemetryPilotSession = {
    id: session.id,
    dateLabel: session.dateLabel,
    totalLaps: validLaps.length,
    bestLap: formatLapTime(session.meta.bestLapTime ?? 0),
    totalTime: formatLapTime(
      validLaps.reduce((a, l) => a + l.lapTime, 0),
    ),
    trackName: session.trackName,
  };

  const sectorIds: SectorId[] = ["S1", "S2", "S3"];
  const bestTimes = [bestS1, bestS2, bestS3];
  const idealTimes = [
    session.idealLap.bestS1,
    session.idealLap.bestS2,
    session.idealLap.bestS3,
  ];

  const sectors = sectorIds.map((id, i) => {
    const sectorNum = (i + 1) as 1 | 2 | 3;
    const times = validLaps
      .flatMap((l) => l.sectors.filter((s) => s.sector === sectorNum))
      .map((s) => s.sectorTime);
    const current = times.length ? times[times.length - 1] : 0;
    const best = bestTimes[i] === Infinity ? 0 : bestTimes[i];
    const avg = times.length
      ? times.reduce((a, b) => a + b, 0) / times.length
      : 0;
    const variation =
      times.length > 1
        ? Math.max(...times) - Math.min(...times)
        : 0;

    return {
      id,
      label: id,
      currentTime: current,
      bestSessionTime: best,
      personalBestTime: best,
      theoreticalTime: idealTimes[i],
      deltaVsBest: current - best,
      deltaVsTheoretical: current - idealTimes[i],
      consistency: times.length >= 2 ? Math.round((1 - variation / avg) * 100) : 100,
      variationMs: Math.round(variation * 1000),
      trend: times,
      status: sectorPerformance(current, best),
    };
  });

  const idealLap: IdealLapData = {
    bestReal: session.idealLap.bestRealLap,
    ideal: session.idealLap.idealTime,
    potential: session.idealLap.potentialGain,
  };

  const lapEvolution = validLaps.map((l) => l.lapTime);
  const best = session.meta.bestLapTime ?? 0;
  const cumulativeDelta = lapEvolution.map((t) => t - best);

  const insights = session.validations
    .filter((v) => v.severity === "warning")
    .map((v, i) => ({
      id: `v-${i}`,
      text: v.message,
      tone: "neutral" as const,
    }));

  if (session.meta.outLapDetected) {
    insights.unshift({
      id: "out-lap",
      text: "Out lap detectada e excluída das estatísticas.",
      tone: "neutral",
    });
  }

  return {
    session: pilotSession,
    summary: {
      trackName: session.trackName,
      dateLabel: session.dateLabel,
      category: session.adapterId.toUpperCase(),
      pilotName: "Importado",
      totalLaps: validLaps.length,
      bestLap: formatLapTime(session.meta.bestLapTime ?? 0),
      average: formatLapTime(session.meta.averageLapTime ?? 0),
      consistency:
        validLaps.length >= 2 && session.meta.averageLapTime
          ? `${Math.round((1 - ((session.meta.averageLapTime ?? 0) - (session.meta.bestLapTime ?? 0)) / (session.meta.averageLapTime ?? 1)) * 100)}%`
          : "—",
      idealLap: formatLapTime(session.idealLap.idealTime),
    },
    sectors,
    laps,
    insights,
    idealLap,
    trackSegments: [
      { id: "S1", label: "S1", performance: sectors[0].status, d: "M 20 80 Q 60 40 100 80" },
      { id: "S2", label: "S2", performance: sectors[1].status, d: "M 100 80 Q 140 120 180 80" },
      { id: "S3", label: "S3", performance: sectors[2].status, d: "M 180 80 Q 220 40 260 80" },
    ],
    lapEvolution,
    cumulativeDelta,
  };
}
