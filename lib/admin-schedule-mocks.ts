/** Dados mockados — Agenda operacional Gurgel Team */

export type ScheduleViewKey = "day" | "week";

export type UpcomingDaySummary = {
  date: string;
  label: string;
  shortLabel: string;
  isToday: boolean;
  bookingCount: number;
  occupancyPercent: number;
  freeSlots: number;
  operationalStatus: "normal" | "busy" | "alert" | "empty";
  conflictCount: number;
};

export type TimelineRow =
  | {
      kind: "free";
      time: string;
      category: string;
    }
  | { kind: "event"; time: string; events: ScheduleEvent[] };

export type AvailableKartItem = { number: number; category?: string };
export type AvailableInstructorItem = {
  id: string;
  name: string;
  nextFree?: string;
};

export type OperationalSidebarAlert = {
  id: string;
  message: string;
  tone: "urgent" | "warn" | "info";
};

/** Data de referência da operação mock (hoje no paddock) */
export const SCHEDULE_TODAY = "2026-05-21";

export const SCHEDULE_MONTH_YEAR = 2026;
export const SCHEDULE_MONTH_NUMBER = 5;

export type MonthCalendarCell = {
  date: string | null;
  dayNumber: number | null;
};

/** Grade do mês (semana começa na segunda) */
export function buildMonthCalendarCells(
  year: number,
  month: number
): MonthCalendarCell[] {
  const first = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startOffset = (first.getDay() + 6) % 7;
  const cells: MonthCalendarCell[] = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push({ date: null, dayNumber: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ date, dayNumber: d });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: null, dayNumber: null });
  }
  return cells;
}

export function getEventsGroupedByDate(
  events: ScheduleEvent[]
): Record<string, ScheduleEvent[]> {
  const map: Record<string, ScheduleEvent[]> = {};
  for (const e of events) {
    if (!map[e.date]) map[e.date] = [];
    map[e.date].push(e);
  }
  for (const key of Object.keys(map)) {
    map[key].sort((a, b) => a.start.localeCompare(b.start));
  }
  return map;
}

export type ScheduleEventType =
  | "aula_individual"
  | "aula_grupo"
  | "treino_livre"
  | "treino_avancado"
  | "telemetria"
  | "campeonato"
  | "manutencao"
  | "reserva_kart"
  | "bloqueio_pista";

export type ScheduleEventStatus =
  | "confirmado"
  | "pendente"
  | "em_andamento"
  | "finalizado"
  | "cancelado"
  | "reagendado"
  | "no_show"
  | "aguardando_pagamento";

export type PaymentStatus = "pago" | "pendente" | "vencido" | "pacote";

export type KartScheduleStatus =
  | "disponivel"
  | "reservado"
  | "em_treino"
  | "manutencao"
  | "bloqueado_checklist";

export type ScheduleKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sparkline: number[];
};

export type ScheduleEvent = {
  id: string;
  date: string;
  start: string;
  end: string;
  student: string;
  studentPhone?: string;
  type: ScheduleEventType;
  typeLabel: string;
  instructorId: string;
  instructorName: string;
  kartNumber: number;
  kartId: string;
  status: ScheduleEventStatus;
  payment: PaymentStatus;
  note?: string;
  category?: string;
  plan?: string;
  lessonsLeft?: number;
  objective?: string;
};

export type ScheduleInstructor = {
  id: string;
  name: string;
  avatar: string;
  occupancy: number;
  freeSlots: string[];
  studentsToday: string[];
  status: "disponivel" | "em_aula" | "pausa";
};

export type KartScheduleRow = {
  kartId: string;
  number: number;
  status: KartScheduleStatus;
  currentSlot?: string;
  nextSlot?: string;
  reservations: number;
  maintenance?: boolean;
  checklistPending?: boolean;
  usageToday: string;
};

export type ScheduleConflict = {
  id: string;
  message: string;
  severity: "urgent" | "warn";
};

export type ScheduleInsight = {
  id: string;
  message: string;
};

export const SCHEDULE_KPIS: ScheduleKpi[] = [
  { id: "aulas", label: "Aulas hoje", value: "24", delta: "+4 vs ontem", deltaPositive: true, sparkline: [18, 20, 19, 22, 21, 23, 24] },
  { id: "treinos", label: "Treinos confirmados", value: "18", delta: "94% confirmação", deltaPositive: true, sparkline: [14, 15, 16, 17, 16, 18, 18] },
  { id: "livres", label: "Horários livres", value: "9", delta: "Pico 17h–19h", deltaPositive: true, sparkline: [12, 11, 10, 9, 10, 9, 9] },
  { id: "karts", label: "Karts disponíveis", value: "14", delta: "2 em manutenção", deltaPositive: false, sparkline: [16, 15, 15, 14, 14, 14, 14] },
  { id: "instrutores", label: "Instrutores ativos", value: "6", delta: "Todos escalados", deltaPositive: true, sparkline: [5, 6, 6, 5, 6, 6, 6] },
  { id: "ocupacao", label: "Taxa de ocupação", value: "92%", delta: "+3% semana", deltaPositive: true, sparkline: [85, 87, 88, 90, 89, 91, 92] },
  { id: "cancel", label: "Cancelamentos hoje", value: "2", delta: "1 reagendado", deltaPositive: true, sparkline: [4, 3, 2, 3, 2, 2, 2] },
  { id: "conflitos", label: "Conflitos operacionais", value: "3", delta: "Resolver agora", deltaPositive: false, sparkline: [1, 2, 2, 3, 2, 3, 3] },
];

export const SCHEDULE_VIEW_TABS: { key: ScheduleViewKey; label: string }[] = [
  { key: "day", label: "Dia" },
  { key: "week", label: "Semana" },
];

export const UPCOMING_DAYS: UpcomingDaySummary[] = [
  {
    date: "2026-05-21",
    label: "Hoje",
    shortLabel: "Qui",
    isToday: true,
    bookingCount: 8,
    occupancyPercent: 78,
    freeSlots: 4,
    operationalStatus: "busy",
    conflictCount: 3,
  },
  {
    date: "2026-05-22",
    label: "Amanhã",
    shortLabel: "Sex",
    isToday: false,
    bookingCount: 6,
    occupancyPercent: 62,
    freeSlots: 6,
    operationalStatus: "normal",
    conflictCount: 0,
  },
  {
    date: "2026-05-23",
    label: "Sábado",
    shortLabel: "Sáb",
    isToday: false,
    bookingCount: 2,
    occupancyPercent: 28,
    freeSlots: 10,
    operationalStatus: "normal",
    conflictCount: 0,
  },
  {
    date: "2026-05-24",
    label: "Domingo",
    shortLabel: "Dom",
    isToday: false,
    bookingCount: 0,
    occupancyPercent: 0,
    freeSlots: 12,
    operationalStatus: "empty",
    conflictCount: 0,
  },
  {
    date: "2026-05-25",
    label: "Segunda",
    shortLabel: "Seg",
    isToday: false,
    bookingCount: 0,
    occupancyPercent: 0,
    freeSlots: 12,
    operationalStatus: "empty",
    conflictCount: 0,
  },
  {
    date: "2026-05-26",
    label: "Terça",
    shortLabel: "Ter",
    isToday: false,
    bookingCount: 1,
    occupancyPercent: 12,
    freeSlots: 11,
    operationalStatus: "normal",
    conflictCount: 0,
  },
  {
    date: "2026-05-27",
    label: "Quarta",
    shortLabel: "Qua",
    isToday: false,
    bookingCount: 3,
    occupancyPercent: 35,
    freeSlots: 8,
    operationalStatus: "normal",
    conflictCount: 1,
  },
];

export const AVAILABLE_KARTS_NOW: AvailableKartItem[] = [
  { number: 5, category: "F400" },
  { number: 7, category: "125cc" },
  { number: 18, category: "F400" },
  { number: 3, category: "Cadete" },
  { number: 6, category: "125cc" },
  { number: 9, category: "Rental" },
];

export const AVAILABLE_INSTRUCTORS_NOW: AvailableInstructorItem[] = [
  { id: "gurgel", name: "Gurgel", nextFree: "11:00" },
];

export const OPERATIONAL_SIDEBAR_ALERTS: OperationalSidebarAlert[] = [
  {
    id: "oa1",
    message: "Kart 12 entra em manutenção às 16h",
    tone: "warn",
  },
  {
    id: "oa2",
    message: "Lucas ainda não confirmou presença",
    tone: "warn",
  },
  {
    id: "oa3",
    message: "Rafael possui conflito às 18h",
    tone: "urgent",
  },
];

export const DAY_TIMELINE_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export const EVENT_TYPE_OPTIONS: { value: ScheduleEventType | ""; label: string }[] = [
  { value: "", label: "Todos os tipos" },
  { value: "aula_individual", label: "Aula individual" },
  { value: "aula_grupo", label: "Aula em grupo" },
  { value: "treino_livre", label: "Treino livre" },
  { value: "treino_avancado", label: "Treino avançado" },
  { value: "telemetria", label: "Telemetria" },
  { value: "campeonato", label: "Campeonato" },
  { value: "manutencao", label: "Manutenção" },
  { value: "reserva_kart", label: "Reserva de kart" },
  { value: "bloqueio_pista", label: "Bloqueio de pista" },
];

export const EVENT_STATUS_OPTIONS: { value: ScheduleEventStatus | ""; label: string }[] = [
  { value: "", label: "Todos os status" },
  { value: "confirmado", label: "Confirmado" },
  { value: "pendente", label: "Pendente" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "finalizado", label: "Finalizado" },
  { value: "cancelado", label: "Cancelado" },
  { value: "reagendado", label: "Reagendado" },
  { value: "no_show", label: "No-show" },
  { value: "aguardando_pagamento", label: "Aguardando pagamento" },
];

export const INSTRUCTOR_FILTER_OPTIONS = [
  { value: "", label: "Todos instrutores" },
  { value: "i1", label: "Ricardo Gurgel" },
  { value: "i2", label: "Rafael Costa" },
  { value: "i3", label: "Ana Martins" },
];

export const CATEGORY_FILTER_OPTIONS = [
  { value: "", label: "Todas categorias" },
  { value: "125cc", label: "125cc" },
  { value: "f400", label: "F400" },
  { value: "competicao", label: "Competição" },
];

export const EVENT_TYPE_LABELS: Record<ScheduleEventType, string> = {
  aula_individual: "Aula individual",
  aula_grupo: "Aula em grupo",
  treino_livre: "Treino livre",
  treino_avancado: "Treino avançado",
  telemetria: "Telemetria",
  campeonato: "Campeonato",
  manutencao: "Manutenção",
  reserva_kart: "Reserva de kart",
  bloqueio_pista: "Bloqueio de pista",
};

export const EVENT_STATUS_LABELS: Record<ScheduleEventStatus, string> = {
  confirmado: "Confirmado",
  pendente: "Pendente",
  em_andamento: "Em andamento",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
  reagendado: "Reagendado",
  no_show: "No-show",
  aguardando_pagamento: "Aguardando pagamento",
};

export const SCHEDULE_INSTRUCTORS: ScheduleInstructor[] = [
  {
    id: "i1",
    name: "Ricardo Gurgel",
    avatar: "/images/team-1.png",
    occupancy: 88,
    freeSlots: ["11:00", "13:30"],
    studentsToday: ["Lucas Mendes", "Ana Ribeiro", "Grupo B"],
    status: "em_aula",
  },
  {
    id: "i2",
    name: "Rafael Costa",
    avatar: "/images/team-2.png",
    occupancy: 95,
    freeSlots: ["10:00"],
    studentsToday: ["João Silva", "Marina Costa"],
    status: "disponivel",
  },
  {
    id: "i3",
    name: "Ana Martins",
    avatar: "/images/team-3.png",
    occupancy: 72,
    freeSlots: ["14:00", "15:30", "18:00"],
    studentsToday: ["Pedro Alves"],
    status: "pausa",
  },
];

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: "e1",
    date: "2026-05-21",
    start: "08:30",
    end: "09:30",
    student: "Ana Ribeiro",
    studentPhone: "+55 11 98765-4321",
    type: "aula_individual",
    typeLabel: "Aula individual",
    instructorId: "i1",
    instructorName: "Ricardo Gurgel",
    kartNumber: 5,
    kartId: "k05",
    status: "finalizado",
    payment: "pago",
    category: "125cc",
    plan: "Pacote 20 aulas",
    lessonsLeft: 8,
  },
  {
    id: "e2",
    date: "2026-05-21",
    start: "10:00",
    end: "11:00",
    student: "Grupo Cadete",
    type: "aula_grupo",
    typeLabel: "Aula em grupo",
    instructorId: "i2",
    instructorName: "Rafael Costa",
    kartNumber: 3,
    kartId: "k03",
    status: "em_andamento",
    payment: "pacote",
    note: "6 alunos confirmados",
    category: "cadete",
  },
  {
    id: "e2b",
    date: "2026-05-21",
    start: "10:00",
    end: "11:00",
    student: "Pedro Alves",
    type: "aula_individual",
    typeLabel: "Aula individual",
    instructorId: "i2",
    instructorName: "Rafael Costa",
    kartNumber: 4,
    kartId: "k04",
    status: "confirmado",
    payment: "pago",
    category: "cadete",
  },
  {
    id: "e3",
    date: "2026-05-21",
    start: "14:30",
    end: "15:30",
    student: "Lucas Mendes",
    studentPhone: "+55 11 91234-5678",
    type: "treino_avancado",
    typeLabel: "Treino avançado",
    instructorId: "i1",
    instructorName: "Ricardo Gurgel",
    kartNumber: 12,
    kartId: "k12",
    status: "confirmado",
    payment: "pendente",
    note: "Foco em frenagem",
    category: "competicao",
    plan: "Pacote competição",
    lessonsLeft: 2,
    objective: "Melhorar tempo em curva lenta",
  },
  {
    id: "e4",
    date: "2026-05-21",
    start: "15:00",
    end: "16:00",
    student: "—",
    type: "manutencao",
    typeLabel: "Manutenção",
    instructorId: "i1",
    instructorName: "Oficina",
    kartNumber: 12,
    kartId: "k12",
    status: "confirmado",
    payment: "pago",
    note: "OS-2847 · retorno previsto 17h",
  },
  {
    id: "e5",
    date: "2026-05-21",
    start: "16:30",
    end: "17:30",
    student: "João Silva",
    type: "treino_livre",
    typeLabel: "Treino livre",
    instructorId: "i2",
    instructorName: "Rafael Costa",
    kartNumber: 18,
    kartId: "k18",
    status: "pendente",
    payment: "pendente",
    category: "f400",
  },
  {
    id: "e6",
    date: "2026-05-21",
    start: "17:00",
    end: "19:00",
    student: "Grupo avançado",
    type: "treino_avancado",
    typeLabel: "Treino avançado",
    instructorId: "i2",
    instructorName: "Rafael Costa",
    kartNumber: 7,
    kartId: "k07",
    status: "pendente",
    payment: "pacote",
    note: "Limite 8 pilotos",
    category: "125cc",
  },
  {
    id: "e7",
    date: "2026-05-21",
    start: "18:00",
    end: "19:30",
    student: "Telemetria — Marina",
    type: "telemetria",
    typeLabel: "Telemetria",
    instructorId: "i3",
    instructorName: "Ana Martins",
    kartNumber: 6,
    kartId: "k06",
    status: "confirmado",
    payment: "pago",
  },
  {
    id: "e8",
    date: "2026-05-21",
    start: "19:00",
    end: "21:00",
    student: "—",
    type: "bloqueio_pista",
    typeLabel: "Bloqueio de pista",
    instructorId: "i1",
    instructorName: "Operações",
    kartNumber: 0,
    kartId: "",
    status: "confirmado",
    payment: "pago",
    note: "Campeonato regional — pista fechada",
  },
  {
    id: "e9",
    date: "2026-05-22",
    start: "09:00",
    end: "10:00",
    student: "Marina Costa",
    type: "aula_individual",
    typeLabel: "Aula individual",
    instructorId: "i2",
    instructorName: "Rafael Costa",
    kartNumber: 18,
    kartId: "k18",
    status: "confirmado",
    payment: "pago",
    category: "f400",
  },
  {
    id: "e10",
    date: "2026-05-22",
    start: "14:00",
    end: "15:00",
    student: "Pedro Alves",
    type: "treino_livre",
    typeLabel: "Treino livre",
    instructorId: "i3",
    instructorName: "Ana Martins",
    kartNumber: 5,
    kartId: "k05",
    status: "confirmado",
    payment: "pacote",
  },
  {
    id: "e11",
    date: "2026-05-22",
    start: "16:00",
    end: "17:00",
    student: "Grupo F400",
    type: "aula_grupo",
    typeLabel: "Aula em grupo",
    instructorId: "i1",
    instructorName: "Ricardo Gurgel",
    kartNumber: 7,
    kartId: "k07",
    status: "pendente",
    payment: "pacote",
  },
  {
    id: "e12",
    date: "2026-05-23",
    start: "10:00",
    end: "11:30",
    student: "Campeonato amador",
    type: "campeonato",
    typeLabel: "Campeonato",
    instructorId: "i1",
    instructorName: "Operações",
    kartNumber: 0,
    kartId: "",
    status: "confirmado",
    payment: "pago",
    note: "Sábado — pista reservada",
  },
  {
    id: "e13",
    date: "2026-05-23",
    start: "15:00",
    end: "16:00",
    student: "João Silva",
    type: "treino_avancado",
    typeLabel: "Treino avançado",
    instructorId: "i2",
    instructorName: "Rafael Costa",
    kartNumber: 5,
    kartId: "k05",
    status: "confirmado",
    payment: "pago",
  },
  {
    id: "e14",
    date: "2026-05-26",
    start: "17:00",
    end: "18:00",
    student: "Lucas Mendes",
    type: "aula_individual",
    typeLabel: "Aula individual",
    instructorId: "i1",
    instructorName: "Ricardo Gurgel",
    kartNumber: 5,
    kartId: "k05",
    status: "pendente",
    payment: "pendente",
  },
  {
    id: "e15",
    date: "2026-05-27",
    start: "09:30",
    end: "10:30",
    student: "Ana Ribeiro",
    type: "aula_individual",
    typeLabel: "Aula individual",
    instructorId: "i3",
    instructorName: "Ana Martins",
    kartNumber: 3,
    kartId: "k03",
    status: "confirmado",
    payment: "pago",
  },
  {
    id: "e16",
    date: "2026-05-27",
    start: "14:00",
    end: "15:00",
    student: "Treino livre",
    type: "treino_livre",
    typeLabel: "Treino livre",
    instructorId: "i2",
    instructorName: "Rafael Costa",
    kartNumber: 7,
    kartId: "k07",
    status: "confirmado",
    payment: "pacote",
  },
  {
    id: "e17",
    date: "2026-05-20",
    start: "11:00",
    end: "12:00",
    student: "Grupo rental",
    type: "aula_grupo",
    typeLabel: "Aula em grupo",
    instructorId: "i2",
    instructorName: "Rafael Costa",
    kartNumber: 14,
    kartId: "k14",
    status: "finalizado",
    payment: "pago",
  },
  {
    id: "e18",
    date: "2026-05-19",
    start: "15:00",
    end: "16:00",
    student: "Marina Costa",
    type: "aula_individual",
    typeLabel: "Aula individual",
    instructorId: "i3",
    instructorName: "Ana Martins",
    kartNumber: 18,
    kartId: "k18",
    status: "confirmado",
    payment: "pago",
  },
  {
    id: "e19",
    date: "2026-05-28",
    start: "10:00",
    end: "11:00",
    student: "Pedro Alves",
    type: "treino_livre",
    typeLabel: "Treino livre",
    instructorId: "i1",
    instructorName: "Ricardo Gurgel",
    kartNumber: 5,
    kartId: "k05",
    status: "pendente",
    payment: "pendente",
  },
  {
    id: "e20",
    date: "2026-05-30",
    start: "14:00",
    end: "16:00",
    student: "Campeonato",
    type: "campeonato",
    typeLabel: "Campeonato",
    instructorId: "i1",
    instructorName: "Operações",
    kartNumber: 0,
    kartId: "",
    status: "confirmado",
    payment: "pago",
  },
];

export const KART_SCHEDULE_ROWS: KartScheduleRow[] = [
  { kartId: "k05", number: 5, status: "disponivel", currentSlot: "Livre", nextSlot: "11:00 reserva", reservations: 2, usageToday: "2h 10min" },
  { kartId: "k07", number: 7, status: "em_treino", currentSlot: "10:00 treino", nextSlot: "17:00 grupo", reservations: 3, usageToday: "4h 20min" },
  { kartId: "k12", number: 12, status: "manutencao", currentSlot: "Manutenção", nextSlot: "Retorno 17h", reservations: 1, maintenance: true, checklistPending: true, usageToday: "Parado" },
  { kartId: "k18", number: 18, status: "reservado", currentSlot: "16:30 João", nextSlot: "—", reservations: 1, usageToday: "1h 30min" },
  { kartId: "k03", number: 3, status: "em_treino", currentSlot: "10:00 aula", nextSlot: "14:00 livre", reservations: 2, usageToday: "3h 00min" },
];

export const SCHEDULE_CONFLICTS: ScheduleConflict[] = [
  { id: "c1", message: "Kart 12 está em manutenção e reservado às 15:00.", severity: "urgent" },
  { id: "c2", message: "Gurgel possui conflito às 16:30.", severity: "urgent" },
  { id: "c3", message: "Aluno Lucas possui pagamento pendente.", severity: "warn" },
  { id: "c4", message: "Limite de alunos excedido no treino das 18:00.", severity: "warn" },
];

export const SCHEDULE_INSIGHTS: ScheduleInsight[] = [
  { id: "s1", message: "Lucas tem pacote vencendo em 2 aulas." },
  { id: "s2", message: "Kart 07 está sem checklist." },
  { id: "s3", message: "Gurgel está acima da carga horária recomendada." },
  { id: "s4", message: "Treino das 17:00 sem confirmação." },
];

export const QUICK_ACTIONS = [
  { id: "qa1", label: "Nova aula", action: "new_class" },
  { id: "qa2", label: "Novo treino", action: "new_training" },
  { id: "qa3", label: "Agendar telemetria", action: "telemetry" },
  { id: "qa4", label: "Criar campeonato", action: "championship" },
  { id: "qa5", label: "Bloquear pista", action: "block_track" },
  { id: "qa6", label: "Reservar kart", action: "reserve_kart" },
] as const;

export const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

export function getEventDetail(id: string): ScheduleEvent | undefined {
  return SCHEDULE_EVENTS.find((e) => e.id === id);
}

export function getEventsForDate(
  events: ScheduleEvent[],
  date: string
): ScheduleEvent[] {
  return events
    .filter((e) => e.date === date)
    .sort((a, b) => a.start.localeCompare(b.start));
}

export type DayEventSlotGroup = {
  time: string;
  end: string;
  category: string;
  events: ScheduleEvent[];
  payment: PaymentStatus | null;
};

export function groupDayEventsBySlot(
  events: ScheduleEvent[],
  date: string,
): DayEventSlotGroup[] {
  const dayEvents = getEventsForDate(events, date);
  const byTime = new Map<string, ScheduleEvent[]>();

  for (const ev of dayEvents) {
    const list = byTime.get(ev.start) ?? [];
    list.push(ev);
    byTime.set(ev.start, list);
  }

  return [...byTime.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, slotEvents]) => {
      const categories = [
        ...new Set(
          slotEvents
            .map((e) => formatEventCategory(e.category))
            .filter((c) => c !== "—"),
        ),
      ];
      const category =
        categories.length === 1
          ? categories[0]
          : categories.length > 1
            ? categories.join(" · ")
            : "—";

      const hasPendente = slotEvents.some((e) => e.payment === "pendente");
      const allPago = slotEvents.every((e) => e.payment === "pago");
      const payment: PaymentStatus | null = hasPendente
        ? "pendente"
        : allPago
          ? "pago"
          : slotEvents.find((e) => e.payment === "pago" || e.payment === "pendente")
              ?.payment ?? null;

      return {
        time,
        end: slotEvents[0]?.end ?? time,
        category,
        events: slotEvents,
        payment,
      };
    });
}

export function getDaySummary(date: string): UpcomingDaySummary | undefined {
  return UPCOMING_DAYS.find((d) => d.date === date);
}

export function getWeekdayLongUpper(date: string): string {
  return new Date(`${date}T12:00:00`)
    .toLocaleDateString("pt-BR", { weekday: "long" })
    .toUpperCase();
}

export function formatMonthYearLabel(year: number, month: number): string {
  const raw = new Date(year, month - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  const titled = raw.replace(/^(\p{L})/u, (letter) => letter.toUpperCase());
  return titled.toUpperCase();
}

export function formatEventCategory(category?: string): string {
  if (!category) return "—";
  const labels: Record<string, string> = {
    "125cc": "125cc",
    cadete: "Cadete",
    competicao: "Competição",
    f400: "F400",
    rental: "Rental",
  };
  return labels[category.toLowerCase()] ?? category;
}

export function formatScheduleDateLower(date: string): string {
  const d = new Date(`${date}T12:00:00`);
  const weekday = d.toLocaleDateString("pt-BR", { weekday: "long" });
  const full = d.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${weekday}, ${full}`.toLowerCase();
}

/** Data curta para cards da agenda (dd/mm/aaaa). */
export function formatScheduleDateShort(date: string): string {
  const d = new Date(`${date}T12:00:00`);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const FREE_SLOT_CATEGORIES = [
  "125cc",
  "cadete",
  "f400",
  "competicao",
  "rental",
] as const;

const SPARSE_DAY_FREE_SLOTS = new Set(["09:00", "12:00", "14:00", "17:00"]);

export function buildDayTimeline(
  date: string,
  events: ScheduleEvent[]
): TimelineRow[] {
  const dayEvents = getEventsForDate(events, date);
  const summary = getDaySummary(date);
  const used = new Set<string>();
  const rows: TimelineRow[] = [];
  const sparseDay =
    summary &&
    summary.bookingCount > 0 &&
    summary.bookingCount <= 4;

  for (const slot of DAY_TIMELINE_SLOTS) {
    const hour = parseInt(slot.slice(0, 2), 10);
    const slotIndex = DAY_TIMELINE_SLOTS.indexOf(slot);
    const atSlot = dayEvents.filter((e) => {
      if (used.has(e.id)) return false;
      const startH = parseInt(e.start.slice(0, 2), 10);
      return startH === hour;
    });

    if (atSlot.length > 0) {
      atSlot.forEach((e) => used.add(e.id));
      rows.push({ kind: "event", time: atSlot[0].start, events: atSlot });
    } else if (!sparseDay || SPARSE_DAY_FREE_SLOTS.has(slot)) {
      rows.push({
        kind: "free",
        time: slot,
        category: FREE_SLOT_CATEGORIES[slotIndex % FREE_SLOT_CATEGORIES.length],
      });
    }
  }

  return rows;
}

export function filterScheduleEvents(
  events: ScheduleEvent[],
  filters: {
    search: string;
    instructorId: string;
    kart: string;
    type: string;
    status: string;
    category: string;
    timeSlot: string;
  }
): ScheduleEvent[] {
  const q = filters.search.trim().toLowerCase();
  return events.filter((e) => {
    if (q) {
      const hay = [
        e.student,
        e.instructorName,
        String(e.kartNumber),
        e.typeLabel,
        e.note ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.instructorId && e.instructorId !== filters.instructorId) return false;
    if (filters.kart && String(e.kartNumber) !== filters.kart) return false;
    if (filters.type && e.type !== filters.type) return false;
    if (filters.status && e.status !== filters.status) return false;
    if (filters.category && e.category !== filters.category) return false;
    if (filters.timeSlot && !e.start.startsWith(filters.timeSlot.slice(0, 2))) return false;
    return true;
  });
}

export const EVENT_RECENT_HISTORY = [
  { date: "18 mai", title: "Treino avançado", status: "Finalizado" },
  { date: "15 mai", title: "Aula individual", status: "Finalizado" },
  { date: "12 mai", title: "No-show", status: "Cancelado" },
];
