import type { TelemetrySessionApiDTO } from "@/lib/contracts/api/v1/telemetry.api.schemas";

export type TelemetryEvolutionPoint = { week: string; avg: number };

export type TelemetrySectorDelta = {
  sector: string;
  delta: string;
  slow: boolean;
};

function bestLapSec(session: TelemetrySessionApiDTO): number | null {
  const laps = (session.laps ?? []).filter((l) => l.valid);
  if (laps.length === 0) return null;
  return Math.min(...laps.map((l) => l.lapTimeMs)) / 1000;
}

function weekLabel(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleDateString("pt-BR", { month: "short" });
  return `${day} ${month}`;
}

export function buildEvolutionSeries(
  sessions: TelemetrySessionApiDTO[],
): TelemetryEvolutionPoint[] {
  const byWeek = new Map<string, number[]>();

  for (const s of sessions) {
    const sec = bestLapSec(s);
    if (sec == null) continue;
    const iso = s.processedAt ?? s.createdAt;
    if (!iso) continue;
    const label = weekLabel(iso);
    const arr = byWeek.get(label) ?? [];
    arr.push(sec);
    byWeek.set(label, arr);
  }

  return [...byWeek.entries()]
    .map(([week, vals]) => ({
      week,
      avg: vals.reduce((a, b) => a + b, 0) / vals.length,
    }))
    .slice(0, 8)
    .reverse();
}

export function buildSectorDeltas(
  session: TelemetrySessionApiDTO | undefined,
): TelemetrySectorDelta[] {
  const laps = (session?.laps ?? []).filter(
    (l) =>
      l.valid &&
      Array.isArray(l.sectorTimesMs) &&
      l.sectorTimesMs.length === 3,
  );
  if (laps.length === 0) {
    return [
      { sector: "S1", delta: "—", slow: false },
      { sector: "S2", delta: "—", slow: false },
      { sector: "S3", delta: "—", slow: false },
    ];
  }

  const best = laps.reduce((a, b) =>
    a.lapTimeMs < b.lapTimeMs ? a : b,
  );
  const sectors = best.sectorTimesMs!;
  const bestPerSector = [0, 1, 2].map((i) =>
    Math.min(
      ...laps.map((l) => (l.sectorTimesMs as number[])[i] / 1000),
    ),
  );

  return ["S1", "S2", "S3"].map((sector, i) => {
    const current = sectors[i]! / 1000;
    const delta = current - bestPerSector[i]!;
    const sign = delta >= 0 ? "+" : "";
    return {
      sector,
      delta: `${sign}${delta.toFixed(3)}s`,
      slow: delta > 0.1,
    };
  });
}

export function buildConsistencyPct(sessions: TelemetrySessionApiDTO[]): number {
  const bests = sessions
    .map(bestLapSec)
    .filter((v): v is number => v != null);
  if (bests.length < 2) return 0;
  const avg = bests.reduce((a, b) => a + b, 0) / bests.length;
  const spread = Math.max(...bests) - Math.min(...bests);
  if (avg <= 0) return 0;
  return Math.round(Math.max(0, Math.min(100, (1 - spread / avg) * 100)));
}

export function buildInsight(
  sessions: TelemetrySessionApiDTO[],
): string {
  if (sessions.length === 0) {
    return "Nenhuma sessão de telemetria registrada ainda. Importações e sincronizações aparecerão aqui.";
  }
  const latest = sessions[0];
  const best = bestLapSec(latest);
  if (best == null) {
    return `${sessions.length} sessão(ões) na base — aguardando voltas válidas com setores.`;
  }
  return `Última sessão (${latest.source}): melhor volta ${best.toFixed(3)}s. Total de ${sessions.length} sessões na equipe.`;
}
