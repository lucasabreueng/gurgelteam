import {
  LESSON_SESSIONS,
  NOTE_TEMPLATES,
  TELEMETRY_SESSION_OPTIONS,
  getPilotRecentSessions,
  type LessonSession,
  type LessonRegistrationStatusFilter,
  type TelemetrySessionOption,
  type LessonSessionStatus,
} from "@/lib/lesson-registration-mocks";
import type {
  LessonNoteTemplateDTO,
  PilotRecentSessionDTO,
} from "@/lib/contracts/lessons/lesson-registration.types";
import { ScheduleRepositoryMock } from "@/repositories/schedule/ScheduleRepositoryMock";
import { applyStatusOverrides, getLessonRegistration, saveLessonRegistration } from "@/lib/lesson-registration-store";
import type { LessonSessionDTO, LessonRegistrationQueryDTO } from "@/lib/contracts/lessons/lesson.types";
import { LessonStatus } from "@/lib/contracts/enums";
import type { LessonRegistrationDTO, LessonRegistrationMethod, LapRowDTO, GurgelSessionNotesDTO } from "@/lib/contracts/lessons/lesson-registration.types";
import type { TelemetrySessionOptionDTO } from "@/lib/contracts/telemetry/telemetry.types";

function mapLegacyStatus(legacy: LessonSessionStatus): LessonStatus {
  switch (legacy) {
    case "aguardando":
      return LessonStatus.SCHEDULED;
    case "em_andamento":
      return LessonStatus.IN_PROGRESS;
    case "pendente_registro":
      return LessonStatus.PENDING_REGISTRATION;
    case "concluida":
      return LessonStatus.COMPLETED;
    default:
      return LessonStatus.SCHEDULED;
  }
}

function toLessonSessionDTO(s: LessonSession): LessonSessionDTO {
  return {
    id: s.id,
    scheduleEventId: s.scheduleEventId,
    date: s.date,
    start: s.start,
    end: s.end,
    studentName: s.studentName,
    studentId: s.studentId,
    avatar: s.avatar,
    category: s.category,
    typeLabel: s.typeLabel,
    instructorName: s.instructorName,
    kartNumber: s.kartNumber,
    status: mapLegacyStatus(s.status),
    objective: s.objective,
    previousNote: s.previousNote,
  };
}

function toLessonRegistrationDTO(
  data: ReturnType<typeof getLessonRegistration>,
): LessonRegistrationDTO | null {
  if (!data) return null;

  return {
    sessionId: data.sessionId,
    laps: data.laps as LapRowDTO[],
    notes: data.notes as GurgelSessionNotesDTO,
    method: data.method as LessonRegistrationMethod,
    telemetryId: data.telemetryId,
    savedAt: data.savedAt,
  };
}

export const LessonRepositoryMock = {
  getDefaultSelectedDate(): string {
    return ScheduleRepositoryMock.getToday();
  },

  getSessionsWithOverrides(): LessonSessionDTO[] {
    const withOverrides = applyStatusOverrides(LESSON_SESSIONS);
    return withOverrides.map(toLessonSessionDTO);
  },

  getTelemetrySessionOptions(): TelemetrySessionOptionDTO[] {
    return TELEMETRY_SESSION_OPTIONS.map((t: TelemetrySessionOption) => ({
      id: t.id,
      pilotName: t.pilotName,
      date: t.date,
      device: t.device,
      bestLap: t.bestLap,
      consistency: t.consistency,
      idealLap: t.idealLap,
      lapCount: t.lapCount,
    }));
  },

  getLessonRegistration(sessionId: string): LessonRegistrationDTO | null {
    return toLessonRegistrationDTO(getLessonRegistration(sessionId));
  },

  saveLessonRegistration(input: LessonRegistrationDTO): void {
    saveLessonRegistration({
      sessionId: input.sessionId,
      laps: input.laps,
      notes: input.notes,
      method: input.method,
      telemetryId: input.telemetryId,
      savedAt: input.savedAt,
    });
  },

  // Interface para query consistente (service faz o filtro, repo só entrega base)
  filterStatusLabelToLegacy(statusFilter: LessonRegistrationQueryDTO["statusFilter"]): LessonRegistrationStatusFilter {
    return statusFilter;
  },

  getPilotRecentSessions(
    studentId?: string,
    studentName?: string,
  ): PilotRecentSessionDTO[] {
    return getPilotRecentSessions(studentId, studentName);
  },

  getNoteTemplates(): LessonNoteTemplateDTO[] {
    return [...NOTE_TEMPLATES];
  },
};

