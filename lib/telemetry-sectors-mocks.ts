import {
  getTelemetryPilotSession,
  TELEMETRY_DEFAULT_SESSION_ID,
  TELEMETRY_STATS,
  type TelemetryPilotSession,
} from "@/lib/student-area-mocks";

export type SectorId = "S1" | "S2" | "S3";

export type SectorPerformance = "gain" | "loss" | "neutral" | "personal_best";

export type SectorsLapRecord = {
  lap: number;
  s1: number;
  s2: number;
  s3: number;
  total: number;
  invalid?: boolean;
};

export type SectorModuleData = {
  id: SectorId;
  label: string;
  currentTime: number;
  bestSessionTime: number;
  personalBestTime: number;
  theoreticalTime: number;
  deltaVsBest: number;
  deltaVsTheoretical: number;
  consistency: number;
  variationMs: number;
  trend: number[];
  status: SectorPerformance;
};

export type SectorsInsight = {
  id: string;
  text: string;
  tone: "gain" | "loss" | "neutral" | "highlight";
};

export type SectorsPageSummary = {
  trackName: string;
  dateLabel: string;
  category: string;
  pilotName: string;
  totalLaps: number;
  bestLap: string;
  average: string;
  consistency: string;
  idealLap: string;
};

export type IdealLapData = {
  bestReal: number;
  ideal: number;
  potential: number;
};

export type TrackMapSegment = {
  id: SectorId;
  label: string;
  performance: SectorPerformance;
  d: string;
};

export type SectorsPageData = {
  session: TelemetryPilotSession;
  summary: SectorsPageSummary;
  sectors: SectorModuleData[];
  laps: SectorsLapRecord[];
  insights: SectorsInsight[];
  idealLap: IdealLapData;
  trackSegments: TrackMapSegment[];
  lapEvolution: number[];
  cumulativeDelta: number[];
};

const SECTOR_IDS: SectorId[] = ["S1", "S2", "S3"];

export function parseSectorTime(value: string | number): number {
  if (typeof value === "number") return value;
  return parseFloat(value.replace(",", ".")) || 0;
}

export function formatSectorTime(seconds: number, decimals = 3): string {
  return seconds.toFixed(decimals).replace(".", ",");
}

export function formatDelta(seconds: number): string {
  const sign = seconds >= 0 ? "+" : "";
  return `${sign}${formatSectorTime(seconds)}s`;
}

const SESSION_LAP_SPLITS: Record<
  string,
  { laps: Omit<SectorsLapRecord, "total">[]; invalidLaps?: number[] }
> = {
  "2025-05-24": {
    invalidLaps: [1],
    laps: [
      { lap: 1, s1: 13.02, s2: 19.04, s3: 24.18 },
      { lap: 2, s1: 12.62, s2: 18.48, s3: 23.75 },
      { lap: 3, s1: 12.51, s2: 18.31, s3: 23.48 },
      { lap: 4, s1: 12.48, s2: 18.22, s3: 23.38 },
      { lap: 5, s1: 12.45, s2: 18.12, s3: 23.27 },
      { lap: 6, s1: 12.58, s2: 18.35, s3: 23.62 },
      { lap: 7, s1: 12.54, s2: 18.28, s3: 23.55 },
      { lap: 8, s1: 12.52, s2: 18.24, s3: 23.49 },
    ],
  },
  "2025-05-17": {
    laps: [
      { lap: 1, s1: 12.72, s2: 18.52, s3: 23.82 },
      { lap: 2, s1: 12.65, s2: 18.41, s3: 23.68 },
      { lap: 3, s1: 12.61, s2: 18.35, s3: 23.55 },
      { lap: 4, s1: 12.58, s2: 18.29, s3: 23.48 },
      { lap: 5, s1: 12.55, s2: 18.24, s3: 23.42 },
      { lap: 6, s1: 12.68, s2: 18.48, s3: 23.71 },
      { lap: 7, s1: 12.63, s2: 18.38, s3: 23.58 },
      { lap: 8, s1: 12.59, s2: 18.32, s3: 23.51 },
      { lap: 9, s1: 12.57, s2: 18.27, s3: 23.46 },
      { lap: 10, s1: 12.64, s2: 18.36, s3: 23.54 },
      { lap: 11, s1: 12.6, s2: 18.31, s3: 23.49 },
      { lap: 12, s1: 12.62, s2: 18.34, s3: 23.52 },
    ],
  },
};

function buildLaps(sessionId: string): SectorsLapRecord[] {
  const base =
    SESSION_LAP_SPLITS[sessionId] ?? SESSION_LAP_SPLITS[TELEMETRY_DEFAULT_SESSION_ID];
  const invalid = new Set(base.invalidLaps ?? []);
  return base.laps.map((row) => ({
    ...row,
    total: row.s1 + row.s2 + row.s3,
    invalid: invalid.has(row.lap),
  }));
}

function sectorBest(laps: SectorsLapRecord[], key: SectorId): number {
  const field = key.toLowerCase() as "s1" | "s2" | "s3";
  const valid = laps.filter((l) => !l.invalid);
  return Math.min(...valid.map((l) => l[field]));
}

function sectorTrend(laps: SectorsLapRecord[], key: SectorId): number[] {
  const field = key.toLowerCase() as "s1" | "s2" | "s3";
  return laps.filter((l) => !l.invalid).map((l) => l[field]);
}

function sectorConsistency(times: number[]): number {
  if (times.length < 2) return 100;
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const variance =
    times.reduce((acc, t) => acc + (t - avg) ** 2, 0) / times.length;
  const std = Math.sqrt(variance);
  return Math.max(0, Math.min(100, Math.round(100 - std * 120)));
}

function buildSectorModules(
  sessionId: string,
  laps: SectorsLapRecord[],
): SectorModuleData[] {
  const theoretical: Record<SectorId, number> = {
    S1: 12.42,
    S2: 18.09,
    S3: 23.01,
  };
  if (sessionId !== TELEMETRY_DEFAULT_SESSION_ID) {
    theoretical.S1 += 0.08;
    theoretical.S2 += 0.12;
    theoretical.S3 += 0.1;
  }

  const labels: Record<SectorId, string> = {
    S1: "Entrada / reta principal",
    S2: "Curvas médias",
    S3: "Chicane / saída",
  };

  return SECTOR_IDS.map((id) => {
    const trend = sectorTrend(laps, id);
    const bestSession = sectorBest(laps, id);
    const current = trend[trend.length - 1] ?? bestSession;
    const personalBest = bestSession * 0.998;
    const deltaVsBest = current - bestSession;
    const deltaVsTheoretical = bestSession - theoretical[id];
    const variationMs = Math.round(
      (Math.max(...trend) - Math.min(...trend)) * 1000,
    );

    let status: SectorPerformance = "neutral";
    if (Math.abs(bestSession - personalBest) < 0.004) status = "personal_best";
    else if (deltaVsTheoretical <= 0) status = "gain";
    else if (deltaVsTheoretical > 0.05) status = "loss";

    return {
      id,
      label: labels[id],
      currentTime: current,
      bestSessionTime: bestSession,
      personalBestTime: personalBest,
      theoreticalTime: theoretical[id],
      deltaVsBest,
      deltaVsTheoretical,
      consistency: sectorConsistency(trend),
      variationMs,
      trend,
      status,
    };
  });
}

function buildInsights(sectors: SectorModuleData[], laps: SectorsLapRecord[]): SectorsInsight[] {
  const worst = [...sectors].sort(
    (a, b) => b.deltaVsTheoretical - a.deltaVsTheoretical,
  )[0];
  const valid = laps.filter((l) => !l.invalid);
  const last3 = valid.slice(-3);
  const first3 = valid.slice(0, 3);
  const avgLast =
    last3.reduce((a, l) => a + l.total, 0) / Math.max(1, last3.length);
  const avgFirst =
    first3.reduce((a, l) => a + l.total, 0) / Math.max(1, first3.length);
  const best = Math.min(...valid.map((l) => l.total));
  const avgAll = valid.reduce((a, l) => a + l.total, 0) / valid.length;

  const items: SectorsInsight[] = [
    {
      id: "i1",
      text: `Seu maior potencial está no ${worst.id} (+${formatSectorTime(worst.deltaVsTheoretical)}s vs teórico)`,
      tone: "highlight",
    },
    {
      id: "i2",
      text:
        avgLast < avgFirst
          ? "Sua consistência melhorou nas últimas 3 voltas"
          : "Mantenha o ritmo das últimas voltas para estabilizar a sessão",
      tone: avgLast < avgFirst ? "gain" : "neutral",
    },
    {
      id: "i3",
      text: "Você perde tempo na saída do setor 3 — foco na retomada",
      tone: "loss",
    },
    {
      id: "i4",
      text: `Seu ritmo médio está ${formatSectorTime(avgAll - best)}s acima da melhor volta`,
      tone: "neutral",
    },
  ];
  return items;
}

function buildTrackSegments(sectors: SectorModuleData[]): TrackMapSegment[] {
  return [
    {
      id: "S1",
      label: "S1",
      performance: sectors[0]?.status ?? "neutral",
      d: "M 40 120 Q 80 40 140 50 L 180 55",
    },
    {
      id: "S2",
      label: "S2",
      performance: sectors[1]?.status ?? "neutral",
      d: "M 180 55 Q 240 60 280 120 L 300 180",
    },
    {
      id: "S3",
      label: "S3",
      performance: sectors[2]?.status ?? "neutral",
      d: "M 300 180 Q 260 240 180 250 L 60 230 Q 30 200 40 120",
    },
  ];
}

export function getSectorsPageData(sessionId: string): SectorsPageData {
  const session = getTelemetryPilotSession(sessionId);
  const laps = buildLaps(sessionId);
  const valid = laps.filter((l) => !l.invalid);
  const sectors = buildSectorModules(sessionId, laps);
  const bestReal = Math.min(...valid.map((l) => l.total));
  const ideal = sectors.reduce((a, s) => a + s.theoreticalTime, 0);

  const lapEvolution = valid.map((l) => l.total);
  const cumulativeDelta = lapEvolution.map((t) => t - bestReal);

  return {
    session,
    summary: {
      trackName: session.trackName,
      dateLabel: session.dateLabel,
      category: "Competidor · Avançado",
      pilotName: "Lucas Mendes",
      totalLaps: session.totalLaps,
      bestLap: session.bestLap,
      average: TELEMETRY_STATS.average,
      consistency: TELEMETRY_STATS.consistency,
      idealLap: TELEMETRY_STATS.bestTheoretical,
    },
    sectors,
    laps,
    insights: buildInsights(sectors, laps),
    idealLap: {
      bestReal,
      ideal,
      potential: bestReal - ideal,
    },
    trackSegments: buildTrackSegments(sectors),
    lapEvolution,
    cumulativeDelta,
  };
}

export type LapCellHighlight = "session_best" | "personal_best" | null;

export function getLapCellHighlight(
  laps: SectorsLapRecord[],
  lap: SectorsLapRecord,
  sector: SectorId,
): LapCellHighlight {
  if (lap.invalid) return null;
  const field = sector.toLowerCase() as "s1" | "s2" | "s3";
  const value = lap[field];
  const valid = laps.filter((l) => !l.invalid);
  const sessionBest = Math.min(...valid.map((l) => l[field]));
  const bestLapTotal = Math.min(...valid.map((l) => l.total));

  if (Math.abs(value - sessionBest) >= 0.001) return null;
  if (Math.abs(lap.total - bestLapTotal) < 0.001) return "personal_best";
  return "session_best";
}

export function compareLaps(
  a: SectorsLapRecord,
  b: SectorsLapRecord,
): {
  totalDelta: number;
  sectors: { id: SectorId; delta: number; faster: "a" | "b" | "tie" }[];
} {
  const sectors = SECTOR_IDS.map((id) => {
    const field = id.toLowerCase() as "s1" | "s2" | "s3";
    const delta = a[field] - b[field];
    let faster: "a" | "b" | "tie" = "tie";
    if (delta < -0.001) faster = "a";
    if (delta > 0.001) faster = "b";
    return { id, delta, faster };
  });
  return { totalDelta: a.total - b.total, sectors };
}
