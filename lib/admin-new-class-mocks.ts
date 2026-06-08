/** Nova aula — operação Gurgel Team */

import { SCHEDULE_TODAY } from "./admin-schedule-mocks";
import { getMergedScheduleEvents } from "./schedule-runtime-store";
import { MAINTENANCE_KART_OPTIONS } from "./admin-new-maintenance-mocks";
import {
  getEffectiveScheduleSlotsForDate,
  KART_CATEGORIES,
  SKILL_LEVELS,
} from "./admin-settings-mocks";
import {
  buildGurgelTimelineWithEvents,
  type BuildGurgelTimelineOptions,
  type GurgelTimelineSlot,
} from "@/lib/schedule/gurgel-timeline";

export type {
  BuildGurgelTimelineOptions,
  GurgelSlotStatus,
  GurgelTimelineSlot,
} from "@/lib/schedule/gurgel-timeline";

export const GURGEL_OPERATIONAL = {
  id: "gurgel",
  name: "Gurgel Team",
  avatar: "/images/team-1.png",
  specialty: "Competição e formação de pilotos",
  dayOccupancy: 78,
  nextClasses: ["14:30 — Lucas Mendes", "16:30 — João Silva"],
  operationalStatus: "em_aula" as const,
  operationalStatusLabel: "Em aula",
} as const;

export type KartOwnershipMode = "rental" | "own" | "third_party";

export type NewClassStudentOption = {
  id: string;
  name: string;
  plan?: string;
  lessonsLeft?: number;
  hasOwnKart: boolean;
  ownKartNumber?: number;
  ownKartCategory?: string;
  ownKartId?: string;
  allowedCategoryIds: string[];
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
  "Horário já reservado neste período.",
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
  return getMergedScheduleEvents()
    .filter(
      (e) =>
        e.date === date &&
        e.type !== "bloqueio_pista" &&
        e.type !== "manutencao" &&
        e.status !== "cancelado",
    )
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function buildGurgelTimeline(
  date: string,
  options: BuildGurgelTimelineOptions = {},
  blockedSlotIds?: Set<string>,
): GurgelTimelineSlot[] {
  return buildGurgelTimelineWithEvents(
    date,
    options,
    getGurgelEventsForDate(date),
    blockedSlotIds ?? new Set(),
  );
}

export function getDefaultSlotForDate(
  date: string,
  options: BuildGurgelTimelineOptions = {},
): GurgelTimelineSlot | undefined {
  return buildGurgelTimeline(date, options).find(
    (s) => s.status === "available" || s.status === "level_mismatch",
  );
}

export function getSlotStatusForTime(
  date: string,
  time: string,
  options: BuildGurgelTimelineOptions = {},
): GurgelTimelineSlot | undefined {
  return buildGurgelTimeline(date, options).find((s) => s.time === time);
}

export function getAlertsForSelection(date: string, time: string): string[] {
  const slot = getSlotStatusForTime(date, time);
  const alerts: string[] = [];
  if (slot?.status === "busy") {
    alerts.push("Horário já reservado neste período.");
  }
  if (slot?.status === "conflict") {
    alerts.push("Horário muito próximo de outra sessão.");
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
  }),
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
