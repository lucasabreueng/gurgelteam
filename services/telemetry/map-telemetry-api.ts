import type { TelemetrySessionApiDTO } from "@/lib/contracts/api/v1/telemetry.api.schemas";
import type { TelemetryPilotSession } from "@/lib/contracts/student-area";
import { formatLapTime, formatSessionDate } from "@/lib/telemetry-engine/processing/ideal-lap";

function trackLabel(trackId: string | null | undefined): string {
  if (!trackId) return "Pista não informada";
  return trackId
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function mapTelemetrySessionToPilotSession(
  session: TelemetrySessionApiDTO,
): TelemetryPilotSession {
  const laps = (session.laps ?? []).filter((l) => l.valid);
  const bestMs = laps.reduce(
    (min, lap) => (lap.lapTimeMs < min ? lap.lapTimeMs : min),
    Number.POSITIVE_INFINITY,
  );
  const totalMs = laps.reduce((sum, lap) => sum + lap.lapTimeMs, 0);
  const dateIso = session.processedAt ?? session.createdAt ?? new Date().toISOString();

  return {
    id: session.id,
    dateLabel: formatSessionDate(dateIso),
    totalLaps: laps.length,
    bestLap:
      bestMs !== Number.POSITIVE_INFINITY
        ? formatLapTime(bestMs / 1000)
        : "—",
    totalTime:
      totalMs > 0 ? formatLapTime(totalMs / 1000) : "—",
    trackName: trackLabel(session.trackId),
  };
}
