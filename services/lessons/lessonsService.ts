import { getDataSourceMode } from "@/lib/data-source/mode";
import type {
  LessonRegistrationQueryDTO,
  LessonRegistrationStatusFilterDTO,
  LessonSessionDTO,
} from "@/lib/contracts/lessons/lesson.types";
import { LessonStatus } from "@/lib/contracts/enums";
import { LessonRepositoryHttp } from "@/repositories/lessons/LessonRepositoryHttp";
import { LessonRepositoryMock } from "@/repositories/lessons/LessonRepositoryMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

function matchesStatus(
  session: LessonSessionDTO,
  statusFilter: LessonRegistrationQueryDTO["statusFilter"],
): boolean {
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

function filterSessionsLocally(
  sessions: LessonSessionDTO[],
  query: LessonRegistrationQueryDTO,
): LessonSessionDTO[] {
  return sessions
    .filter((s) => s.date === query.date)
    .filter((s) => matchesStatus(s, query.statusFilter))
    .filter((s) => (query.category ? s.category === query.category : true))
    .filter((s) => {
      const q = query.search.trim().toLowerCase();
      if (!q) return true;
      return (
        s.studentName.toLowerCase().includes(q) ||
        s.registeredByName.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function filterLessonSessions(
  sessions: LessonSessionDTO[],
  query: LessonRegistrationQueryDTO,
): LessonSessionDTO[] {
  return filterSessionsLocally(sessions, query);
}

export function createLessonsService() {
  return {
    getDefaultSelectedDate(): string | Promise<string> {
      return isHttpMode()
        ? LessonRepositoryHttp.getDefaultSelectedDate()
        : LessonRepositoryMock.getDefaultSelectedDate();
    },

    listSessions(
      query: LessonRegistrationQueryDTO,
    ): LessonSessionDTO[] | Promise<LessonSessionDTO[]> {
      if (isHttpMode()) {
        return LessonRepositoryHttp.fetchSessions(query);
      }
      return filterSessionsLocally(
        LessonRepositoryMock.getSessionsWithOverrides(),
        query,
      );
    },

    getAllSessionsWithOverrides(): Promise<LessonSessionDTO[]> | LessonSessionDTO[] {
      if (isHttpMode()) {
        return LessonRepositoryHttp.getDefaultSelectedDate().then((today) =>
          LessonRepositoryHttp.fetchSessionsForWeek(today),
        );
      }
      return LessonRepositoryMock.getSessionsWithOverrides();
    },

    getTelemetrySessionOptions() {
      return LessonRepositoryMock.getTelemetrySessionOptions();
    },

    getLessonRegistration(sessionId: string) {
      if (isHttpMode()) {
        return LessonRepositoryHttp.fetchLessonRegistration(sessionId);
      }
      return LessonRepositoryMock.getLessonRegistration(sessionId);
    },

    saveLessonRegistration(
      input: Parameters<typeof LessonRepositoryMock.saveLessonRegistration>[0],
    ) {
      if (isHttpMode()) {
        return LessonRepositoryHttp.saveLessonRegistration(input);
      }
      LessonRepositoryMock.saveLessonRegistration(input);
      return Promise.resolve();
    },

    getLessonCategories(sessions: LessonSessionDTO[]): string[] {
      const set = new Set(sessions.map((s) => s.category));
      return Array.from(set).sort();
    },

    getPilotRecentSessions(
      studentId?: string,
      studentName?: string,
    ) {
      return LessonRepositoryMock.getPilotRecentSessions(
        studentId,
        studentName,
      );
    },

    getNoteTemplates() {
      return LessonRepositoryMock.getNoteTemplates();
    },

    statusFilterOptions: [
      { value: "" as LessonRegistrationStatusFilterDTO, label: "Todos os status" },
      { value: "pendentes" as LessonRegistrationStatusFilterDTO, label: "Pendentes" },
      {
        value: "em_andamento" as LessonRegistrationStatusFilterDTO,
        label: "Em andamento",
      },
      { value: "concluidas" as LessonRegistrationStatusFilterDTO, label: "Concluídas" },
    ] as const,
  };
}

export type LessonsService = ReturnType<typeof createLessonsService>;

export const LessonServiceMock = createLessonsService();
