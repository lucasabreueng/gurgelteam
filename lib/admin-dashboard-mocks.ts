/** Dados mockados — Painel administrativo Gurgel Team */

import type { KartOwnership, KartStatus } from "@/lib/admin-karts-mocks";

export type AdminNavKey =
  | "dashboard"
  | "agenda"
  | "registroAulas"
  | "alunos"
  | "instrutores"
  | "karts"
  | "manutencao"
  | "estoque"
  | "telemetria"
  | "campeonatos"
  | "financeiro"
  | "relatorios"
  | "configuracoes";

export const ADMIN_NAV: { key: AdminNavKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "agenda", label: "Agenda" },
  { key: "registroAulas", label: "Registro de aulas" },
  { key: "alunos", label: "Alunos" },
  { key: "karts", label: "Karts" },
  { key: "manutencao", label: "Manutenção" },
  { key: "estoque", label: "Estoque" },
  { key: "telemetria", label: "Telemetria" },
  { key: "financeiro", label: "Financeiro" },
  { key: "configuracoes", label: "Configurações" },
];

export const ADMIN_PROFILE = {
  name: "Ricardo Gurgel",
  role: "Operações",
  avatar: "/images/team-1.png",
} as const;

export const ADMIN_OPERATION_STATUS = {
  label: "Operação funcionando normalmente",
  tone: "ok" as const,
};

export const HERO_QUICK_STATS = [
  { label: "Aulas hoje", value: "24" },
  { label: "Alunos ativos", value: "87" },
  { label: "Ocupação", value: "92%" },
  { label: "Receita mensal", value: "R$ 48.500" },
] as const;

export type AdminKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sparkline: number[];
};

export const ADMIN_KPIS: AdminKpi[] = [
  {
    id: "aulas",
    label: "Aulas hoje",
    value: "24",
    delta: "+3 vs ontem",
    deltaPositive: true,
    sparkline: [14, 16, 18, 20, 22, 24],
  },
  {
    id: "alunos",
    label: "Alunos ativos",
    value: "87",
    delta: "+5 este mês",
    deltaPositive: true,
    sparkline: [72, 74, 78, 80, 84, 87],
  },
  {
    id: "ocupacao",
    label: "Taxa de ocupação",
    value: "92%",
    delta: "+4%",
    deltaPositive: true,
    sparkline: [78, 82, 85, 88, 90, 92],
  },
  {
    id: "treinos",
    label: "Treinos realizados",
    value: "128",
    delta: "Semana atual",
    deltaPositive: true,
    sparkline: [98, 102, 110, 115, 122, 128],
  },
  {
    id: "receita",
    label: "Receita mensal",
    value: "R$ 48.500",
    delta: "+12%",
    deltaPositive: true,
    sparkline: [38, 40, 42, 44, 46, 48.5],
  },
  {
    id: "evolucao",
    label: "Evolução média dos pilotos",
    value: "+8%",
    delta: "vs mês anterior",
    deltaPositive: true,
    sparkline: [2, 3, 4, 5, 6, 8],
  },
];

export type AgendaSlot = {
  id: string;
  startTime: string;
  endTime: string;
  pilotName: string;
  category: string;
  level: string;
};

export const OPERATIONAL_AGENDA: AgendaSlot[] = [
  {
    id: "a1",
    startTime: "08:00",
    endTime: "09:30",
    pilotName: "Marina Silva",
    category: "Mirim / Cadete",
    level: "Iniciante",
  },
  {
    id: "a2",
    startTime: "10:30",
    endTime: "12:00",
    pilotName: "Lucas Mendes",
    category: "F400",
    level: "Avançado",
  },
  {
    id: "a3",
    startTime: "14:00",
    endTime: "15:30",
    pilotName: "Ana Costa",
    category: "125cc",
    level: "Intermediário",
  },
  {
    id: "a4",
    startTime: "16:30",
    endTime: "18:00",
    pilotName: "Pedro Lima",
    category: "F400",
    level: "Competidor",
  },
  {
    id: "a5",
    startTime: "18:00",
    endTime: "19:30",
    pilotName: "Rafael Souza",
    category: "Mirim / Cadete",
    level: "Iniciante",
  },
];

export type StudentOfTheMonth = {
  rank: 1 | 2 | 3;
  id: string;
  name: string;
  avatar: string;
  age: number;
  categoryIds: string[];
  bestTime: string;
  evolution: string;
  evolutionPositive: boolean;
};

export const STUDENTS_OF_THE_MONTH: StudentOfTheMonth[] = [
  {
    rank: 1,
    id: "c6",
    name: "Beatriz Lima",
    avatar: "/images/team-6.png",
    age: 17,
    categoryIds: ["125cc"],
    bestTime: "51.880",
    evolution: "-1.12s",
    evolutionPositive: true,
  },
  {
    rank: 2,
    id: "c2",
    name: "Marina Souza",
    avatar: "/images/team-2.png",
    age: 22,
    categoryIds: ["125cc"],
    bestTime: "52.104",
    evolution: "-0.86s",
    evolutionPositive: true,
  },
  {
    rank: 3,
    id: "c1",
    name: "Lucas Mendes",
    avatar: "/images/team-1.png",
    age: 19,
    categoryIds: ["f400", "125cc"],
    bestTime: "54.821",
    evolution: "-0.54s",
    evolutionPositive: true,
  },
];

export const TELEMETRY_EVOLUTION_SERIES = [
  { week: "S1", avg: 54.8 },
  { week: "S2", avg: 54.2 },
  { week: "S3", avg: 53.9 },
  { week: "S4", avg: 53.4 },
  { week: "S5", avg: 53.1 },
  { week: "S6", avg: 52.7 },
];

export const TELEMETRY_INSIGHT =
  "Os pilotos estão perdendo mais tempo no setor 2, principalmente na saída de curva.";

export const TELEMETRY_SECTORS = [
  { sector: "Setor 1", delta: "-0.04s", slow: false },
  { sector: "Setor 2", delta: "+0.19s", slow: true },
  { sector: "Setor 3", delta: "-0.08s", slow: false },
];

export type KartUnit = {
  id: string;
  number: number;
  category: string;
  ownership: KartOwnership;
  ownerName?: string;
  status: KartStatus;
};

export const KART_FLEET: KartUnit[] = [
  {
    id: "k17",
    number: 17,
    category: "125cc Pro",
    ownership: "rental",
    status: "em_treino",
  },
  {
    id: "k05",
    number: 5,
    category: "F400",
    ownership: "client",
    ownerName: "Lucas Mendes",
    status: "em_treino",
  },
  {
    id: "k12",
    number: 12,
    category: "125cc Sport",
    ownership: "rental",
    status: "disponivel",
  },
  {
    id: "k09",
    number: 9,
    category: "Iniciante",
    ownership: "rental",
    status: "disponivel",
  },
  {
    id: "k03",
    number: 3,
    category: "125cc",
    ownership: "client",
    ownerName: "Ana Costa",
    status: "manutencao",
  },
  {
    id: "k21",
    number: 21,
    category: "Elite",
    ownership: "rental",
    status: "preparacao",
  },
];

export const CHAMPIONSHIP = {
  event: "Copa Gurgel Team · Etapa 3",
  stage: "Etapa 3 de 6",
  registrationsOpen: true,
  enrolled: 24,
  capacity: 32,
  countdown: "12 dias",
  nextDate: "14 Jun 2025",
};

export const FINANCIAL = {
  monthlyRevenue: "R$ 48.500",
  ticketAvg: "R$ 285",
  lessonsSold: 186,
  delinquency: "2,4%",
  growth: "+12%",
};

export type AdminQuickAction = {
  key: string;
  label: string;
  subtitle: string;
};

export const ADMIN_QUICK_ACTIONS: AdminQuickAction[] = [
  { key: "aluno", label: "Novo aluno", subtitle: "Cadastro rápido" },
  { key: "agenda", label: "Agendar aula", subtitle: "Grade operacional" },
  { key: "treino", label: "Abrir treino", subtitle: "Sessão ao vivo" },
  { key: "camp", label: "Criar campeonato", subtitle: "Novo evento" },
  { key: "feedback", label: "Registrar feedback", subtitle: "Instrutor → aluno" },
  { key: "tel", label: "Abrir telemetria", subtitle: "Análise de voltas" },
];
