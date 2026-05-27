/** Central de Registro de Aulas — dados derivados da agenda */

import {
  SCHEDULE_EVENTS,
  SCHEDULE_TODAY,
  formatEventCategory,
  type ScheduleEvent,
} from "./admin-schedule-mocks";

export type LessonSessionStatus =
  | "aguardando"
  | "em_andamento"
  | "pendente_registro"
  | "concluida";

/** Filtro de status na barra de filtros (vazio = todos do dia). */
export type LessonRegistrationStatusFilter =
  | ""
  | "pendentes"
  | "em_andamento"
  | "concluidas";

export type LessonSession = {
  id: string;
  scheduleEventId: string;
  date: string;
  start: string;
  end: string;
  studentName: string;
  studentId?: string;
  avatar: string;
  category: string;
  typeLabel: string;
  instructorName: string;
  kartNumber: number;
  status: LessonSessionStatus;
  objective?: string;
  previousNote?: string;
};

export type PilotRecentSession = {
  id: string;
  date: string;
  label: string;
  bestLap: string;
  consistency: number;
};

export type TelemetrySessionOption = {
  id: string;
  pilotName: string;
  date: string;
  device: string;
  bestLap: string;
  consistency: number;
  idealLap: string;
  lapCount: number;
};

export type GurgelSessionNotes = {
  positives: string;
  improvements: string;
  recommendations: string;
  general: string;
};

export const NOTE_TEMPLATES = [
  {
    id: "s2",
    label: "Consistência S2",
    text: "Melhorou bastante a consistência no S2, mas ainda está antecipando a frenagem no S3.",
  },
  {
    id: "brake",
    label: "Frenagem",
    text: "Trabalhar ponto de frenagem mais tardio e liberar o volante na saída.",
  },
  {
    id: "line",
    label: "Linha",
    text: "Linha de corrida mais limpa; manter foco na tangência do setor 1.",
  },
] as const;

const AVATARS = [
  "/images/team-1.png",
  "/images/team-2.png",
  "/images/team-3.png",
  "/images/team-4.png",
  "/images/team-5.png",
  "/images/team-6.png",
];

const STUDENT_IDS: Record<string, string> = {
  "Lucas Mendes": "c1",
  "Ana Ribeiro": "c2",
  "Pedro Alves": "c3",
  "João Silva": "c5",
  "Marina Souza": "c6",
};

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function mapScheduleStatus(
  event: ScheduleEvent,
  override?: LessonSessionStatus,
): LessonSessionStatus {
  if (override) return override;
  if (event.status === "finalizado") return "pendente_registro";
  if (event.status === "em_andamento") return "em_andamento";
  if (event.status === "confirmado") {
    if (event.date === SCHEDULE_TODAY && event.start <= "12:00") {
      return "pendente_registro";
    }
    return "aguardando";
  }
  return "aguardando";
}

function isRegisterableEvent(event: ScheduleEvent): boolean {
  if (event.type === "manutencao") return false;
  if (event.student === "—" || !event.student.trim()) return false;
  return true;
}

function buildSession(
  event: ScheduleEvent,
  index: number,
  statusOverride?: LessonSessionStatus,
): LessonSession {
  return {
    id: `ls-${event.id}`,
    scheduleEventId: event.id,
    date: event.date,
    start: event.start,
    end: event.end,
    studentName: event.student,
    studentId: STUDENT_IDS[event.student],
    avatar: AVATARS[index % AVATARS.length],
    category: formatEventCategory(event.category),
    typeLabel: event.typeLabel,
    instructorName: event.instructorName,
    kartNumber: event.kartNumber,
    status: mapScheduleStatus(event, statusOverride),
    objective: event.objective,
    previousNote: event.note,
  };
}

const STATUS_OVERRIDES: Record<string, LessonSessionStatus> = {
  e1: "concluida",
  e3: "pendente_registro",
  e5: "em_andamento",
};

export function getLessonSessionsFromSchedule(): LessonSession[] {
  const e3 = SCHEDULE_EVENTS.find((e) => e.id === "e3");
  const e2b = SCHEDULE_EVENTS.find((e) => e.id === "e2b");
  const extra: ScheduleEvent[] = [];
  if (e3) {
    extra.push({
      ...e3,
      id: "e3-tomorrow",
      date: addDays(SCHEDULE_TODAY, 1),
      start: "09:00",
      end: "10:00",
      status: "confirmado",
    });
  }
  if (e2b) {
    extra.push({
      ...e2b,
      id: "e2b-week",
      date: addDays(SCHEDULE_TODAY, 3),
      start: "14:00",
      end: "15:00",
      status: "confirmado",
    });
  }

  const all = [...SCHEDULE_EVENTS, ...extra];

  return all
    .filter(isRegisterableEvent)
    .map((event, i) =>
      buildSession(event, i, STATUS_OVERRIDES[event.id]),
    )
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.start.localeCompare(b.start),
    );
}

export const LESSON_SESSIONS = getLessonSessionsFromSchedule();

export const TELEMETRY_SESSION_OPTIONS: TelemetrySessionOption[] = [
  {
    id: "tel-1",
    pilotName: "Lucas Mendes",
    date: "20/05/2025",
    device: "MyChron",
    bestLap: "54.821",
    consistency: 91,
    idealLap: "54.612",
    lapCount: 24,
  },
  {
    id: "tel-2",
    pilotName: "Ana Ribeiro",
    date: "18/05/2025",
    device: "Alfano",
    bestLap: "52.104",
    consistency: 94,
    idealLap: "51.880",
    lapCount: 18,
  },
  {
    id: "tel-3",
    pilotName: "Pedro Alves",
    date: "15/05/2025",
    device: "MyChron",
    bestLap: "58.902",
    consistency: 72,
    idealLap: "58.440",
    lapCount: 12,
  },
];

export function getPilotRecentSessions(
  studentId?: string,
  studentName?: string,
): PilotRecentSession[] {
  const key = studentId ?? studentName ?? "";
  const base: PilotRecentSession[] = [
    { id: "pr1", date: "18/05", label: "Treino F400", bestLap: "55.210s", consistency: 88 },
    { id: "pr2", date: "12/05", label: "Aula técnica", bestLap: "55.440s", consistency: 85 },
    { id: "pr3", date: "08/05", label: "Treino livre", bestLap: "56.102s", consistency: 79 },
  ];
  if (key.includes("c1") || key.includes("Lucas")) {
    return [
      { id: "pr0", date: "20/05", label: "Treino avançado", bestLap: "54.821s", consistency: 91 },
      ...base,
    ];
  }
  return base;
}

export function filterLessonSessions(
  sessions: LessonSession[],
  opts: {
    date: string;
    statusFilter: LessonRegistrationStatusFilter;
    category: string;
    search: string;
  },
): LessonSession[] {
  let list = sessions.filter((s) => s.date === opts.date);

  if (opts.statusFilter === "pendentes") {
    list = list.filter(
      (s) =>
        s.status === "pendente_registro" || s.status === "aguardando",
    );
  } else if (opts.statusFilter === "em_andamento") {
    list = list.filter((s) => s.status === "em_andamento");
  } else if (opts.statusFilter === "concluidas") {
    list = list.filter((s) => s.status === "concluida");
  }

  if (opts.category) {
    list = list.filter(
      (s) => s.category.toLowerCase() === opts.category.toLowerCase(),
    );
  }

  const q = opts.search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (s) =>
        s.studentName.toLowerCase().includes(q) ||
        s.typeLabel.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    );
  }

  return list;
}

export const SESSION_STATUS_LABELS: Record<LessonSessionStatus, string> = {
  aguardando: "Aguardando",
  em_andamento: "Em andamento",
  pendente_registro: "Pendente de registro",
  concluida: "Concluída",
};

export function countSessionsByBucket(sessions: LessonSession[], today: string) {
  const tomorrow = addDays(today, 1);
  return {
    hoje: sessions.filter((s) => s.date === today).length,
    pendentes: sessions.filter(
      (s) =>
        s.status === "pendente_registro" || s.status === "em_andamento",
    ).length,
    concluidas: sessions.filter((s) => s.status === "concluida").length,
    proximas: sessions.filter(
      (s) => s.date >= tomorrow && s.status === "aguardando",
    ).length,
  };
}
