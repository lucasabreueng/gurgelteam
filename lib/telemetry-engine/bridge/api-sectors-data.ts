import type { TelemetrySessionApiDTO } from "@/lib/contracts/api/v1/telemetry.api.schemas";
import type { SectorsPageData } from "@/lib/contracts/telemetry/sectors";
import { formatLapTime, formatSessionDate } from "../processing/ideal-lap";

function msToSec(ms: number): number {
  return ms / 1000;
}

function sectorPerformance(
  time: number,
  best: number,
): "personal_best" | "gain" | "loss" | "neutral" {
  const delta = time - best;
  if (delta <= 0.02) return "personal_best";
  if (delta <= 0.08) return "gain";
  if (delta >= 0.15) return "loss";
  return "neutral";
}

function trackLabel(trackId: string | null | undefined): string {
  if (!trackId) return "Pista não informada";
  return trackId
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function apiSessionToSectorsPage(
  session: TelemetrySessionApiDTO,
): SectorsPageData | null {
  const lapsRaw = session.laps ?? [];
  const withSectors = lapsRaw.filter(
    (l) =>
      l.valid &&
      Array.isArray(l.sectorTimesMs) &&
      l.sectorTimesMs.length === 3,
  );
  if (withSectors.length === 0) return null;

  const laps = lapsRaw.map((l) => {
    const sectors = l.sectorTimesMs ?? [0, 0, 0];
    return {
      lap: l.lapNumber,
      s1: msToSec(sectors[0] ?? 0),
      s2: msToSec(sectors[1] ?? 0),
      s3: msToSec(sectors[2] ?? 0),
      total: msToSec(l.lapTimeMs),
      invalid: !l.valid,
    };
  });

  const valid = laps.filter((l) => !l.invalid);
  const bestS1 = Math.min(...valid.map((l) => l.s1));
  const bestS2 = Math.min(...valid.map((l) => l.s2));
  const bestS3 = Math.min(...valid.map((l) => l.s3));
  const idealTime = bestS1 + bestS2 + bestS3;
  const bestReal = Math.min(...valid.map((l) => l.total));
  const lapTimes = valid.map((l) => l.total);
  const average =
    lapTimes.length > 0
      ? lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length
      : 0;

  const dateIso = session.processedAt ?? session.createdAt ?? new Date().toISOString();
  const trackName = trackLabel(session.trackId);
  const dateLabel = formatSessionDate(dateIso);

  const pilotSession = {
    id: session.id,
    dateLabel,
    totalLaps: valid.length,
    bestLap: formatLapTime(bestReal),
    totalTime: formatLapTime(lapTimes.reduce((a, b) => a + b, 0)),
    trackName,
  };

  const sectorIds = ["S1", "S2", "S3"] as const;
  const bestTimes = [bestS1, bestS2, bestS3];
  const idealTimes = [bestS1, bestS2, bestS3];

  const sectors = sectorIds.map((id, i) => {
    const key = `s${i + 1}` as "s1" | "s2" | "s3";
    const times = valid.map((l) => l[key]);
    const current = times[times.length - 1] ?? 0;
    const best = bestTimes[i];
    const avg =
      times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    const variation =
      times.length > 1 ? Math.max(...times) - Math.min(...times) : 0;

    return {
      id,
      label: id,
      currentTime: current,
      bestSessionTime: best,
      personalBestTime: best,
      theoreticalTime: idealTimes[i],
      deltaVsBest: current - best,
      deltaVsTheoretical: current - idealTimes[i],
      consistency:
        times.length >= 2 && avg > 0
          ? Math.round((1 - variation / avg) * 100)
          : 100,
      variationMs: Math.round(variation * 1000),
      trend: times,
      status: sectorPerformance(current, best),
    };
  });

  return {
    session: pilotSession,
    summary: {
      trackName,
      dateLabel,
      category: session.source.toUpperCase(),
      pilotName: "Nuvem",
      totalLaps: valid.length,
      bestLap: formatLapTime(bestReal),
      average: formatLapTime(average),
      consistency:
        lapTimes.length >= 2 && average > 0
          ? `${Math.round((1 - (average - bestReal) / average) * 100)}%`
          : "—",
      idealLap: formatLapTime(idealTime),
    },
    sectors,
    laps,
    insights: [
      {
        id: "cloud",
        text: "Sessão sincronizada com o servidor. Gráficos GPS exigem importação local do arquivo.",
        tone: "neutral" as const,
      },
    ],
    idealLap: {
      bestReal,
      ideal: idealTime,
      potential: bestReal - idealTime,
    },
    trackSegments: [
      { id: "S1", label: "S1", performance: sectors[0].status, d: "M 20 80 Q 60 40 100 80" },
      { id: "S2", label: "S2", performance: sectors[1].status, d: "M 100 80 Q 140 120 180 80" },
      { id: "S3", label: "S3", performance: sectors[2].status, d: "M 180 80 Q 220 40 260 80" },
    ],
    lapEvolution: lapTimes,
    cumulativeDelta: lapTimes.map((t) => t - bestReal),
  };
}
