import type {
  LessonRegistrationQueryDTO,
  LessonRegistrationStatusFilterDTO,
  LessonSessionDTO,
} from "@/lib/contracts/lessons/lesson.types";
import { LessonRepositoryMock } from "@/repositories/lessons/LessonRepositoryMock";
import { LessonStatus } from "@/lib/contracts/enums";

function matchesStatus(session: LessonSessionDTO, statusFilter: LessonRegistrationQueryDTO["statusFilter"]): boolean {
  if (!statusFilter) return true;
  switch (statusFilter) {
    case "pendentes":
      return session.status === LessonStatus.PENDING_REGISTRATION;
    case "em_andamento":
      return session.status === LessonStatus.IN_PROGRESS;
    case "concluidas":
      return session.status === LessonStatus.COMPLETED;
    default:
      return true;
  }
}

export const LessonServiceMock = {
  getDefaultSelectedDate(): string {
    return LessonRepositoryMock.getDefaultSelectedDate();
  },

  listSessions(query: LessonRegistrationQueryDTO): LessonSessionDTO[] {
    const base = LessonRepositoryMock.getSessionsWithOverrides();
    return base
      .filter((s) => s.date === query.date)
      .filter((s) => matchesStatus(s, query.statusFilter))
      .filter((s) => (query.category ? s.category === query.category : true))
      .filter((s) => {
        const q = query.search.trim().toLowerCase();
        if (!q) return true;
        return (
          s.studentName.toLowerCase().includes(q) ||
          s.instructorName.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.start.localeCompare(b.start));
  },

  getAllSessionsWithOverrides(): LessonSessionDTO[] {
    return LessonRepositoryMock.getSessionsWithOverrides();
  },

  getTelemetrySessionOptions() {
    return LessonRepositoryMock.getTelemetrySessionOptions();
  },

  getLessonRegistration(sessionId: string) {
    return LessonRepositoryMock.getLessonRegistration(sessionId);
  },

  saveLessonRegistration(input: Parameters<typeof LessonRepositoryMock.saveLessonRegistration>[0]) {
    LessonRepositoryMock.saveLessonRegistration(input);
  },

  getLessonCategories(sessions: LessonSessionDTO[]): string[] {
    const set = new Set(sessions.map((s) => s.category));
    return Array.from(set).sort();
  },

  // Mantemos a tipagem do frontend legada por agora (service -> repo -> legacy)
  getPilotRecentSessions(
    studentId?: string,
    studentName?: string,
  ) {
    return LessonRepositoryMock.getPilotRecentSessions(studentId, studentName);
  },

  getNoteTemplates() {
    return LessonRepositoryMock.getNoteTemplates();
  },

  statusFilterOptions: [
    { value: "" as LessonRegistrationStatusFilterDTO, label: "Todos os status" },
    { value: "pendentes" as LessonRegistrationStatusFilterDTO, label: "Pendentes" },
    { value: "em_andamento" as LessonRegistrationStatusFilterDTO, label: "Em andamento" },
    { value: "concluidas" as LessonRegistrationStatusFilterDTO, label: "Concluídas" },
  ],
};

