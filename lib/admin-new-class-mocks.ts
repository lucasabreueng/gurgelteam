/** Nova aula — único instrutor: Gurgel */

import { SCHEDULE_EVENTS, SCHEDULE_TODAY } from "./admin-schedule-mocks";
import {
  formatScheduleDuration,
  getEffectiveScheduleSlotsForDate,
  KART_CATEGORIES,
  scheduleSlotDurationMinutes,
  SKILL_LEVELS,
} from "./admin-settings-mocks";
import { MAINTENANCE_KART_OPTIONS } from "./admin-new-maintenance-mocks";

/** ID usado na agenda mock existente (Ricardo Gurgel) */
export const GURGEL_SCHEDULE_INSTRUCTOR_ID = "i1";

export const GURGEL_INSTRUCTOR = {
  id: "gurgel",
  name: "Gurgel",
  avatar: "/images/team-1.png",
  specialty: "Competição e formação de pilotos",
  dayOccupancy: 78,
  nextClasses: ["14:30 — Lucas Mendes", "16:30 — João Silva"],
  operationalStatus: "em_aula" as const,
  operationalStatusLabel: "Em aula",
} as const;

export type GurgelSlotStatus =
  | "available"
  | "busy"
  | "break"
  | "conflict"
  | "level_mismatch";

export type KartOwnershipMode = "rental" | "own" | "third_party";

export type NewClassStudentOption = {
  id: string;
  name: string;
  plan?: string;
  lessonsLeft?: number;
  hasOwnKart: boolean;
  ownKartNumber?: number;
  ownKartCategory?: string;
  /** Categorias liberadas para o aluno */
  allowedCategoryIds: string[];
  /** Nível atual do aluno */
  levelId: string;
};

export const NEW_CLASS_STUDENTS: NewClassStudentOption[] = [
  {
    id: "s1",
    name: "Lucas Mendes",
    plan: "Pacote competição",
    lessonsLeft: 2,
    hasOwnKart: false,
    allowedCategoryIds: ["f400"],
    levelId: "lvl-iniciante",
  },
  {
    id: "s2",
    name: "Ana Ribeiro",
    plan: "Pacote 20 aulas",
    lessonsLeft: 8,
    hasOwnKart: false,
    allowedCategoryIds: ["mirim-cadete", "f400"],
    levelId: "lvl-intermediario",
  },
  {
    id: "s3",
    name: "João Silva",
    plan: "Avulso",
    lessonsLeft: 0,
    hasOwnKart: false,
    allowedCategoryIds: ["125cc"],
    levelId: "lvl-avancado",
  },
  {
    id: "s4",
    name: "Marina Costa",
    plan: "Pacote F400",
    lessonsLeft: 5,
    hasOwnKart: true,
    ownKartNumber: 18,
    ownKartCategory: "F400",
    allowedCategoryIds: ["f400"],
    levelId: "lvl-avancado",
  },
  {
    id: "s5",
    name: "Pedro Alves",
    plan: "Pacote 10 aulas",
    lessonsLeft: 3,
    hasOwnKart: true,
    ownKartNumber: 31,
    ownKartCategory: "F400",
    allowedCategoryIds: ["f400", "125cc"],
    levelId: "lvl-competidor",
  },
];

export function getCategoryLabel(categoryId: string): string {
  return KART_CATEGORIES.find((c) => c.id === categoryId)?.name ?? categoryId;
}

export function getLevelLabel(levelId: string): string {
  return SKILL_LEVELS.find((l) => l.id === levelId)?.name ?? levelId;
}

export const GURGEL_CLASS_ALERTS = [
  "Gurgel já possui aula às 16h.",
  "Horário muito próximo da próxima sessão.",
  "Carga operacional elevada no período.",
];

export const GURGEL_SMART_SUGGESTION =
  "Horário ideal encontrado entre 15:00 e 16:00.";

export const DEFAULT_CLASS_DATE = SCHEDULE_TODAY;

function parseHour(time: string): number {
  return parseInt(time.slice(0, 2), 10);
}

function defaultClassTimeForDate(date: string): string {
  const first = getEffectiveScheduleSlotsForDate(date)[0];
  return first?.start ?? "08:00";
}

export const DEFAULT_CLASS_TIME = defaultClassTimeForDate(SCHEDULE_TODAY);

export function getGurgelEventsForDate(date: string) {
  return SCHEDULE_EVENTS.filter(
    (e) =>
      e.date === date &&
      e.instructorId === GURGEL_SCHEDULE_INSTRUCTOR_ID &&
      e.type !== "bloqueio_pista" &&
      e.type !== "manutencao"
  ).sort((a, b) => a.start.localeCompare(b.start));
}

export type GurgelTimelineSlot = {
  slotId: string;
  time: string;
  end: string;
  durationMinutes: number;
  durationLabel: string;
  status: GurgelSlotStatus;
  title: string;
  detail?: string;
  eventId?: string;
  categoryId: string;
  levelId: string;
  categoryName: string;
  levelName: string;
};

export type BuildGurgelTimelineOptions = {
  categoryId?: string;
  studentLevelId?: string;
};

export function buildGurgelTimeline(
  date: string,
  options: BuildGurgelTimelineOptions = {}
): GurgelTimelineSlot[] {
  const { categoryId, studentLevelId } = options;
  const events = getGurgelEventsForDate(date);
  let scheduleSlots = getEffectiveScheduleSlotsForDate(date);

  if (categoryId) {
    scheduleSlots = scheduleSlots.filter((s) => s.categoryId === categoryId);
  }

  return scheduleSlots.map((slot) => {
    const durationMinutes = scheduleSlotDurationMinutes(slot.start, slot.end);
    const durationLabel = formatScheduleDuration(durationMinutes);
    const categoryName = getCategoryLabel(slot.categoryId);
    const levelName = getLevelLabel(slot.levelId);
    const event = events.find(
      (e) =>
        e.start === slot.start || parseHour(e.start) === parseHour(slot.start)
    );

    const base = {
      slotId: slot.id,
      time: slot.start,
      end: slot.end,
      durationMinutes,
      durationLabel,
      categoryId: slot.categoryId,
      levelId: slot.levelId,
      categoryName,
      levelName,
    };

    if (event) {
      return {
        ...base,
        status: "busy" as const,
        title: "Ocupado",
        detail: event.student,
        eventId: event.id,
      };
    }

    const levelMismatch =
      studentLevelId && slot.levelId !== studentLevelId;

    return {
      ...base,
      status: levelMismatch ? ("level_mismatch" as const) : ("available" as const),
      title: levelMismatch ? "Outro nível" : "Disponível",
    };
  });
}

export function getDefaultSlotForDate(
  date: string,
  options: BuildGurgelTimelineOptions = {}
): GurgelTimelineSlot | undefined {
  return buildGurgelTimeline(date, options).find(
    (s) => s.status === "available" || s.status === "level_mismatch"
  );
}

export function getSlotStatusForTime(
  date: string,
  time: string,
  options: BuildGurgelTimelineOptions = {}
): GurgelTimelineSlot | undefined {
  return buildGurgelTimeline(date, options).find((s) => s.time === time);
}

export function getAlertsForSelection(
  date: string,
  time: string
): string[] {
  const slot = getSlotStatusForTime(date, time);
  const alerts: string[] = [];
  if (slot?.status === "busy") {
    alerts.push("Gurgel já possui aula neste horário.");
  }
  if (slot?.status === "conflict") {
    alerts.push("Horário muito próximo de outra sessão do Gurgel.");
  }
  if (slot && parseHour(slot.time) >= 17) {
    alerts.push("Carga operacional elevada no período.");
  }
  return alerts;
}

export function formatClassDateTime(date: string, time: string): string {
  const d = new Date(date + "T12:00:00");
  const label = d.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return `${label}, ${time}`;
}

export const NEW_CLASS_KARTS = MAINTENANCE_KART_OPTIONS.slice(0, 8).map(
  (k) => ({
    id: k.id,
    number: k.number,
    category: k.categoryName,
  })
);

export const NEW_CLASS_THIRD_PARTY_KARTS = [
  {
    id: "tk-22",
    number: 22,
    category: "Competição",
    ownerName: "Equipe Velocity",
  },
  {
    id: "tk-18",
    number: 18,
    category: "F400",
    ownerName: "João Silva",
  },
  {
    id: "tk-31",
    number: 31,
    category: "F400",
    ownerName: "Marina Costa",
  },
] as const;
