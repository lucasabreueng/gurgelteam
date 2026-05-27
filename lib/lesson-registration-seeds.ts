import type { GurgelSessionNotes } from "./lesson-registration-mocks";
import type { LapRow } from "./lesson-registration-laps";

export type SeedLessonRegistration = {
  sessionId: string;
  laps: LapRow[];
  notes: GurgelSessionNotes;
  method: "ocr" | "telemetry" | "manual";
  telemetryId?: string;
  savedAt: string;
};

const ANA_LAPS: LapRow[] = [
  { id: "seed-e1-1", lap: 1, s1: "15.72", s2: "11.50", s3: "13.51", total: "40.73" },
  { id: "seed-e1-2", lap: 2, s1: "15.91", s2: "11.70", s3: "13.18", total: "40.79" },
  { id: "seed-e1-3", lap: 3, s1: "16.00", s2: "11.80", s3: "13.47", total: "41.27" },
  { id: "seed-e1-4", lap: 4, s1: "15.91", s2: "11.91", s3: "13.42", total: "41.24" },
  { id: "seed-e1-5", lap: 5, s1: "15.30", s2: "11.72", s3: "13.11", total: "40.13" },
];

/** Registros demo para sessões já marcadas como concluídas nos mocks. */
export const SEED_LESSON_REGISTRATIONS: Record<string, SeedLessonRegistration> = {
  "ls-e1": {
    sessionId: "ls-e1",
    method: "manual",
    laps: ANA_LAPS,
    notes: {
      general:
        "Boa evolução na consistência do S2. Manter foco na tangência na saída do S3.",
      positives: "Ritmo constante nas voltas 3 a 5; melhor aplicação do freio.",
      improvements: "Ainda antecipa um pouco a entrada do S1 nas voltas rápidas.",
      recommendations: "",
    },
    savedAt: "2026-05-21T10:15:00.000Z",
  },
};
