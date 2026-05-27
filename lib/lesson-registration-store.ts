import type { GurgelSessionNotes } from "./lesson-registration-mocks";
import type { LapRow } from "./lesson-registration-laps";
import type { LessonSessionStatus } from "./lesson-registration-mocks";
import { SEED_LESSON_REGISTRATIONS } from "./lesson-registration-seeds";

export type SavedLessonRegistration = {
  sessionId: string;
  laps: LapRow[];
  notes: GurgelSessionNotes;
  method: "ocr" | "telemetry" | "manual";
  telemetryId?: string;
  savedAt: string;
};

const registrations = new Map<string, SavedLessonRegistration>(
  Object.entries(SEED_LESSON_REGISTRATIONS),
);
const statusOverrides = new Map<string, LessonSessionStatus>();

export function getSessionStatusOverride(
  sessionId: string,
): LessonSessionStatus | undefined {
  return statusOverrides.get(sessionId);
}

export function saveLessonRegistration(data: SavedLessonRegistration) {
  registrations.set(data.sessionId, data);
  statusOverrides.set(data.sessionId, "concluida");
}

export function getLessonRegistration(
  sessionId: string,
): SavedLessonRegistration | undefined {
  return (
    registrations.get(sessionId) ?? SEED_LESSON_REGISTRATIONS[sessionId]
  );
}

export function applyStatusOverrides<T extends { id: string; status: LessonSessionStatus }>(
  sessions: T[],
): T[] {
  return sessions.map((s) => {
    const override = statusOverrides.get(s.id);
    return override ? { ...s, status: override } : s;
  });
}
