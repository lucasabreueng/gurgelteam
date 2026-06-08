/** Dados mockados — CRM de clientes/pilotos Gurgel Team */

import {
  KART_CATEGORIES,
  SKILL_LEVELS,
  type KartCategory,
  type SkillLevel,
} from "./admin-settings-mocks";
import type { ClientStatus } from "@/lib/contracts/enums";
import { CLIENT_STATUSES } from "@/lib/contracts/enums";

export type { KartCategory, SkillLevel };
export type { ClientStatus } from "@/lib/contracts/enums";

export const CLIENT_FILTER_STATUSES: ClientStatus[] = [...CLIENT_STATUSES];

/** Categorias de kart (mesma fonte que Configurações → Categorias e níveis) */
export const CLIENT_KART_CATEGORIES = KART_CATEGORIES;

/** Níveis de piloto (mesma fonte que Configurações → Categorias e níveis) */
export const CLIENT_SKILL_LEVELS = SKILL_LEVELS;

export function resolveCategoryNames(
  categoryIds: string[],
  categories: KartCategory[] = KART_CATEGORIES
): string[] {
  return categoryIds.map(
    (id) => categories.find((c) => c.id === id)?.name ?? id
  );
}

export function resolveLevelName(
  levelId: string,
  levels: SkillLevel[] = SKILL_LEVELS
): string {
  return levels.find((l) => l.id === levelId)?.name ?? "—";
}

export type ClientKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sparkline: number[];
};

export const CLIENTS_KPIS: ClientKpi[] = [
  {
    id: "ativos",
    label: "Clientes ativos",
    value: "128",
    delta: "+12 este mês",
    deltaPositive: true,
    sparkline: [98, 104, 110, 115, 122, 128],
  },
  {
    id: "novos",
    label: "Novos clientes do mês",
    value: "18",
    delta: "+6 vs mês anterior",
    deltaPositive: true,
    sparkline: [8, 10, 11, 14, 16, 18],
  },
  {
    id: "retencao",
    label: "Taxa de retenção",
    value: "92%",
    delta: "+2%",
    deltaPositive: true,
    sparkline: [86, 87, 88, 90, 91, 92],
  },
  {
    id: "ticket",
    label: "Ticket médio",
    value: "R$ 1.240",
    delta: "+8%",
    deltaPositive: true,
    sparkline: [980, 1020, 1080, 1150, 1190, 1240],
  },
  {
    id: "risco",
    label: "Clientes em risco",
    value: "7",
    delta: "-2",
    deltaPositive: true,
    sparkline: [12, 11, 10, 9, 8, 7],
  },
];

export type ClientListItem = {
  id: string;
  name: string;
  avatar: string;
  /** IDs das categorias de kart (Configurações → Categorias e níveis) */
  categoryIds: string[];
  /** ID do nível (Configurações → Categorias e níveis) */
  levelId: string;
  status: ClientStatus;
  lastSession: string;
  nextSession: string;
  bestLap: string;
  consistency: number;
  activePlan: string;
  isMinor?: boolean;
  atRisk?: boolean;
};

export const CLIENTS_LIST: ClientListItem[] = [
  {
    id: "c1",
    name: "Lucas Mendes",
    avatar: "/images/team-1.png",
    categoryIds: ["f400", "125cc"],
    levelId: "lvl-avancado",
    status: "Ativo",
    lastSession: "18 mai · 14h",
    nextSession: "22 mai · 10h",
    bestLap: "54.821",
    consistency: 91,
    activePlan: "Pacote 8 aulas",
  },
  {
    id: "c2",
    name: "Marina Souza",
    avatar: "/images/team-2.png",
    categoryIds: ["125cc"],
    levelId: "lvl-competidor",
    status: "Ativo",
    lastSession: "19 mai · 16h",
    nextSession: "21 mai · 09h",
    bestLap: "52.104",
    consistency: 94,
    activePlan: "Competição Pro",
  },
  {
    id: "c3",
    name: "Pedro Alves",
    avatar: "/images/team-3.png",
    categoryIds: ["mirim-cadete"],
    levelId: "lvl-iniciante",
    status: "Ativo",
    lastSession: "17 mai · 11h",
    nextSession: "24 mai · 15h",
    bestLap: "58.902",
    consistency: 72,
    activePlan: "Pacote 8 aulas",
    isMinor: true,
  },
  {
    id: "c4",
    name: "Camila Rocha",
    avatar: "/images/team-4.png",
    categoryIds: ["f400"],
    levelId: "lvl-intermediario",
    status: "Inativo",
    lastSession: "02 mai · 18h",
    nextSession: "—",
    bestLap: "56.440",
    consistency: 81,
    activePlan: "Sem plano",
    atRisk: true,
  },
  {
    id: "c5",
    name: "Thiago Nunes",
    avatar: "/images/team-5.png",
    categoryIds: ["f400", "125cc"],
    levelId: "lvl-avancado",
    status: "Inativo",
    lastSession: "10 mai · 08h",
    nextSession: "—",
    bestLap: "55.210",
    consistency: 78,
    activePlan: "Mensal ilimitado",
    atRisk: true,
  },
  {
    id: "c6",
    name: "Beatriz Lima",
    avatar: "/images/team-6.png",
    categoryIds: ["125cc"],
    levelId: "lvl-competidor",
    status: "Ativo",
    lastSession: "20 mai · 17h",
    nextSession: "23 mai · 11h",
    bestLap: "51.880",
    consistency: 96,
    activePlan: "Competição Pro",
  },
  {
    id: "c7",
    name: "Rafael Dias",
    avatar: "/images/team-7.png",
    categoryIds: ["mirim-cadete", "f400"],
    levelId: "lvl-intermediario",
    status: "Ativo",
    lastSession: "16 mai · 19h",
    nextSession: "25 mai · 14h",
    bestLap: "57.015",
    consistency: 85,
    activePlan: "Treino avulso",
  },
  {
    id: "c8",
    name: "Juliana Prado",
    avatar: "/images/team-8.png",
    categoryIds: ["mirim-cadete"],
    levelId: "lvl-iniciante",
    status: "Inativo",
    lastSession: "28 abr · 10h",
    nextSession: "—",
    bestLap: "59.740",
    consistency: 65,
    activePlan: "Sem plano",
    atRisk: true,
  },
  {
    id: "c9",
    name: "Gabriel Costa",
    avatar: "/images/team-1.png",
    categoryIds: ["f400"],
    levelId: "lvl-intermediario",
    status: "Ativo",
    lastSession: "21 mai · 08h",
    nextSession: "26 mai · 16h",
    bestLap: "56.312",
    consistency: 83,
    activePlan: "Pacote 8 aulas",
  },
  {
    id: "c10",
    name: "Fernanda Melo",
    avatar: "/images/team-2.png",
    categoryIds: ["125cc", "f400"],
    levelId: "lvl-avancado",
    status: "Ativo",
    lastSession: "19 mai · 12h",
    nextSession: "23 mai · 18h",
    bestLap: "53.905",
    consistency: 89,
    activePlan: "Mensal ilimitado",
  },
  {
    id: "c11",
    name: "André Vieira",
    avatar: "/images/team-3.png",
    categoryIds: ["mirim-cadete", "125cc"],
    levelId: "lvl-iniciante",
    status: "Inativo",
    lastSession: "05 mai · 15h",
    nextSession: "—",
    bestLap: "60.118",
    consistency: 68,
    activePlan: "Treino avulso",
    atRisk: true,
  },
  {
    id: "c12",
    name: "Isabela Nogueira",
    avatar: "/images/team-4.png",
    categoryIds: ["125cc"],
    levelId: "lvl-competidor",
    status: "Ativo",
    lastSession: "20 mai · 09h",
    nextSession: "24 mai · 11h",
    bestLap: "52.550",
    consistency: 93,
    activePlan: "Competição Pro",
  },
  {
    id: "c13",
    name: "Bruno Carvalho",
    avatar: "/images/team-5.png",
    categoryIds: ["f400"],
    levelId: "lvl-avancado",
    status: "Inativo",
    lastSession: "08 mai · 17h",
    nextSession: "—",
    bestLap: "55.640",
    consistency: 76,
    activePlan: "Pacote 8 aulas",
    atRisk: true,
  },
  {
    id: "c14",
    name: "Larissa Pinto",
    avatar: "/images/team-6.png",
    categoryIds: ["mirim-cadete"],
    levelId: "lvl-iniciante",
    status: "Ativo",
    lastSession: "18 mai · 13h",
    nextSession: "27 mai · 10h",
    bestLap: "59.205",
    consistency: 70,
    activePlan: "Pacote 8 aulas",
    isMinor: true,
  },
  {
    id: "c15",
    name: "Diego Martins",
    avatar: "/images/team-7.png",
    categoryIds: ["f400", "125cc"],
    levelId: "lvl-intermediario",
    status: "Ativo",
    lastSession: "17 mai · 20h",
    nextSession: "22 mai · 19h",
    bestLap: "57.890",
    consistency: 82,
    activePlan: "Treino avulso",
  },
];

export const CLIENT_TABLE_PAGE_SIZES = [5, 10, 25, 50] as const;

export type TimelineEventType =
  | "aula"
  | "treino"
  | "feedback"
  | "evento"
  | "pagamento"
  | "conquista";

export type ClientTimelineEvent = {
  id: string;
  type: TimelineEventType;
  date: string;
  title: string;
  description: string;
};

export type ClientClassHistoryRow = {
  id: string;
  date: string;
  time: string;
  trainingDuration: string;
  bestLap: string;
};

export type ClientFeedback = {
  id: string;
  date: string;
  time: string;
  authorName: string;
  note: string;
  scores: {
    braking: number;
    apex: number;
    posture: number;
    control: number;
    strategy: number;
  };
  aiInsight?: string;
};

export type ClientAchievement = {
  id: string;
  label: string;
  description: string;
  earnedAt: string;
  icon: "first" | "lap" | "sessions" | "podium" | "consistency" | "evolution";
};

export type ClientHealthFlag = {
  id: string;
  label: string;
  severity: "ok" | "warn" | "risk";
  detail: string;
};

export type ClientGuardian = {
  name: string;
  phone: string;
  email: string;
  authorization: string;
  documents: string[];
};

export type ClientProfileDetail = {
  id: string;
  heroBg: string;
  goal: string;
  timeAtGurgel: string;
  internalRanking: number;
  performance: {
    bestLap: string;
    averageLap: string;
    consistency: number;
    evolutionPercent: number;
    frequency: string;
    rankingPosition: number;
    lapTrend: number[];
    consistencyTrend: number[];
    evolutionCompare: { label: string; value: number }[];
  };
  timeline: ClientTimelineEvent[];
  classesHistory: ClientClassHistoryRow[];
  feedbacks: ClientFeedback[];
  financial: {
    plan: string;
    sessionsLeft: number;
    sessionsTotal: number;
    dueDate: string;
    status: "em dia" | "pendente" | "atrasado";
    payments: { id: string; date: string; amount: string; status: string }[];
    pendingAmount?: string;
    receipts: { id: string; label: string; date: string }[];
  };
  achievements: ClientAchievement[];
  guardian?: ClientGuardian;
  internalNotes: {
    behavior: string;
    emotional: string;
    competitive: string;
    difficulties: string;
    technicalNotes: string;
  };
  health: ClientHealthFlag[];
};

export type EvolutionRankingEntry = {
  id: string;
  name: string;
  avatar: string;
  metric: string;
  value: string;
  rank: number;
};

export const EVOLUTION_RANKINGS = {
  evolution: [
    { id: "c1", name: "Lucas Mendes", avatar: "/images/team-1.png", metric: "Evolução", value: "+2.4s", rank: 1 },
    { id: "c6", name: "Beatriz Lima", avatar: "/images/team-6.png", metric: "Evolução", value: "+1.8s", rank: 2 },
    { id: "c7", name: "Rafael Dias", avatar: "/images/team-7.png", metric: "Evolução", value: "+1.2s", rank: 3 },
  ] as EvolutionRankingEntry[],
  training: [
    { id: "c2", name: "Marina Souza", avatar: "/images/team-2.png", metric: "Treinos", value: "18 sessões", rank: 1 },
    { id: "c1", name: "Lucas Mendes", avatar: "/images/team-1.png", metric: "Treinos", value: "16 sessões", rank: 2 },
    { id: "c6", name: "Beatriz Lima", avatar: "/images/team-6.png", metric: "Treinos", value: "15 sessões", rank: 3 },
  ] as EvolutionRankingEntry[],
  laps: [
    { id: "c6", name: "Beatriz Lima", avatar: "/images/team-6.png", metric: "Melhor volta", value: "51.880", rank: 1 },
    { id: "c2", name: "Marina Souza", avatar: "/images/team-2.png", metric: "Melhor volta", value: "52.104", rank: 2 },
    { id: "c1", name: "Lucas Mendes", avatar: "/images/team-1.png", metric: "Melhor volta", value: "54.821", rank: 3 },
  ] as EvolutionRankingEntry[],
  consistency: [
    { id: "c6", name: "Beatriz Lima", avatar: "/images/team-6.png", metric: "Consistência", value: "96%", rank: 1 },
    { id: "c2", name: "Marina Souza", avatar: "/images/team-2.png", metric: "Consistência", value: "94%", rank: 2 },
    { id: "c1", name: "Lucas Mendes", avatar: "/images/team-1.png", metric: "Consistência", value: "91%", rank: 3 },
  ] as EvolutionRankingEntry[],
};

const BASE_TIMELINE: ClientTimelineEvent[] = [
  { id: "t1", type: "aula", date: "20 mai 2025", title: "Aula técnica setor 2", description: "Foco em tangência e saída de curva." },
  { id: "t2", type: "feedback", date: "20 mai 2025", title: "Feedback Ricardo Gurgel", description: "Evolução consistente no S2." },
  { id: "t3", type: "aula", date: "18 mai 2025", title: "Aula individual F400", description: "Trabalho de frenagem e linha de apex." },
  { id: "t4", type: "pagamento", date: "15 mai 2025", title: "Pacote 8 aulas", description: "R$ 1.280 · PIX confirmado." },
  { id: "t5", type: "aula", date: "12 mai 2025", title: "Aula em grupo", description: "6 pilotos · categoria cadete." },
  { id: "t6", type: "aula", date: "08 mai 2025", title: "Aula avançada", description: "Simulador + 30 min pista." },
];

const BASE_CLASSES_HISTORY: ClientClassHistoryRow[] = [
  {
    id: "a1",
    date: "20/05/2025",
    time: "14:30",
    trainingDuration: "50 min",
    bestLap: "54.821s",
  },
  {
    id: "a2",
    date: "18/05/2025",
    time: "10:00",
    trainingDuration: "50 min",
    bestLap: "55.104s",
  },
  {
    id: "a3",
    date: "12/05/2025",
    time: "16:00",
    trainingDuration: "45 min",
    bestLap: "55.440s",
  },
  {
    id: "a4",
    date: "08/05/2025",
    time: "09:00",
    trainingDuration: "60 min",
    bestLap: "56.210s",
  },
  {
    id: "a5",
    date: "02/05/2025",
    time: "15:30",
    trainingDuration: "50 min",
    bestLap: "56.902s",
  },
  {
    id: "a6",
    date: "28/04/2025",
    time: "11:00",
    trainingDuration: "40 min",
    bestLap: "57.015s",
  },
];

const BASE_FEEDBACKS: ClientFeedback[] = [
  {
    id: "f1",
    date: "20/05/2025",
    time: "15:20",
    authorName: "Ricardo Gurgel",
    note: "Sessão focada em consistência no setor 2. Piloto respondeu bem às correções de linha.",
    scores: { braking: 4, apex: 4, posture: 5, control: 4, strategy: 4 },
    aiInsight:
      "Lucas melhorou muito no setor 2, mas ainda perde tempo na saída de curva.",
  },
  {
    id: "f2",
    date: "12/05/2025",
    time: "16:45",
    authorName: "Ricardo Gurgel",
    note: "Boa gestão de pneu. Trabalhar frenagem mais tardia na chicane.",
    scores: { braking: 3, apex: 4, posture: 4, control: 4, strategy: 3 },
  },
  {
    id: "f3",
    date: "05/05/2025",
    time: "10:15",
    authorName: "Rafael Costa",
    note: "Melhorou postura no volante. Manter foco na saída da curva 3.",
    scores: { braking: 4, apex: 3, posture: 4, control: 4, strategy: 3 },
  },
  {
    id: "f4",
    date: "28/04/2025",
    time: "11:50",
    authorName: "Ricardo Gurgel",
    note: "Evolução consistente nas voltas de ritmo. Aumentar repetição no S2.",
    scores: { braking: 4, apex: 4, posture: 4, control: 5, strategy: 4 },
  },
];

function buildProfile(client: ClientListItem): ClientProfileDetail {
  const sessionsLeft =
    client.activePlan === "Pacote 8 aulas"
      ? 3
      : client.activePlan === "Mensal ilimitado"
        ? 12
        : client.activePlan === "Competição Pro"
          ? 6
          : 0;

  return {
    id: client.id,
    heroBg: "/images/hero-image.jpg",
    goal:
      client.levelId === "lvl-competidor"
        ? "Classificar no top 3 da Copa Gurgel"
        : client.levelId === "lvl-avancado"
          ? "Sub 54s e evoluir para Competidor"
          : "Dominar linha de corrida e subir de nível",
    timeAtGurgel:
      client.id === "c3" ? "4 meses" : client.id === "c8" ? "2 meses" : "14 meses",
    internalRanking:
      client.levelId === "lvl-competidor" ? 2 : client.levelId === "lvl-avancado" ? 8 : 24,
    performance: {
      bestLap: client.bestLap,
      averageLap: (Number.parseFloat(client.bestLap) + 1.2).toFixed(3),
      consistency: client.consistency,
      evolutionPercent: client.consistency > 90 ? 12 : 8,
      frequency: client.atRisk ? "Baixa" : client.consistency > 85 ? "Alta" : "Média",
      rankingPosition: client.levelId === "lvl-competidor" ? 2 : 12,
      lapTrend: [58.2, 57.1, 56.4, 55.8, 55.2, Number.parseFloat(client.bestLap)],
      consistencyTrend: [72, 76, 80, 84, 88, client.consistency],
      evolutionCompare: [
        { label: "Jan", value: 58 },
        { label: "Fev", value: 57 },
        { label: "Mar", value: 56 },
        { label: "Abr", value: 55.5 },
        { label: "Mai", value: Number.parseFloat(client.bestLap) },
      ],
    },
    timeline: BASE_TIMELINE,
    classesHistory: BASE_CLASSES_HISTORY,
    feedbacks: BASE_FEEDBACKS,
    financial: {
      plan: client.activePlan,
      sessionsLeft,
      sessionsTotal: sessionsLeft + 5,
      dueDate: client.atRisk ? "05 mai 2025" : "15 jun 2025",
      status: client.atRisk ? "atrasado" : "em dia",
      payments: [
        { id: "p1", date: "15/05/2025", amount: "R$ 1.280", status: "Pago" },
        { id: "p2", date: "15/04/2025", amount: "R$ 1.280", status: "Pago" },
        { id: "p3", date: "15/03/2025", amount: "R$ 1.280", status: "Pago" },
        { id: "p4", date: "15/02/2025", amount: "R$ 1.280", status: "Pago" },
        { id: "p5", date: "15/01/2025", amount: "R$ 1.280", status: "Pago" },
      ],
      pendingAmount: client.atRisk ? "R$ 640" : undefined,
      receipts: [
        { id: "r1", label: "Recibo maio/25", date: "15 mai 2025" },
        { id: "r2", label: "Recibo abr/25", date: "15 abr 2025" },
      ],
    },
    achievements: [
      { id: "a1", label: "Primeira aula", description: "Início na Gurgel Team", earnedAt: "Jan 2024", icon: "first" },
      { id: "a2", label: "Sub 55s", description: "Volta abaixo de 55 segundos", earnedAt: "Mai 2025", icon: "lap" },
      { id: "a3", label: "10 treinos", description: "10 sessões concluídas", earnedAt: "Mar 2024", icon: "sessions" },
      { id: "a4", label: "Pódio", description: "P3 Copa Gurgel", earnedAt: "Mai 2025", icon: "podium" },
      { id: "a5", label: "Consistência 90%", description: "Média de consistência", earnedAt: "Abr 2025", icon: "consistency" },
      { id: "a6", label: "Melhor evolução do mês", description: "Destaque técnico", earnedAt: "Abr 2025", icon: "evolution" },
    ],
    guardian: client.isMinor
      ? {
          name: "Carlos Alves",
          phone: "(61) 99999-1234",
          email: "carlos.alves@email.com",
          authorization: "Autorização assinada · válida até dez/2025",
          documents: ["Termo de responsabilidade", "RG do responsável"],
        }
      : undefined,
    internalNotes: {
      behavior: "Pontual, comunicativo e receptivo a feedback.",
      emotional: "Mantém calma sob pressão; melhora após warm-up.",
      competitive: "Alto potencial para categorias Pro/Elite em 6 meses.",
      difficulties: "Ainda perde tempo na saída lenta de curvas longas.",
      technicalNotes:
        "Priorizar simulador de frenagem + repetição setor 2 nas próximas 3 sessões.",
    },
    health: client.atRisk
      ? [
          { id: "h1", label: "Frequência caiu", severity: "warn", detail: "-40% vs mês anterior" },
          { id: "h2", label: "Sem treinar há 18 dias", severity: "risk", detail: "Última sessão em 02 mai" },
          { id: "h3", label: "Risco de cancelamento", severity: "risk", detail: "Plano expirando sem renovação" },
        ]
      : [
          { id: "h1", label: "Alta recorrência", severity: "ok", detail: "3+ sessões por semana" },
          { id: "h2", label: "Evolução forte", severity: "ok", detail: "+8% consistência no mês" },
        ],
  };
}

export function buildClientProfile(client: ClientListItem): ClientProfileDetail {
  return buildProfile(client);
}

export function getClientProfile(clientId: string): ClientProfileDetail | null {
  const client = CLIENTS_LIST.find((c) => c.id === clientId);
  if (!client) return null;
  return buildProfile(client);
}

export function getClientListItem(clientId: string): ClientListItem | null {
  return CLIENTS_LIST.find((c) => c.id === clientId) ?? null;
}
