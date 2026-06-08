/** Dados mockados — Configurações administrativas Gurgel Team */

import type { ModuleKey, RoleKey } from "@/lib/contracts/enums";
import { MODULE_KEYS } from "@/lib/contracts/enums";

export { MODULE_GROUPS, MODULE_LABELS } from "@/lib/contracts/module-registry";

export type { ModuleGroupKey, ModuleKey, RoleKey } from "@/lib/contracts/enums";

function newSettingsId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export type SettingsTabKey =
  | "geral"
  | "usuarios"
  | "horarios"
  | "precos"
  | "categorias"
  | "termos"
  | "notificacoes"
  | "documentos";

export const SETTINGS_TABS: { key: SettingsTabKey; label: string }[] = [
  { key: "geral", label: "Geral" },
  { key: "usuarios", label: "Usuários e permissões" },
  { key: "horarios", label: "Horários" },
  { key: "precos", label: "Preços" },
  { key: "categorias", label: "Categorias e níveis" },
  { key: "termos", label: "Cadastro de termos" },
  { key: "notificacoes", label: "Notificações" },
  { key: "documentos", label: "Documentos" },
];

export type GeneralSettingsForm = {
  teamName: string;
  logo: string;
  cnpj: string;
  email: string;
  whatsapp: string;
  address: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  institutionalText: string;
};

export const GENERAL_SETTINGS: GeneralSettingsForm = {
  teamName: "Gurgel Team",
  logo: "/images/logo.svg",
  cnpj: "12.345.678/0001-90",
  email: "contato@gurgelteam.com.br",
  whatsapp: "5511987654321",
  address: "Av. do Kart, 1200 — Interlagos, São Paulo — SP",
  instagram: "@gurgelteam",
  tiktok: "@gurgelteam",
  facebook: "gurgelteam",
  institutionalText:
    "Equipe de kart premium com foco em evolução técnica, telemetria e formação de pilotos para competição.",
};

export type ModulePermissionSet = {
  visualizar: boolean;
  editar: boolean;
  excluir: boolean;
};

export type SettingsUserAccount = {
  id: string;
  name: string;
  modules: Record<ModuleKey, ModulePermissionSet>;
};

const ALL_MODULE_PERMISSIONS: ModulePermissionSet = {
  visualizar: true,
  editar: true,
  excluir: true,
};

const VIEW_ONLY: ModulePermissionSet = {
  visualizar: true,
  editar: false,
  excluir: false,
};

const VIEW_EDIT: ModulePermissionSet = {
  visualizar: true,
  editar: true,
  excluir: false,
};

const NO_ACCESS: ModulePermissionSet = {
  visualizar: false,
  editar: false,
  excluir: false,
};

const ALL_MODULE_KEYS = MODULE_KEYS;

function buildUserModules(
  overrides: Partial<Record<ModuleKey, ModulePermissionSet>>
): Record<ModuleKey, ModulePermissionSet> {
  const base = Object.fromEntries(
    ALL_MODULE_KEYS.map((key) => [key, { ...NO_ACCESS }])
  ) as Record<ModuleKey, ModulePermissionSet>;
  for (const key of Object.keys(overrides) as ModuleKey[]) {
    base[key] = { ...overrides[key]! };
  }
  return base;
}

export const SETTINGS_USERS: SettingsUserAccount[] = [
  {
    id: "user-administrador",
    name: "Administrador",
    modules: buildUserModules(
      Object.fromEntries(
        ALL_MODULE_KEYS.map((key) => [key, ALL_MODULE_PERMISSIONS])
      ) as Record<ModuleKey, ModulePermissionSet>
    ),
  },
  {
    id: "user-recepcao",
    name: "Recepção",
    modules: buildUserModules({
      dashboard: VIEW_ONLY,
      agenda: { visualizar: true, editar: true, excluir: false },
      registroAulas: { visualizar: true, editar: true, excluir: false },
      alunos: { visualizar: true, editar: true, excluir: false },
      karts: VIEW_ONLY,
      manutencao: VIEW_ONLY,
      pilotoFeedbacks: { visualizar: true, editar: true, excluir: false },
      pilotoPlano: { visualizar: true, editar: true, excluir: false },
    }),
  },
  {
    id: "user-financeiro",
    name: "Financeiro",
    modules: buildUserModules({
      dashboard: VIEW_ONLY,
      financeiro: { visualizar: true, editar: true, excluir: false },
      relatorios: { visualizar: true, editar: true, excluir: false },
      alunos: VIEW_ONLY,
    }),
  },
  {
    id: "user-mecanico",
    name: "Mecânico",
    modules: buildUserModules({
      dashboard: VIEW_ONLY,
      karts: { visualizar: true, editar: true, excluir: false },
      manutencao: { visualizar: true, editar: true, excluir: false },
      estoque: { visualizar: true, editar: true, excluir: false },
    }),
  },
  {
    id: "user-piloto",
    name: "Piloto",
    modules: buildUserModules({
      pilotoDashboard: VIEW_ONLY,
      pilotoAgenda: VIEW_EDIT,
      pilotoEvolucao: VIEW_ONLY,
      pilotoFeedbacks: VIEW_ONLY,
      pilotoPlano: VIEW_ONLY,
      pilotoTelemetria: VIEW_ONLY,
      pilotoResultados: VIEW_ONLY,
      pilotoMateriais: VIEW_ONLY,
      pilotoConquistas: VIEW_ONLY,
      pilotoRanking: VIEW_ONLY,
    }),
  },
  {
    id: "user-responsavel",
    name: "Responsável",
    modules: buildUserModules({
      alunos: VIEW_ONLY,
      agenda: VIEW_ONLY,
      pilotoDashboard: VIEW_ONLY,
      pilotoAgenda: VIEW_EDIT,
      pilotoEvolucao: VIEW_ONLY,
      pilotoFeedbacks: VIEW_ONLY,
      pilotoPlano: VIEW_ONLY,
      pilotoMateriais: VIEW_ONLY,
    }),
  },
  {
    id: "user-piloto-menor",
    name: "Piloto menor",
    modules: buildUserModules({
      pilotoDashboard: VIEW_ONLY,
      pilotoAgenda: VIEW_ONLY,
      pilotoEvolucao: VIEW_ONLY,
      pilotoFeedbacks: VIEW_ONLY,
      pilotoMateriais: VIEW_ONLY,
      pilotoConquistas: VIEW_ONLY,
    }),
  },
];

export function createSettingsUser(name = "Novo usuário"): SettingsUserAccount {
  return {
    id: newSettingsId("user"),
    name,
    modules: buildUserModules({}),
  };
}

export type PermissionKey =
  | "verAlunos"
  | "editarAlunos"
  | "verFinanceiro"
  | "editarAgenda"
  | "publicarResultados"
  | "alterarConfiguracoes";

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  verAlunos: "Ver alunos",
  editarAlunos: "Editar alunos",
  verFinanceiro: "Ver financeiro",
  editarAgenda: "Editar horários",
  publicarResultados: "Publicar resultados",
  alterarConfiguracoes: "Alterar configurações",
};

export type RolePermissions = Record<PermissionKey, boolean>;

export const ROLES: {
  key: RoleKey;
  title: string;
  description: string;
  permissions: RolePermissions;
}[] = [
  {
    key: "admin",
    title: "Administrador",
    description: "Acesso total à operação e configurações.",
    permissions: {
      verAlunos: true,
      editarAlunos: true,
      verFinanceiro: true,
      editarAgenda: true,
      publicarResultados: true,
      alterarConfiguracoes: true,
    },
  },
  {
    key: "recepcao",
    title: "Recepção",
    description: "Agendamentos, check-in e atendimento ao piloto.",
    permissions: {
      verAlunos: true,
      editarAlunos: false,
      verFinanceiro: false,
      editarAgenda: true,
      publicarResultados: false,
      alterarConfiguracoes: false,
    },
  },
  {
    key: "financeiro",
    title: "Financeiro",
    description: "Pacotes, cobrança e relatórios financeiros.",
    permissions: {
      verAlunos: true,
      editarAlunos: false,
      verFinanceiro: true,
      editarAgenda: false,
      publicarResultados: false,
      alterarConfiguracoes: false,
    },
  },
  {
    key: "mecanico",
    title: "Mecânico",
    description: "Frota, ordens de serviço e estoque de peças.",
    permissions: {
      verAlunos: false,
      editarAlunos: false,
      verFinanceiro: false,
      editarAgenda: false,
      publicarResultados: false,
      alterarConfiguracoes: false,
    },
  },
];

export type ScheduleTimeSlot = {
  id: string;
  start: string;
  end: string;
  /** IDs das categorias permitidas neste horário */
  categoryIds: string[];
  /** IDs dos níveis permitidos neste horário */
  levelIds: string[];
};

export type WeekDayKey =
  | "seg"
  | "ter"
  | "qua"
  | "qui"
  | "sex"
  | "sab"
  | "dom";

export type WeekDaySchedule = {
  dayKey: WeekDayKey;
  label: string;
  shortLabel: string;
  slots: ScheduleTimeSlot[];
};

const sampleSlots = (
  day: string,
  items: [string, string, string, string][]
): ScheduleTimeSlot[] =>
  items.map(([start, end, catId, levelId], i) => ({
    id: `${day}-${i}`,
    start,
    end,
    categoryIds: [catId],
    levelIds: [levelId],
  }));

export const WEEK_SCHEDULE: WeekDaySchedule[] = [
  {
    dayKey: "seg",
    label: "Segunda-feira",
    shortLabel: "Seg",
    slots: sampleSlots("seg", [
      ["08:00", "08:50", "mirim-cadete", "lvl-iniciante"],
      ["09:00", "09:50", "f400", "lvl-iniciante"],
      ["10:00", "10:50", "125cc", "lvl-intermediario"],
      ["14:00", "14:50", "f400", "lvl-avancado"],
      ["18:00", "18:50", "125cc", "lvl-competidor"],
    ]),
  },
  {
    dayKey: "ter",
    label: "Terça-feira",
    shortLabel: "Ter",
    slots: sampleSlots("ter", [
      ["08:00", "08:50", "f400", "lvl-iniciante"],
      ["10:00", "10:50", "mirim-cadete", "lvl-intermediario"],
      ["16:00", "16:50", "125cc", "lvl-avancado"],
    ]),
  },
  {
    dayKey: "qua",
    label: "Quarta-feira",
    shortLabel: "Qua",
    slots: sampleSlots("qua", [
      ["09:00", "09:50", "125cc", "lvl-iniciante"],
      ["11:00", "11:50", "mirim-cadete", "lvl-intermediario"],
      ["15:00", "15:50", "f400", "lvl-competidor"],
    ]),
  },
  {
    dayKey: "qui",
    label: "Quinta-feira",
    shortLabel: "Qui",
    slots: sampleSlots("qui", [
      ["08:00", "08:50", "125cc", "lvl-iniciante"],
      ["14:00", "14:50", "mirim-cadete", "lvl-avancado"],
      ["19:00", "19:50", "f400", "lvl-competidor"],
    ]),
  },
  {
    dayKey: "sex",
    label: "Sexta-feira",
    shortLabel: "Sex",
    slots: sampleSlots("sex", [
      ["08:00", "08:50", "mirim-cadete", "lvl-iniciante"],
      ["10:00", "10:50", "f400", "lvl-intermediario"],
      ["12:00", "12:50", "125cc", "lvl-avancado"],
      ["17:00", "17:50", "f400", "lvl-competidor"],
    ]),
  },
  {
    dayKey: "sab",
    label: "Sábado",
    shortLabel: "Sáb",
    slots: sampleSlots("sab", [
      ["08:00", "08:50", "f400", "lvl-iniciante"],
      ["09:00", "09:50", "125cc", "lvl-iniciante"],
      ["10:00", "10:50", "mirim-cadete", "lvl-intermediario"],
      ["11:00", "11:50", "f400", "lvl-avancado"],
      ["14:00", "14:50", "125cc", "lvl-competidor"],
    ]),
  },
  {
    dayKey: "dom",
    label: "Domingo",
    shortLabel: "Dom",
    slots: sampleSlots("dom", [
      ["09:00", "09:50", "mirim-cadete", "lvl-iniciante"],
      ["10:00", "10:50", "f400", "lvl-intermediario"],
    ]),
  },
];

const WEEK_DAY_KEYS: WeekDayKey[] = [
  "dom",
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
  "sab",
];

/** Dia da semana (grade) a partir de data ISO. */
export function getWeekDayKeyFromDate(isoDate: string): WeekDayKey | null {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return WEEK_DAY_KEYS[d.getDay()] ?? null;
}

/** Horários efetivos do dia (grade semanal, data específica ou exceções). */
export function getEffectiveScheduleSlotsForDate(
  isoDate: string,
  weekSchedule: WeekDaySchedule[] = WEEK_SCHEDULE,
  specificDates: SpecificDateSchedule[] = SPECIFIC_DATE_SCHEDULES,
  exceptions: ScheduleException[] = SCHEDULE_EXCEPTIONS
): ScheduleTimeSlot[] {
  const specific = specificDates.find((s) => s.date === isoDate);
  const raw = specific
    ? [...specific.slots]
    : (() => {
        const dayKey = getWeekDayKeyFromDate(isoDate);
        if (!dayKey) return [];
        return [
          ...(weekSchedule.find((d) => d.dayKey === dayKey)?.slots ?? []),
        ];
      })();

  const blocked = new Set(
    exceptions
      .filter((e) => e.date === isoDate)
      .flatMap((e) => e.slotIds)
  );

  return raw
    .filter((s) => !blocked.has(s.id))
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function scheduleSlotDurationMinutes(start: string, end: string): number {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m ?? 0);
  };
  return Math.max(0, toMinutes(end) - toMinutes(start));
}

export function formatScheduleDuration(minutes: number): string {
  if (minutes <= 0) return "—";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (rem === 0) return h === 1 ? "1h" : `${h}h`;
  return `${h}h${rem}`;
}

export function findScheduleSlot(
  days: WeekDaySchedule[],
  slotId: string
): (ScheduleTimeSlot & { dayKey: WeekDayKey; dayLabel: string }) | null {
  for (const day of days) {
    const slot = day.slots.find((s) => s.id === slotId);
    if (slot) {
      return { ...slot, dayKey: day.dayKey, dayLabel: day.label };
    }
  }
  return null;
}

export function createTimeSlot(
  categoryIds: string[],
  levelIds: string[],
): ScheduleTimeSlot {
  return {
    id: newSettingsId("slot"),
    start: "08:00",
    end: "08:50",
    categoryIds,
    levelIds,
  };
}

/** Programação específica para uma data (substitui a grade naquele dia) */
export type SpecificDateSchedule = {
  id: string;
  /** Data ISO (YYYY-MM-DD) */
  date: string;
  slots: ScheduleTimeSlot[];
};

export const SPECIFIC_DATE_SCHEDULES: SpecificDateSchedule[] = [];

export function createSpecificDateSchedule(): SpecificDateSchedule {
  const next = new Date();
  const day = next.getDay();
  const daysUntilMonday = day === 0 ? 1 : day === 1 ? 7 : (8 - day) % 7;
  next.setDate(next.getDate() + daysUntilMonday);
  return {
    id: newSettingsId("spd"),
    date: next.toISOString().slice(0, 10),
    slots: [],
  };
}

export function createSpecificDateTimeSlot(
  scheduleId: string,
  categoryIds: string[],
  levelIds: string[],
): ScheduleTimeSlot {
  return {
    id: newSettingsId("slot"),
    start: "08:00",
    end: "08:50",
    categoryIds,
    levelIds,
  };
}

/** Exceção pontual — bloqueia horários da grade em data específica */
export type ScheduleException = {
  id: string;
  /** Data ISO (YYYY-MM-DD) */
  date: string;
  /** IDs dos slots da grade semanal indisponíveis nesta data */
  slotIds: string[];
  reason: string;
};

export const SCHEDULE_EXCEPTIONS: ScheduleException[] = [
  {
    id: "ex-demo",
    date: "2025-06-02",
    slotIds: ["seg-3"],
    reason: "Evento reservado — etapa corporativa no circuito",
  },
];

export function createScheduleException(): ScheduleException {
  const next = new Date();
  const day = next.getDay();
  const daysUntilMonday = day === 0 ? 1 : day === 1 ? 7 : (8 - day) % 7;
  next.setDate(next.getDate() + daysUntilMonday);
  return {
    id: newSettingsId("ex"),
    date: next.toISOString().slice(0, 10),
    slotIds: [],
    reason: "",
  };
}

export type CategoryPrice = {
  id: string;
  name: string;
  /** Preço da aula avulsa em centavos (ex.: 28000 = R$ 280,00) */
  singleLessonPriceCents: number;
  description: string;
  includedItems: string;
};

export const CATEGORY_PRICES: CategoryPrice[] = [
  {
    id: "mirim-cadete",
    name: "Mirim / Cadete",
    singleLessonPriceCents: 28000,
    description:
      "Sessão única com briefing, pista e debriefing com a equipe técnica.",
    includedItems:
      "1 aula na pista\nBriefing de segurança\nUso de capacete e luvas",
  },
  {
    id: "f400",
    name: "F400",
    singleLessonPriceCents: 35000,
    description:
      "Sessão avulsa na categoria F400 com acompanhamento técnico.",
    includedItems:
      "1 aula na pista\nBriefing de segurança\nUso de equipamentos homologados",
  },
  {
    id: "125cc",
    name: "125cc",
    singleLessonPriceCents: 42000,
    description:
      "Aula avulsa na categoria 125cc para pilotos com experiência prévia.",
    includedItems:
      "1 aula na pista\nDebriefing técnico\nUso de equipamentos homologados",
  },
];

/** Categorias de kart cadastradas (compartilhadas com horários, níveis e planos) */
export type KartCategory = {
  id: string;
  name: string;
};

export const KART_CATEGORIES: KartCategory[] = [
  { id: "mirim-cadete", name: "Mirim / Cadete" },
  { id: "f400", name: "F400" },
  { id: "125cc", name: "125cc" },
];

export function createKartCategory(name = "Nova categoria"): KartCategory {
  return {
    id: `kart-${crypto.randomUUID().slice(0, 8)}`,
    name,
  };
}

/** Alinha preços às categorias de kart (Categorias e níveis). */
export function syncCategoryPricesFromKart(
  kartCategories: KartCategory[],
  prices: CategoryPrice[]
): CategoryPrice[] {
  return kartCategories.map((kart) => {
    const existing = prices.find((p) => p.id === kart.id);
    return {
      id: kart.id,
      name: kart.name,
      singleLessonPriceCents: existing?.singleLessonPriceCents ?? 0,
      description:
        existing?.description ??
        "Sessão única com briefing, pista e debriefing com a equipe técnica.",
      includedItems:
        existing?.includedItems ??
        "1 aula na pista\nBriefing de segurança\nUso de capacete e luvas",
    };
  });
}

export type LevelCategoryRequirement = {
  categoryId: string;
  /** Tempo em centésimos de segundo (5532 = 55,32 s) */
  timeHundredths: number;
};

/** Tempos por categoria de kart: mirim/cadete, f400, 125cc */
const levelReqs = (
  mirimCadete: number,
  f400: number,
  cc125: number
): LevelCategoryRequirement[] => [
  { categoryId: "mirim-cadete", timeHundredths: mirimCadete },
  { categoryId: "f400", timeHundredths: f400 },
  { categoryId: "125cc", timeHundredths: cc125 },
];

export type SkillLevel = {
  id: string;
  name: string;
  categoryRequirements: LevelCategoryRequirement[];
};

export const SKILL_LEVELS: SkillLevel[] = [
  {
    id: "lvl-iniciante",
    name: "Iniciante",
    categoryRequirements: levelReqs(0, 0, 0),
  },
  {
    id: "lvl-intermediario",
    name: "Intermediário",
    categoryRequirements: levelReqs(6200, 5800, 0),
  },
  {
    id: "lvl-avancado",
    name: "Avançado",
    categoryRequirements: levelReqs(5800, 5500, 5300),
  },
  {
    id: "lvl-competidor",
    name: "Competidor",
    categoryRequirements: levelReqs(5500, 5200, 5000),
  },
];

export function syncLevelRequirements(
  categories: KartCategory[],
  requirements: LevelCategoryRequirement[]
): LevelCategoryRequirement[] {
  return categories.map((cat) => {
    const existing = requirements.find((r) => r.categoryId === cat.id);
    return existing ?? { categoryId: cat.id, timeHundredths: 0 };
  });
}

/** Frota própria (aluguel) ou kart de cliente */
export type KartOwnership = "rental" | "client";

export const SETTINGS_KART_STATUSES = [
  "Disponível",
  "Em treino",
  "Manutenção",
] as const;

export type SettingsKartRow = {
  id: string;
  number: number;
  ownership: KartOwnership;
  categoryId: string;
  /** Nome do cliente (apenas karts de clientes) */
  clientName: string;
  defaultStatus: string;
  preventiveMaintenance: string;
  notes: string;
};

export const SETTINGS_KARTS: SettingsKartRow[] = [
  {
    id: "k05",
    number: 5,
    ownership: "rental",
    categoryId: "f400",
    clientName: "",
    defaultStatus: "Disponível",
    preventiveMaintenance: "A cada 40h",
    notes: "Motor revisado em mar/25",
  },
  {
    id: "k09",
    number: 9,
    ownership: "rental",
    categoryId: "mirim-cadete",
    clientName: "",
    defaultStatus: "Disponível",
    preventiveMaintenance: "A cada 35h",
    notes: "Ideal para aulas introdutórias",
  },
  {
    id: "k12",
    number: 12,
    ownership: "rental",
    categoryId: "125cc",
    clientName: "",
    defaultStatus: "Disponível",
    preventiveMaintenance: "A cada 30h",
    notes: "Setup neutro",
  },
  {
    id: "k17",
    number: 17,
    ownership: "rental",
    categoryId: "125cc",
    clientName: "",
    defaultStatus: "Em treino",
    preventiveMaintenance: "A cada 28h",
    notes: "Pneus R compound",
  },
  {
    id: "k21",
    number: 21,
    ownership: "rental",
    categoryId: "f400",
    clientName: "",
    defaultStatus: "Manutenção",
    preventiveMaintenance: "A cada 25h",
    notes: "Revisão de freios em andamento",
  },
  {
    id: "k31",
    number: 3,
    ownership: "client",
    categoryId: "125cc",
    clientName: "João Silva",
    defaultStatus: "Disponível",
    preventiveMaintenance: "Sob responsabilidade do cliente",
    notes: "Guardado no box 2",
  },
  {
    id: "k32",
    number: 7,
    ownership: "client",
    categoryId: "f400",
    clientName: "Equipe Velocity",
    defaultStatus: "Disponível",
    preventiveMaintenance: "Sob responsabilidade do cliente",
    notes: "",
  },
];

export function createSettingsKart(
  ownership: KartOwnership,
  categoryId: string,
  number: number
): SettingsKartRow {
  return {
    id: `kart-${crypto.randomUUID().slice(0, 8)}`,
    number,
    ownership,
    categoryId,
    clientName: "",
    defaultStatus: "Disponível",
    preventiveMaintenance:
      ownership === "rental" ? "A cada 40h" : "Sob responsabilidade do cliente",
    notes: "",
  };
}

export function nextSettingsKartNumber(karts: SettingsKartRow[]): number {
  const max = karts.reduce((m, k) => Math.max(m, k.number), 0);
  return max + 1;
}

export type FeedbackCriterion = {
  id: string;
  label: string;
  defaultScore: number;
};

export const FEEDBACK_CRITERIA: FeedbackCriterion[] = [
  { id: "frenagem", label: "Frenagem", defaultScore: 4 },
  { id: "tangencia", label: "Tangência", defaultScore: 3 },
  { id: "aceleracao", label: "Aceleração", defaultScore: 4 },
  { id: "postura", label: "Postura", defaultScore: 4 },
  { id: "consistencia", label: "Consistência", defaultScore: 3 },
  { id: "emocional", label: "Controle emocional", defaultScore: 4 },
  { id: "ultrapassagem", label: "Ultrapassagem", defaultScore: 3 },
  { id: "estrategia", label: "Estratégia", defaultScore: 4 },
];

export type NotificationChannel = "whatsapp" | "email" | "interna";

export const NOTIFICATION_CHANNELS: { key: NotificationChannel; label: string }[] = [
  { key: "whatsapp", label: "WhatsApp" },
  { key: "email", label: "E-mail" },
  { key: "interna", label: "Notificação interna" },
];

export type NotificationEvent = {
  id: string;
  label: string;
  channels: Record<NotificationChannel, boolean>;
};

export const NOTIFICATION_EVENTS: NotificationEvent[] = [
  {
    id: "confirmacao",
    label: "Confirmação de agendamento",
    channels: { whatsapp: true, email: true, interna: true },
  },
  {
    id: "lembrete",
    label: "Lembrete de aula",
    channels: { whatsapp: true, email: false, interna: true },
  },
  {
    id: "cancelada",
    label: "Aula cancelada",
    channels: { whatsapp: true, email: true, interna: true },
  },
  {
    id: "feedback",
    label: "Novo feedback",
    channels: { whatsapp: false, email: true, interna: true },
  },
  {
    id: "resultado",
    label: "Resultado publicado",
    channels: { whatsapp: true, email: true, interna: true },
  },
  {
    id: "vencimento",
    label: "Vencimento de pacote",
    channels: { whatsapp: true, email: true, interna: false },
  },
];

export type IntegrationItem = {
  id: string;
  name: string;
  description: string;
  status: "conectado" | "pendente" | "desconectado";
};

export const INTEGRATIONS: IntegrationItem[] = [
  {
    id: "wa",
    name: "WhatsApp",
    description: "Confirmações e lembretes automáticos para pilotos.",
    status: "conectado",
  },
  {
    id: "gcal",
    name: "Google Calendar",
    description: "Sincronize a grade de aulas com a equipe.",
    status: "pendente",
  },
  {
    id: "pay",
    name: "Pagamentos",
    description: "PIX e cartão para pacotes e aulas avulsas.",
    status: "conectado",
  },
  {
    id: "mail",
    name: "E-mail",
    description: "SMTP para comunicações institucionais.",
    status: "conectado",
  },
  {
    id: "tel",
    name: "Telemetria",
    description: "Importação de voltas e setores do cronômetro.",
    status: "pendente",
  },
  {
    id: "chrono",
    name: "Cronometragem",
    description: "Integração com sistema de timing da pista.",
    status: "desconectado",
  },
];

export const SECURITY_CARDS = [
  { id: "senha", title: "Alterar senha", description: "Atualize a senha da sua conta administrativa." },
  { id: "2fa", title: "Autenticação em duas etapas", description: "Proteção extra via app autenticador." },
  { id: "sessoes", title: "Sessões ativas", description: "2 dispositivos conectados neste momento." },
  { id: "logs", title: "Logs de acesso", description: "Últimos 30 dias de entradas no painel." },
  { id: "historico", title: "Histórico de alterações", description: "Registro de mudanças em configurações." },
] as const;

export const APPEARANCE_SETTINGS = {
  systemLogo: "/images/logo.svg",
  primaryColor: "#0d1f3c",
  secondaryColor: "#c41e3a",
  panelImage: "/images/hero-image.jpg",
  theme: "light" as "light" | "dark",
};

export const RANKING_SETTINGS = {
  bestLapCriterion: "Melhor volta válida da sessão (sem volta de entrada/saída)",
  consistencyCriterion: "Desvio padrão < 0,35s nas 5 melhores voltas",
  monthlyRanking: true,
  generalRanking: true,
  autoAchievements: true,
};

export type DocumentTemplate = {
  id: string;
  title: string;
  description: string;
  content: string;
  lastUpdated: string;
  revision: number;
  publishedRevision: number;
  status: "publicado" | "em_revisao" | "rascunho";
};

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: "privacidade",
    title: "Política de privacidade",
    description: "Tratamento de dados pessoais e LGPD.",
    content:
      "A Gurgel Team coleta e trata dados pessoais apenas para prestação de serviços de kart, comunicação sobre aulas, segurança e cumprimento de obrigações legais. Você pode solicitar acesso, correção ou exclusão dos seus dados pelos canais oficiais da equipe.",
    lastUpdated: "01 Jun 2025",
    revision: 1,
    publishedRevision: 1,
    status: "publicado",
  },
  {
    id: "termos-uso",
    title: "Termos de uso",
    description: "Condições gerais de uso da plataforma e serviços.",
    content:
      "Ao utilizar a plataforma e os serviços da Gurgel Team, você concorda em fornecer informações verídicas, respeitar as regras de segurança do kart e utilizar os recursos de forma pessoal e não fraudulenta.",
    lastUpdated: "01 Jun 2025",
    revision: 1,
    publishedRevision: 1,
    status: "publicado",
  },
  {
    id: "termo",
    title: "Termo de responsabilidade",
    description: "Assinatura digital antes da primeira sessão.",
    content:
      "O piloto (ou responsável legal) declara estar ciente dos riscos inerentes à prática de kart e assume total responsabilidade pelo uso das instalações e equipamentos.",
    lastUpdated: "12 Mar 2025",
    revision: 1,
    publishedRevision: 1,
    status: "publicado",
  },
  {
    id: "menor",
    title: "Autorização para menor de idade",
    description: "Responsável legal e documentação.",
    content:
      "Menores de 18 anos só participam com autorização assinada pelo responsável legal e documento de identidade apresentado no check-in.",
    lastUpdated: "01 Fev 2025",
    revision: 1,
    publishedRevision: 0,
    status: "em_revisao",
  },
  {
    id: "imagem",
    title: "Uso de imagem",
    description: "Autorização para mídia e redes sociais.",
    content:
      "Autorizo a Gurgel Team a utilizar imagens e vídeos das sessões para divulgação institucional e redes sociais.",
    lastUpdated: "18 Mar 2025",
    revision: 1,
    publishedRevision: 1,
    status: "publicado",
  },
];

/** Documentos descontinuados — ignorados ao carregar/salvar (legado no banco). */
export const REMOVED_DOCUMENT_TEMPLATE_IDS = new Set([
  "cancelamento",
  "regulamento",
]);

export type AuditEntry = {
  id: string;
  user: string;
  action: string;
  module: string;
  time: string;
};

export const AUDIT_LOG: AuditEntry[] = [
  {
    id: "a1",
    user: "Gurgel",
    action: "alterou a política de cancelamento",
    module: "Agenda",
    time: "hoje às 14:32",
  },
  {
    id: "a2",
    user: "Ricardo",
    action: "ativou pacote competidor",
    module: "Planos",
    time: "hoje às 11:05",
  },
  {
    id: "a3",
    user: "Ana",
    action: "publicou resultado da Etapa 2",
    module: "Ranking",
    time: "ontem às 19:40",
  },
  {
    id: "a4",
    user: "Gurgel",
    action: "conectou integração WhatsApp",
    module: "Integrações",
    time: "ontem às 09:15",
  },
  {
    id: "a5",
    user: "Pedro",
    action: "editou permissões da recepção",
    module: "Usuários",
    time: "12 Mai às 16:22",
  },
];
