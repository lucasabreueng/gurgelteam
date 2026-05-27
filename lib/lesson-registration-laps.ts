/** Voltas / setores — Central de Registro de Aulas */

export type LapRow = {
  id: string;
  lap: number;
  s1: string;
  s2: string;
  s3: string;
  total: string;
};

export type LapFieldKey = "s1" | "s2" | "s3" | "total";

export type LapValidationIssue = {
  lapId: string;
  field?: LapFieldKey;
  message: string;
};

export type LapSummary = {
  bestLap: string;
  bestS1: string;
  bestS2: string;
  bestS3: string;
  consistency: number;
  idealLap: string;
  lapCount: number;
};

const TIME_RE = /^(\d{1,2}:)?\d{1,2}[.,]\d{1,3}$/;

export function parseTimeToSeconds(value: string): number | null {
  const v = value.trim().replace(",", ".");
  if (!v) return null;
  if (v.includes(":")) {
    const [min, sec] = v.split(":");
    const m = Number(min);
    const s = Number(sec);
    if (!Number.isFinite(m) || !Number.isFinite(s)) return null;
    return m * 60 + s;
  }
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function formatSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const min = Math.floor(seconds / 60);
  const sec = seconds - min * 60;
  const secStr = sec.toFixed(3).padStart(min > 0 ? 6 : 4, "0");
  return min > 0 ? `${min}:${secStr}` : secStr;
}

export function isValidTimeFormat(value: string): boolean {
  if (!value.trim()) return false;
  return TIME_RE.test(value.trim().replace(",", "."));
}

export function computeTotalFromSectors(s1: string, s2: string, s3: string): string {
  const a = parseTimeToSeconds(s1);
  const b = parseTimeToSeconds(s2);
  const c = parseTimeToSeconds(s3);
  if (a === null || b === null || c === null) return "";
  return formatSeconds(a + b + c);
}

export function createEmptyLap(lapNumber: number): LapRow {
  return {
    id: `lap-${lapNumber}-${Date.now()}`,
    lap: lapNumber,
    s1: "",
    s2: "",
    s3: "",
    total: "",
  };
}

export function createDefaultLaps(count = 5): LapRow[] {
  return Array.from({ length: count }, (_, i) => createEmptyLap(i + 1));
}

export function validateLapRows(rows: LapRow[]): LapValidationIssue[] {
  const issues: LapValidationIssue[] = [];

  for (const row of rows) {
    const hasAny =
      row.s1.trim() || row.s2.trim() || row.s3.trim() || row.total.trim();
    if (!hasAny) continue;

    for (const field of ["s1", "s2", "s3", "total"] as const) {
      const val = row[field].trim();
      if (!val) {
        issues.push({
          lapId: row.id,
          field,
          message: `Volta ${row.lap}: campo vazio`,
        });
        continue;
      }
      if (!isValidTimeFormat(val)) {
        issues.push({
          lapId: row.id,
          field,
          message: `Volta ${row.lap}: formato inválido em ${field.toUpperCase()}`,
        });
      }
    }

    const sum = computeTotalFromSectors(row.s1, row.s2, row.s3);
    const totalSec = parseTimeToSeconds(row.total);
    const sumSec = parseTimeToSeconds(sum);
    if (sumSec !== null && totalSec !== null && Math.abs(sumSec - totalSec) > 0.08) {
      issues.push({
        lapId: row.id,
        field: "total",
        message: `Volta ${row.lap}: tempo não confere com S1+S2+S3`,
      });
    }
  }

  return issues;
}

export function computeLapSummary(rows: LapRow[]): LapSummary | null {
  const valid = rows
    .map((r) => ({
      row: r,
      total: parseTimeToSeconds(r.total),
      s1: parseTimeToSeconds(r.s1),
      s2: parseTimeToSeconds(r.s2),
      s3: parseTimeToSeconds(r.s3),
    }))
    .filter((x) => x.total !== null);

  if (valid.length === 0) return null;

  const totals = valid.map((x) => x.total!);
  const best = Math.min(...totals);
  const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
  const consistency = Math.max(
    0,
    Math.min(100, Math.round(100 - ((avg - best) / avg) * 100)),
  );

  const minOrNaN = (vals: (number | null)[]) => {
    const nums = vals.filter((n): n is number => n !== null);
    return nums.length ? Math.min(...nums) : NaN;
  };
  const bestS1 = minOrNaN(valid.map((x) => x.s1));
  const bestS2 = minOrNaN(valid.map((x) => x.s2));
  const bestS3 = minOrNaN(valid.map((x) => x.s3));

  const ideal =
    (Number.isFinite(bestS1) ? bestS1 : 0) +
    (Number.isFinite(bestS2) ? bestS2 : 0) +
    (Number.isFinite(bestS3) ? bestS3 : 0);

  return {
    bestLap: formatSeconds(best),
    bestS1: Number.isFinite(bestS1) ? formatSeconds(bestS1) : "—",
    bestS2: Number.isFinite(bestS2) ? formatSeconds(bestS2) : "—",
    bestS3: Number.isFinite(bestS3) ? formatSeconds(bestS3) : "—",
    consistency,
    idealLap: ideal > 0 ? formatSeconds(ideal) : "—",
    lapCount: valid.length,
  };
}
