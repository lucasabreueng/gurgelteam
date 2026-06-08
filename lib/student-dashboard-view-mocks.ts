/** Contexto de visualização do dashboard — responsável com pilotos vinculados */

import type { EvolutionLapPoint } from "@/lib/student-area-mocks";
import {
  EVOLUTION_GOAL,
  EVOLUTION_LAP_SERIES,
  FEEDBACK,
  HERO_LEVEL,
  KPI_METRICS,
  NEXT_ACTIVITIES,
  type TimelineItem,
} from "@/lib/student-area-mocks";

export type StudentSessionKind = "piloto" | "responsavel";

export type PilotViewOption = {
  id: string;
  label: string;
  /** Ex.: Eu mesmo, Piloto vinculado */
  hint: string;
};

export type DashboardViewProfile = {
  firstName: string;
  tag: string;
  pilotSinceYear: string;
};

export type DashboardHeroLevel = {
  title: string;
  progressPercent: number;
  goalLabel: string;
};

export type DashboardKpiMetric = {
  id: string;
  label: string;
  value: string;
  sub: string;
  delta: string | null;
  deltaPositive: boolean;
};

export type DashboardEvolutionGoal = {
  title: string;
  description: string;
  targetLap: string;
  currentBest: string;
  deadlineLabel?: string;
  deadlineIso: string;
  progressPercent: number;
};

export type DashboardFeedback = {
  authorName: string;
  authorPhoto: string;
  dateLabel: string;
  commentary: string;
  strengths: string[];
  improve: string[];
};

export type DashboardViewData = {
  profile: DashboardViewProfile;
  heroLevel: DashboardHeroLevel;
  kpiMetrics: DashboardKpiMetric[];
  evolutionLapSeries: readonly EvolutionLapPoint[];
  evolutionGoal: DashboardEvolutionGoal;
  nextActivities: TimelineItem[];
  feedback: DashboardFeedback;
};

const LUCAS_VIEW: DashboardViewData = {
  profile: {
    firstName: "Lucas Mendes",
    tag: "Competidor",
    pilotSinceYear: "2022",
  },
  heroLevel: { ...HERO_LEVEL },
  kpiMetrics: [...KPI_METRICS],
  evolutionLapSeries: EVOLUTION_LAP_SERIES,
  evolutionGoal: { ...EVOLUTION_GOAL },
  nextActivities: NEXT_ACTIVITIES,
  feedback: { ...FEEDBACK, strengths: [...FEEDBACK.strengths], improve: [...FEEDBACK.improve] },
};

const MARIANA_VIEW: DashboardViewData = {
  profile: {
    firstName: "Mariana Mendes",
    tag: "Competidor amador",
    pilotSinceYear: "2020",
  },
  heroLevel: {
    title: "Intermediário",
    progressPercent: 58,
    goalLabel: "Manter constância abaixo de 58s na pista",
  },
  kpiMetrics: [
    {
      id: "best",
      label: "Melhor volta",
      value: "57.420",
      sub: "10/05/2025",
      delta: "-0.180s",
      deltaPositive: true,
    },
    {
      id: "avg",
      label: "Média de tempo",
      value: "58.102",
      sub: "Últimas 5 aulas",
      delta: "-0.120s",
      deltaPositive: true,
    },
    {
      id: "consistency",
      label: "Consistência",
      value: "85%",
      sub: "Boa",
      delta: "+2%",
      deltaPositive: true,
    },
    {
      id: "evolution",
      label: "Evolução (30 dias)",
      value: "-0.890s",
      sub: "Evoluindo bem!",
      delta: null,
      deltaPositive: true,
    },
  ],
  evolutionLapSeries: [
    { sessionDate: "2025-04-08", seconds: 59.1 },
    { sessionDate: "2025-04-15", seconds: 58.72 },
    { sessionDate: "2025-04-22", seconds: 58.41 },
    { sessionDate: "2025-05-01", seconds: 58.05 },
    { sessionDate: "2025-05-08", seconds: 57.89 },
    { sessionDate: "2025-05-15", seconds: 57.42 },
  ],
  evolutionGoal: {
    ...EVOLUTION_GOAL,
    title: "Meta pessoal",
    description: "Fechar volta abaixo de 57s em treino livre.",
    targetLap: "57,000",
    currentBest: "57,420",
    progressPercent: 58,
  },
  nextActivities: [
    {
      id: "m1",
      title: "Treino livre F400",
      meta: "26 Mai • 16:00",
      location: "Kartódromo Granja Viana",
    },
    {
      id: "m2",
      title: "Aula técnica",
      meta: "28 Mai • 10:30",
      location: "Kartódromo Granja Viana",
    },
  ],
  feedback: {
    ...FEEDBACK,
    dateLabel: "08 de Maio de 2025",
    commentary:
      "Boa sessão, Mariana. Mantenha a progressão de aceleração e trabalhe a linha de entrada no S2 para ganhar tempo na sequência seguinte.",
    strengths: ["Ritmo constante nas voltas válidas", "Boa leitura de pneu em condição seca"],
    improve: ["Frenagem mais tardia no S1", "Referência visual na saída do S4"],
  },
};

const THEO_VIEW: DashboardViewData = {
  profile: {
    firstName: "Theo Mendes",
    tag: "Cadete",
    pilotSinceYear: "2024",
  },
  heroLevel: {
    title: "Iniciante",
    progressPercent: 34,
    goalLabel: "Completar 10 voltas válidas sem interrupção",
  },
  kpiMetrics: [
    {
      id: "best",
      label: "Melhor volta",
      value: "62.180",
      sub: "18/05/2025",
      delta: "-0.520s",
      deltaPositive: true,
    },
    {
      id: "avg",
      label: "Média de tempo",
      value: "63.450",
      sub: "Últimas 5 aulas",
      delta: "-0.310s",
      deltaPositive: true,
    },
    {
      id: "consistency",
      label: "Consistência",
      value: "78%",
      sub: "Em evolução",
      delta: "+5%",
      deltaPositive: true,
    },
    {
      id: "evolution",
      label: "Evolução (30 dias)",
      value: "-1.102s",
      sub: "Ótimo ritmo de aprendizado!",
      delta: null,
      deltaPositive: true,
    },
  ],
  evolutionLapSeries: [
    { sessionDate: "2025-04-06", seconds: 64.2 },
    { sessionDate: "2025-04-13", seconds: 63.8 },
    { sessionDate: "2025-04-20", seconds: 63.1 },
    { sessionDate: "2025-05-04", seconds: 62.9 },
    { sessionDate: "2025-05-11", seconds: 62.4 },
    { sessionDate: "2025-05-18", seconds: 62.18 },
  ],
  evolutionGoal: {
    ...EVOLUTION_GOAL,
    title: "Meta do módulo Cadete",
    description: "Estabilizar melhor volta abaixo de 62s.",
    targetLap: "62,000",
    currentBest: "62,180",
    progressPercent: 34,
  },
  nextActivities: [
    {
      id: "t1",
      title: "Aula de pilotagem",
      meta: "24 Mai • 14:30",
      location: "Kartódromo Granja Viana",
    },
    {
      id: "t2",
      title: "Treino orientado",
      meta: "31 Mai • 09:00",
      location: "Kartódromo Granja Viana",
    },
  ],
  feedback: {
    ...FEEDBACK,
    authorName: "Rafael Costa",
    dateLabel: "15 de Maio de 2025",
    commentary:
      "Theo está mais confiante na freada e na retomada. Continue reforçando a referência visual antes de acelerar.",
    strengths: ["Trajetória estável em curvas lentas", "Boa postura no kart"],
    improve: ["Antecipação da freada", "Manter olhar à frente na saída"],
  },
};

const LARA_VIEW: DashboardViewData = {
  profile: {
    firstName: "Lara Mendes",
    tag: "Mirim",
    pilotSinceYear: "2025",
  },
  heroLevel: {
    title: "Iniciante",
    progressPercent: 22,
    goalLabel: "Completar traçado completo sem cones",
  },
  kpiMetrics: [
    {
      id: "best",
      label: "Melhor volta",
      value: "68.540",
      sub: "12/05/2025",
      delta: "-0.410s",
      deltaPositive: true,
    },
    {
      id: "avg",
      label: "Média de tempo",
      value: "69.820",
      sub: "Últimas 5 aulas",
      delta: "-0.280s",
      deltaPositive: true,
    },
    {
      id: "consistency",
      label: "Consistência",
      value: "71%",
      sub: "Progredindo",
      delta: "+4%",
      deltaPositive: true,
    },
    {
      id: "evolution",
      label: "Evolução (30 dias)",
      value: "-0.950s",
      sub: "Primeiros passos sólidos!",
      delta: null,
      deltaPositive: true,
    },
  ],
  evolutionLapSeries: [
    { sessionDate: "2025-04-10", seconds: 70.5 },
    { sessionDate: "2025-04-17", seconds: 69.9 },
    { sessionDate: "2025-04-24", seconds: 69.2 },
    { sessionDate: "2025-05-08", seconds: 68.9 },
    { sessionDate: "2025-05-15", seconds: 68.7 },
    { sessionDate: "2025-05-19", seconds: 68.54 },
  ],
  evolutionGoal: {
    ...EVOLUTION_GOAL,
    title: "Meta Mirim",
    description: "Primeira volta abaixo de 68s com consistência.",
    targetLap: "68,000",
    currentBest: "68,540",
    progressPercent: 22,
  },
  nextActivities: [
    {
      id: "l1",
      title: "Aula Mirim",
      meta: "25 Mai • 10:00",
      location: "Kartódromo Granja Viana",
    },
  ],
  feedback: {
    ...FEEDBACK,
    authorName: "Paula Mendes",
    dateLabel: "11 de Maio de 2025",
    commentary:
      "Lara demonstrou mais atenção ao traçado e menos correções no volante. Seguir com exercícios de referência fixa.",
    strengths: ["Respeito às faixas", "Boa concentração nos treinos curtos"],
    improve: ["Suavidade no volante", "Manter velocidade na reta"],
  },
};

const DASHBOARD_VIEWS: Record<string, DashboardViewData> = {
  self: MARIANA_VIEW,
  theo: THEO_VIEW,
  lara: LARA_VIEW,
  "pilot-lucas": LUCAS_VIEW,
};

export function getStudentSessionKind(
  demo: string | null | undefined
): StudentSessionKind {
  return demo === "responsavel" ? "responsavel" : "piloto";
}

export function getPilotViewOptions(
  kind: StudentSessionKind
): PilotViewOption[] {
  if (kind !== "responsavel") return [];
  return [
    { id: "self", label: "Mariana Mendes", hint: "Eu mesmo" },
    { id: "theo", label: "Theo Mendes", hint: "Piloto vinculado" },
    { id: "lara", label: "Lara Mendes", hint: "Piloto vinculado" },
  ];
}

export function getDefaultPilotViewId(kind: StudentSessionKind): string {
  return kind === "responsavel" ? "self" : "pilot-lucas";
}

export function getDashboardViewData(pilotViewId: string): DashboardViewData {
  return DASHBOARD_VIEWS[pilotViewId] ?? LUCAS_VIEW;
}
