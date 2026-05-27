import type { LapQualityIssue, SessionLap } from "../types";

export type { LapQualityIssue } from "../types";

function sectorNumbers(lap: SessionLap): (1 | 2 | 3)[] {
  return lap.sectors.map((s) => s.sector);
}

/** Voltas que permanecem sem S1/S2/S3 após recuperação automática pelo traçado. */
export function diagnoseLapSectorIssues(laps: SessionLap[]): LapQualityIssue[] {
  const issues: LapQualityIssue[] = [];

  for (const lap of laps) {
    if (lap.isOutLap) continue;

    const present = sectorNumbers(lap);
    const missing = ([1, 2, 3] as const).filter((s) => !present.includes(s));

    if (missing.length === 0 && lap.isValid) continue;

    const parts: string[] = [];
    if (missing.length > 0) {
      parts.push(`sem passagem por ${missing.map((s) => `S${s}`).join(", ")}`);
    }
    if (!lap.isValid && missing.length === 0) {
      parts.push("tempo ou GPS inválido");
    }

    issues.push({
      lapNumber: lap.lapNumber,
      missingSectors: [...missing],
      presentSectors: present,
      lapTime: lap.lapTime,
      reason: parts.join(" · ") || "volta incompleta",
    });
  }

  return issues;
}
