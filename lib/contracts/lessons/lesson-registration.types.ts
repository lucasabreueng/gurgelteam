export type LessonRegistrationMethod = "ocr" | "telemetry" | "manual";

export type LapRowDTO = {
  id: string;
  lap: number;
  s1: string;
  s2: string;
  s3: string;
  total: string;
};

export type GurgelSessionNotesDTO = {
  positives: string;
  improvements: string;
  recommendations: string;
  general: string;
};

export type PilotRecentSessionDTO = {
  id: string;
  date: string;
  label: string;
  bestLap: string;
  consistency: number;
};

export type LessonNoteTemplateDTO = {
  id: string;
  label: string;
  text: string;
};

export type LessonRegistrationDTO = {
  sessionId: string;
  laps: LapRowDTO[];
  notes: GurgelSessionNotesDTO;
  method: LessonRegistrationMethod;
  telemetryId?: string;
  savedAt: string;
};

