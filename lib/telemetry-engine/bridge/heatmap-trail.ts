import type { TelemetryTabKey } from "@/lib/contracts/student-area";
import type { ProcessedTelemetrySession, TelemetryPoint } from "../types";

export type HeatMapSegment = {
  path: { lat: number; lng: number }[];
  color: string;
};

export type HeatMapTrailResult = {
  segments: HeatMapSegment[];
  min: number;
  max: number;
};

const COLOR_STEPS = 24;

function metricValue(p: TelemetryPoint, tab: TelemetryTabKey): number | null {
  switch (tab) {
    case "velocidade":
      return p.speed;
    case "rpm":
      return p.rpm;
    case "aceleracao_lateral":
      return p.lateralG;
    case "aceleracao_longitudinal":
      return p.longitudinalG;
    case "giro":
      return p.gyro;
    default:
      return null;
  }
}

/** Azul (baixo) → verde → amarelo → vermelho (alto). */
export function heatMapColor(normalized: number): string {
  const t = Math.max(0, Math.min(1, normalized));
  const hue = (1 - t) * 240;
  return `hsl(${hue.toFixed(0)}, 88%, 46%)`;
}

function quantizeNormalized(value: number, min: number, max: number): number {
  if (max <= min) return 0.5;
  const raw = (value - min) / (max - min);
  const step = Math.round(raw * (COLOR_STEPS - 1)) / (COLOR_STEPS - 1);
  return Math.max(0, Math.min(1, step));
}

function findLap(session: ProcessedTelemetrySession, lapNumber: number) {
  return session.laps.find((l) => l.lapNumber === lapNumber && !l.isOutLap);
}

export function buildHeatMapTrailForLap(
  session: ProcessedTelemetrySession,
  lapNumber: number,
  metric: TelemetryTabKey,
): HeatMapTrailResult | null {
  const lap = findLap(session, lapNumber);
  if (!lap) return null;

  const points = session.points.slice(lap.startIndex, lap.endIndex + 1).filter(
    (p) =>
      Number.isFinite(p.latitude) &&
      Number.isFinite(p.longitude) &&
      metricValue(p, metric) != null &&
      Number.isFinite(metricValue(p, metric)!),
  );

  if (points.length < 2) return null;

  const values = points.map((p) => metricValue(p, metric)!);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const segments: HeatMapSegment[] = [];

  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const avg = (values[i] + values[i + 1]) / 2;
    const color = heatMapColor(quantizeNormalized(avg, min, max));
    const path = [
      { lat: a.latitude, lng: a.longitude },
      { lat: b.latitude, lng: b.longitude },
    ];

    const last = segments[segments.length - 1];
    if (last && last.color === color) {
      last.path.push(path[1]);
    } else {
      segments.push({ path: [...path], color });
    }
  }

  return segments.length > 0 ? { segments, min, max } : null;
}
