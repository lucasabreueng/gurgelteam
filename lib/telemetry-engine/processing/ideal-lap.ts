import type { IdealLapResult, SessionLap } from "../types";

export function calculateIdealLap(laps: SessionLap[]): IdealLapResult {
  const valid = laps.filter((l) => l.isValid && !l.isOutLap && !l.isIncomplete);

  const bestS1 = minSector(valid, 1);
  const bestS2 = minSector(valid, 2);
  const bestS3 = minSector(valid, 3);
  const idealTime = bestS1 + bestS2 + bestS3;

  const bestReal = valid.length
    ? Math.min(...valid.map((l) => l.lapTime))
    : 0;

  return {
    bestS1,
    bestS2,
    bestS3,
    idealTime,
    bestRealLap: bestReal,
    potentialGain: bestReal > 0 ? bestReal - idealTime : 0,
  };
}

function minSector(laps: SessionLap[], sector: 1 | 2 | 3): number {
  const times = laps
    .flatMap((l) => l.sectors)
    .filter((s) => s.sector === sector)
    .map((s) => s.sectorTime)
    .filter((t) => t > 0 && Number.isFinite(t));

  if (times.length === 0) return 0;
  return Math.min(...times);
}

export function formatLapTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  return seconds.toFixed(3).replace(".", ",");
}

export function formatSessionDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function formatSessionDateTime(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}
