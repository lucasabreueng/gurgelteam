/** Dados fictícios — Área do Aluno */

export type NavItemKey =
  | "dashboard"
  | "agenda"
  | "evolucao"
  | "feedbacks"
  | "plano"
  | "telemetria"
  | "resultados"
  | "materiais"
  | "conquistas"
  | "ranking";

export const STUDENT_NAV: { key: NavItemKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "agenda", label: "Agenda" },
  { key: "evolucao", label: "Evolução" },
  { key: "feedbacks", label: "Feedbacks" },
  { key: "plano", label: "Plano de treino" },
  { key: "telemetria", label: "Telemetria" },
  { key: "resultados", label: "Resultados" },
  { key: "materiais", label: "Materiais" },
  { key: "conquistas", label: "Conquistas" },
  { key: "ranking", label: "Ranking interno" },
];

/** Rotas do menu lateral (dashboard usa âncoras na página /piloto) */
export const STUDENT_NAV_HREF: Record<NavItemKey, string> = {
  dashboard: "/piloto#section-dashboard",
  agenda: "/piloto#section-agenda",
  evolucao: "/piloto#section-evolucao",
  feedbacks: "/piloto#section-feedbacks",
  plano: "/piloto#section-plano",
  telemetria: "/piloto/telemetria",
  resultados: "/piloto#section-resultados",
  materiais: "/piloto#section-materiais",
  conquistas: "/piloto#section-conquistas",
  ranking: "/piloto#section-resultados",
};

export const STUDENT_PROFILE = {
  firstName: "Lucas Mendes",
  tag: "Competidor",
  pilotSinceYear: "2022",
  avatarFallback: "/images/team-6.png",
} as const;

export const NEXT_CLASS = {
  dateLabel: "Sábado, 24 de Maio",
  timeRange: "14:30 - 16:00",
} as const;

export const HERO_LEVEL = {
  title: "Avançado",
  progressPercent: 72,
  goalLabel: "Reduzir 0.400s da sua melhor volta",
} as const;

/** Sessões recentes — data ISO + melhor volta em segundos (gráfico evolução) */
export type EvolutionLapPoint = {
  sessionDate: string;
  seconds: number;
};

export const EVOLUTION_LAP_SERIES: readonly EvolutionLapPoint[] = [
  { sessionDate: "2025-04-05", seconds: 55.32 },
  { sessionDate: "2025-04-12", seconds: 54.98 },
  { sessionDate: "2025-04-19", seconds: 54.71 },
  { sessionDate: "2025-05-03", seconds: 54.45 },
  { sessionDate: "2025-05-10", seconds: 54.12 },
  { sessionDate: "2025-05-17", seconds: 53.842 },
];

export const EVOLUTION_GOAL = {
  title: "Meta do trimestre",
  description: "Estabilizar melhor volta abaixo de 53,5s em condições secas.",
  targetLap: "53,500",
  currentBest: "53,842",
  deadlineLabel: "até 30/06/2026",
  /** ISO `YYYY-MM-DD` para o campo de data da meta */
  deadlineIso: "2026-06-30",
  progressPercent: 72,
} as const;

export const KPI_METRICS = [
  {
    id: "best",
    label: "Melhor volta",
    value: "53.842",
    sub: "24/05/2025",
    delta: "-0.342s",
    deltaPositive: true,
  },
  {
    id: "avg",
    label: "Média de tempo",
    value: "54.321",
    sub: "Últimas 5 aulas",
    delta: "-0.257s",
    deltaPositive: true,
  },
  {
    id: "consistency",
    label: "Consistência",
    value: "92%",
    sub: "Muito boa",
    delta: "+3%",
    deltaPositive: true,
  },
  {
    id: "evolution",
    label: "Evolução (30 dias)",
    value: "-1.247s",
    sub: "Você está mais rápido!",
    delta: null,
    deltaPositive: true,
  },
] as const;

export type TimelineItem = {
  id: string;
  title: string;
  meta: string;
  location: string;
};

export const NEXT_ACTIVITIES: TimelineItem[] = [
  {
    id: "a1",
    title: "Aula de pilotagem",
    meta: "18 Maio • 14:30",
    location: "Kartódromo Granja Viana",
  },
  {
    id: "a2",
    title: "Treino livre",
    meta: "20 Maio • 09:00",
    location: "Kartódromo Granja Viana",
  },
  {
    id: "a3",
    title: "Análise de telemetria",
    meta: "22 Maio • 17:30",
    location: "Sala técnica Gurgel Team",
  },
  {
    id: "a4",
    title: "Copa Interna Gurgel Team",
    meta: "25 Maio • 08:45",
    location: "Kartódromo Granja Viana",
  },
];

export const FEEDBACK = {
  instructorName: "Gurgel",
  instructorPhoto: "/images/team-3.png",
  dateLabel: "12 de Maio de 2025",
  commentary:
    "Sua trajetória no S3 apresentou uma evolução muito consistente desde a última sessão. A aproximação da curva está mais limpa, você conseguiu manter o kart mais estável até o apexe e o fechamento do traçado demonstra muito mais confiança e controle na saída. A aplicação de aceleração também ficou mais progressiva, reduzindo pequenas correções no volante e melhorando a transferência de velocidade para a reta seguinte.",
  strengths: ["Controle sob frenagem na chuva seca", "Retomada limpa nos S médios"],
  improve: ["Crono em curva rápida (T4)", "Defesa quando vem dois em sequência"],
} as const;

export const DEVELOPMENT_TABS = [
  { key: "foco", label: "Foco atual" },
  { key: "proximos", label: "Próximos passos" },
  { key: "conquistas", label: "Conquistas" },
] as const;

export type DevTabKey = (typeof DEVELOPMENT_TABS)[number]["key"];

export type DevCheckItem = {
  id: string;
  label: string;
  done: boolean;
};

export type DevelopmentTabPayload = {
  title: string;
  description: string;
  progressPercent: number;
  progressLabel: string;
  checklist: DevCheckItem[];
};

export const DEVELOPMENT_BY_TAB: Record<DevTabKey, DevelopmentTabPayload> = {
  foco: {
    title: "Estratégia e Performance",
    description:
      "Check-in da sua próxima fase técnica com o instrutor responsável na pista da Gurgel Team.",
    progressPercent: 60,
    progressLabel: "Progresso do foco atual",
    checklist: [
      { id: "c1", label: "Análise de volta", done: true },
      { id: "c2", label: "Estratégia de corrida", done: false },
      { id: "c3", label: "Defesa e ultrapassagem", done: false },
      { id: "c4", label: "Simulação de classificação", done: false },
      { id: "c5", label: "Preparação para campeonatos", done: false },
    ],
  },
  proximos: {
    title: "Bloco seguinte · Referência técnica",
    description:
      "Em breve: novos checkpoints alinhados ao seu plano de competição interna.",
    progressPercent: 25,
    progressLabel: "Prepare o próximo módulo",
    checklist: [
      { id: "p1", label: "Sessão de setup de cockpit e conforto", done: false },
      { id: "p2", label: "Roteiro mental curva por curva", done: false },
      { id: "p3", label: "Briefing pré-treino com telemetria", done: false },
      { id: "p4", label: "Revisão de pneus e medição de tempo", done: false },
      { id: "p5", label: "Corrida sprint simulado (rodízio)", done: false },
    ],
  },
  conquistas: {
    title: "Marcadores da jornada",
    description:
      "Selos conquistados e próximos desafios dentro do programa de alto rendimento.",
    progressPercent: 45,
    progressLabel: "Conquistas do plano",
    checklist: [
      { id: "k1", label: "Selo: primeiros 10 tempos válidos", done: true },
      { id: "k2", label: "Constância: 3 sessões dentro de +0.2s", done: true },
      { id: "k3", label: "Pódio em treino cronometrado interno", done: false },
      { id: "k4", label: "Top 3 em ranking interno do mês", done: false },
      { id: "k5", label: "Certificado de conclusão do módulo avançado", done: false },
    ],
  },
};

export const TELEMETRY_STATS = {
  bestLap: "53,842",
  bestTheoretical: "53,520",
  average: "54,321",
  consistency: "92%",
  refLap: "54.184",
  delta: "-0.342s",
  sectorDiff: "+0.01s • -0.19s • -0.06s • -0.10s • -0.04s • -0.01s",
  fuel: "+0.001s",
  tireWear: "+0.000s",
};

/** Sessões do piloto — listagem no modal “Sessões” */
export type TelemetryPilotSession = {
  id: string;
  dateLabel: string;
  totalLaps: number;
  bestLap: string;
  totalTime: string;
  trackName: string;
};

export const TELEMETRY_PILOT_SESSIONS: TelemetryPilotSession[] = [
  {
    id: "2025-05-24",
    dateLabel: "24/05/2025",
    totalLaps: 8,
    bestLap: "53,842",
    totalTime: "7:24,892",
    trackName: "Kartódromo Ayrton Senna",
  },
  {
    id: "2025-05-17",
    dateLabel: "17/05/2025",
    totalLaps: 12,
    bestLap: "54,112",
    totalTime: "11:02,340",
    trackName: "Kartódromo Ayrton Senna",
  },
  {
    id: "2025-05-10",
    dateLabel: "10/05/2025",
    totalLaps: 10,
    bestLap: "54,330",
    totalTime: "9:18,505",
    trackName: "Kartódromo Granja Viana",
  },
  {
    id: "2025-05-03",
    dateLabel: "03/05/2025",
    totalLaps: 6,
    bestLap: "54,555",
    totalTime: "5:32,118",
    trackName: "Kartódromo Ayrton Senna",
  },
  {
    id: "2025-04-19",
    dateLabel: "19/04/2025",
    totalLaps: 9,
    bestLap: "54,720",
    totalTime: "8:14,760",
    trackName: "Kartódromo Granja Viana",
  },
];

export const TELEMETRY_DEFAULT_SESSION_ID = TELEMETRY_PILOT_SESSIONS[0].id;

/** Tempos por setor (S1–S3) da sessão ativa — melhor volta */
export type TelemetrySectorRow = {
  sector: "S1" | "S2" | "S3";
  time: string;
  /** Melhor teórica do setor na sessão */
  theoretical: string;
};

export const TELEMETRY_SECTORS_BY_SESSION: Record<string, TelemetrySectorRow[]> = {
  "2025-05-24": [
    { sector: "S1", time: "12,450", theoretical: "12,420" },
    { sector: "S2", time: "18,120", theoretical: "18,090" },
    { sector: "S3", time: "23,272", theoretical: "23,010" },
  ],
  "2025-05-17": [
    { sector: "S1", time: "12,580", theoretical: "12,540" },
    { sector: "S2", time: "18,290", theoretical: "18,210" },
    { sector: "S3", time: "23,242", theoretical: "23,180" },
  ],
  "2025-05-10": [
    { sector: "S1", time: "12,710", theoretical: "12,680" },
    { sector: "S2", time: "18,450", theoretical: "18,400" },
    { sector: "S3", time: "23,170", theoretical: "23,120" },
  ],
  "2025-05-03": [
    { sector: "S1", time: "12,890", theoretical: "12,850" },
    { sector: "S2", time: "18,620", theoretical: "18,560" },
    { sector: "S3", time: "23,045", theoretical: "22,990" },
  ],
  "2025-04-19": [
    { sector: "S1", time: "13,020", theoretical: "12,980" },
    { sector: "S2", time: "18,780", theoretical: "18,720" },
    { sector: "S3", time: "22,920", theoretical: "22,860" },
  ],
};

export function getTelemetrySectorsForSession(
  sessionId: string,
): TelemetrySectorRow[] {
  return (
    TELEMETRY_SECTORS_BY_SESSION[sessionId] ??
    TELEMETRY_SECTORS_BY_SESSION[TELEMETRY_DEFAULT_SESSION_ID]
  );
}

export function getTelemetryPilotSession(
  sessionId: string,
): TelemetryPilotSession {
  return (
    TELEMETRY_PILOT_SESSIONS.find((s) => s.id === sessionId) ??
    TELEMETRY_PILOT_SESSIONS[0]
  );
}

export type TelemetryDeviceType = "mychron" | "alfano" | "gopro";

export const TELEMETRY_DEVICE_OPTIONS: {
  id: TelemetryDeviceType;
  label: string;
  hint: string;
}[] = [
  {
    id: "mychron",
    label: "MyChron",
    hint: "Exportação .csv do AiM Race Studio ou similar.",
  },
  {
    id: "alfano",
    label: "Alfano",
    hint: "Arquivo .csv exportado pelo software Alfano.",
  },
  {
    id: "gopro",
    label: "GoPro",
    hint: "Vídeo .MP4 original da câmera (GOPR/GX). LRV e cortes do app podem não ter GPS.",
  },
];

export type TelemetryTabKey =
  | "velocidade"
  | "rpm"
  | "aceleracao_lateral"
  | "aceleracao_longitudinal"
  | "giro";

/** Ordem dos gráficos na coluna central da telemetria */
export const TELEMETRY_CHART_METRICS: { key: TelemetryTabKey; label: string }[] = [
  { key: "velocidade", label: "Velocidade" },
  { key: "rpm", label: "RPM" },
  { key: "aceleracao_lateral", label: "Aceleração lateral" },
  { key: "aceleracao_longitudinal", label: "Aceleração longitudinal" },
  { key: "giro", label: "Giro" },
];

export const TELEMETRY_TABS = TELEMETRY_CHART_METRICS;

/** Cores por volta selecionada (comparação multi-volta) — paleta centrada no azul da aplicação */
export const TELEMETRY_LAP_COLORS = [
  "#0d1f3c",
  "#2563eb",
  "#0284c7",
  "#1e40af",
  "#0369a1",
  "#3b82f6",
  "#6366f1",
  "#0891b2",
] as const;

/** Grupo ECharts — sincroniza cursor vertical entre os 5 gráficos */
export const TELEMETRY_CHART_GROUP = "telemetry-sync";

/** Kartódromo Internacional Ayrton Senna (Brasília) — Google Maps */
export const TELEMETRY_TRACK_MAP = {
  title: "Kartódromo Internacional Ayrton Senna",
  latitude: -15.8254576,
  longitude: -47.9743033,
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=-15.8254576,-47.9743033",
} as const;

/** Comprimento da volta (m) — um ponto de telemetria por metro no eixo X */
export const TELEMETRY_TRACK_LENGTH_M = 890;

const TELEMETRY_ANCHOR_DIST_M = [0, 111, 222, 333, 445, 556, 667, 778, 890] as const;

const TELEMETRY_ANCHOR_SERIES: Record<
  TelemetryTabKey,
  { yours: readonly number[]; reference: readonly number[] }
> = {
  velocidade: {
    yours: [48, 72, 58, 88, 52, 91, 66, 84, 62],
    reference: [46, 70, 56, 86, 50, 89, 64, 82, 60],
  },
  rpm: {
    yours: [9200, 11800, 10100, 13200, 9800, 13800, 11250, 12800, 10500],
    reference: [9000, 11650, 10000, 13000, 9600, 13600, 11100, 12600, 10300],
  },
  aceleracao_lateral: {
    yours: [-4.8, -2.1, 7.8, -5.9, -1.2, 9.6, -3.9, -4.9, -2.2],
    reference: [-4.4, -1.9, 7.7, -5.9, -0.9, 9.9, -3.9, -4.9, -2],
  },
  aceleracao_longitudinal: {
    yours: [3.1, -6.2, -3.9, -5.9, -2.9, -5.9, -3.9, -5.4, -3.9],
    reference: [3.15, -5.82, -3.93, -5.93, -2.93, -5.93, -3.93, -5.44, -3.93],
  },
  giro: {
    yours: [0, 12, -28, 45, -15, 62, -8, 35, -5],
    reference: [0, 10, -26, 42, -14, 58, -7, 33, -4],
  },
};

function formatTelemetrySample(tab: TelemetryTabKey, value: number): number {
  if (tab === "rpm" || tab === "velocidade" || tab === "giro") {
    return Math.round(value);
  }
  return Number(value.toFixed(2));
}

/** Interpola amostras de referência para cada metro (0 … comprimento da pista) */
function resampleTelemetryAnchors(
  tab: TelemetryTabKey,
  anchorValues: readonly number[],
): number[] {
  const len = TELEMETRY_TRACK_LENGTH_M;
  const dist = TELEMETRY_ANCHOR_DIST_M;
  const out: number[] = [];
  for (let m = 0; m <= len; m++) {
    let v = anchorValues[anchorValues.length - 1] ?? 0;
    for (let s = 0; s < dist.length - 1; s++) {
      const d0 = dist[s];
      const d1 = dist[s + 1];
      if (m >= d0 && m <= d1) {
        const t = d1 === d0 ? 0 : (m - d0) / (d1 - d0);
        v = anchorValues[s] + t * (anchorValues[s + 1] - anchorValues[s]);
        break;
      }
    }
    const wobble =
      Math.sin(m * 0.041) * (tab === "giro" ? 1.8 : tab === "rpm" ? 45 : 0.35);
    out.push(formatTelemetrySample(tab, v + wobble));
  }
  return out;
}

/** Distância ao longo da volta (m) — eixo X: um rótulo por metro */
export const TELEMETRY_DISTANCE_M: readonly string[] = Array.from(
  { length: TELEMETRY_TRACK_LENGTH_M + 1 },
  (_, i) => String(i),
);

/** Eixo Y: unidade por aba + demonstração comparativa sua volta / referência */
export const TELEMETRY_Y_AXIS: Record<
  TelemetryTabKey,
  { name: string; formatter: (v: number) => string }
> = {
  velocidade: {
    name: "Velocidade (km/h)",
    formatter: (v) => `${Math.round(v)}`,
  },
  rpm: {
    name: "RPM",
    formatter: (v) => `${Math.round(v)}`,
  },
  aceleracao_lateral: {
    name: "Acel. lateral (m/s²)",
    formatter: (v) => `${v.toFixed(1)}`.replace(".", ","),
  },
  aceleracao_longitudinal: {
    name: "Acel. longitudinal (m/s²)",
    formatter: (v) => `${v.toFixed(1)}`.replace(".", ","),
  },
  giro: {
    name: "Giro (°/s)",
    formatter: (v) => `${v.toFixed(0)}`,
  },
};

export const TELEMETRY_CHART_BY_TAB: Record<
  TelemetryTabKey,
  { yours: number[]; reference: number[] }
> = (Object.keys(TELEMETRY_ANCHOR_SERIES) as TelemetryTabKey[]).reduce(
  (acc, tab) => {
    const anchor = TELEMETRY_ANCHOR_SERIES[tab];
    acc[tab] = {
      yours: resampleTelemetryAnchors(tab, anchor.yours),
      reference: resampleTelemetryAnchors(tab, anchor.reference),
    };
    return acc;
  },
  {} as Record<TelemetryTabKey, { yours: number[]; reference: number[] }>,
);

/** Voltas da última sessão cronometrada (lista na coluna esquerda da telemetria) */
export type TelemetrySessionLap = {
  lap: number;
  timeLabel: string;
};

export const TELEMETRY_SESSION_LAPS: TelemetrySessionLap[] = [
  { lap: 1, timeLabel: "56,240" },
  { lap: 2, timeLabel: "54,890" },
  { lap: 3, timeLabel: "54,112" },
  { lap: 4, timeLabel: "54,330" },
  { lap: 5, timeLabel: "54,555" },
  { lap: 6, timeLabel: "54,901" },
  { lap: 7, timeLabel: "54,720" },
  { lap: 8, timeLabel: "54,612" },
];

/** Curva “sua volta” derivada do índice da volta (demo); referência mantém-se igual. */
export function telemetrySeriesForLap(
  tab: TelemetryTabKey,
  lapIndex: number,
): { yours: number[]; reference: number[] } {
  const base = TELEMETRY_CHART_BY_TAB[tab];
  const n = Math.max(1, TELEMETRY_SESSION_LAPS.length);
  const mid = (n - 1) / 2;
  const u = lapIndex - mid;
  const scale = 1 + u * 0.014;
  const wobble = u * 0.32;

  const yours = base.yours.map((v, i) => {
    const raw =
      v * scale + wobble * Math.sin((i * 0.09 + lapIndex * 0.55) * 1.15);
    if (tab === "rpm" || tab === "velocidade" || tab === "giro") {
      return Math.round(raw);
    }
    return Number(raw.toFixed(2));
  });

  return {
    yours,
    reference: [...base.reference],
  };
}

/** Série de uma volta para sobreposição em gráficos multi-volta */
export function telemetryLapSeries(
  tab: TelemetryTabKey,
  lapIndex: number
): number[] {
  return telemetrySeriesForLap(tab, lapIndex).yours;
}

/** Domínio Y para várias voltas na mesma métrica */
export function telemetryYExtentForLaps(
  tab: TelemetryTabKey,
  lapIndices: number[]
): { min: number; max: number } {
  const seriesList = lapIndices.map((idx) => ({
    yours: telemetryLapSeries(tab, idx),
    reference: [] as number[],
  }));
  return telemetrySharedYExtent(tab, seriesList);
}

/** Domínio Y partilhado entre gráficos com a mesma métrica (comparação alinhada). */
export function telemetrySharedYExtent(
  tab: TelemetryTabKey,
  seriesPairList: { yours: number[]; reference: number[] }[],
): { min: number; max: number } {
  const nums = seriesPairList
    .flatMap((s) => [...s.yours, ...s.reference])
    .filter((v) => typeof v === "number" && Number.isFinite(v));
  if (nums.length === 0) return { min: 0, max: 1 };
  let minV = Math.min(...nums);
  let maxV = Math.max(...nums);
  const span =
    maxV - minV ||
    Math.max(Math.abs(maxV), Math.abs(minV)) * 0.05 ||
    1;
  const pad = span * 0.06;
  minV -= pad;
  maxV += pad;
  if (tab === "rpm" || tab === "velocidade") {
    minV = Math.floor(minV);
    maxV = Math.ceil(maxV);
  } else {
    minV = Number(minV.toFixed(2));
    maxV = Number(maxV.toFixed(2));
  }
  if (minV === maxV) {
    minV -= 1;
    maxV += 1;
  }
  return { min: minV, max: maxV };
}

export type Achievement = {
  id: string;
  label: string;
  unlocked: boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "primeira_aula", label: "Primeira aula", unlocked: true },
  { id: "sub55", label: "Sub 55s", unlocked: true },
  { id: "aulas5", label: "5 aulas", unlocked: false },
  { id: "podio", label: "Pódio", unlocked: false },
  { id: "consistencia", label: "Consistência", unlocked: false },
];

/** Volta a volta (demo) — modal de detalhe do treino */
export type TrainingLapDetail = { lap: number; time: string };

export type ResultRow = {
  id: string;
  dateLabel: string;
  bestLap: string;
  avgLap: string;
  /** Tempo acumulado em pista (sessão) */
  totalTrackTime: string;
  laps: TrainingLapDetail[];
};

export const LAST_RESULTS: ResultRow[] = [
  {
    id: "t1",
    dateLabel: "25/02/25",
    bestLap: "54,112",
    avgLap: "54,801",
    totalTrackTime: "24:18",
    laps: [
      { lap: 1, time: "56,240" },
      { lap: 2, time: "54,890" },
      { lap: 3, time: "54,112" },
      { lap: 4, time: "54,330" },
      { lap: 5, time: "54,555" },
      { lap: 6, time: "54,901" },
      { lap: 7, time: "54,720" },
      { lap: 8, time: "54,612" },
    ],
  },
  {
    id: "t2",
    dateLabel: "18/02/25",
    bestLap: "53,902",
    avgLap: "54,205",
    totalTrackTime: "18:55",
    laps: [
      { lap: 1, time: "55,100" },
      { lap: 2, time: "54,210" },
      { lap: 3, time: "53,902" },
      { lap: 4, time: "54,050" },
      { lap: 5, time: "54,180" },
      { lap: 6, time: "53,990" },
    ],
  },
  {
    id: "t3",
    dateLabel: "11/01/25",
    bestLap: "54,284",
    avgLap: "54,940",
    totalTrackTime: "32:04",
    laps: [
      { lap: 1, time: "56,800" },
      { lap: 2, time: "55,120" },
      { lap: 3, time: "54,284" },
      { lap: 4, time: "54,600" },
      { lap: 5, time: "54,900" },
      { lap: 6, time: "55,010" },
      { lap: 7, time: "54,450" },
      { lap: 8, time: "54,300" },
      { lap: 9, time: "54,880" },
      { lap: 10, time: "54,700" },
    ],
  },
  {
    id: "t4",
    dateLabel: "04/01/25",
    bestLap: "55,640",
    avgLap: "56,120",
    totalTrackTime: "15:30",
    laps: [
      { lap: 1, time: "57,200" },
      { lap: 2, time: "56,400" },
      { lap: 3, time: "55,640" },
      { lap: 4, time: "56,100" },
      { lap: 5, time: "55,890" },
    ],
  },
  {
    id: "t5",
    dateLabel: "28/12/24",
    bestLap: "55,012",
    avgLap: "55,680",
    totalTrackTime: "22:40",
    laps: [
      { lap: 1, time: "56,500" },
      { lap: 2, time: "55,800" },
      { lap: 3, time: "55,012" },
      { lap: 4, time: "55,400" },
      { lap: 5, time: "55,250" },
      { lap: 6, time: "55,600" },
      { lap: 7, time: "55,100" },
    ],
  },
];

export type VideoMaterial = {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  pdfUrl: string;
  pdfLabel: string;
  tag?: string | null;
};

/** Demos: PDF via arquivo público de exemplo; substitua por assets reais. */
export const VIDEO_MATERIALS: VideoMaterial[] = [
  {
    id: "v1",
    title: "Traçado ideal — setor 1 ao 3",
    duration: "8:24",
    thumbnail: "/images/post-3.jpg",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfLabel: "Mapa de freios (PDF)",
    tag: "Novo",
  },
  {
    id: "v2",
    title: "Entrada em curva rápida e referência",
    duration: "12:05",
    thumbnail: "/images/post-1.jpg",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfLabel: "Checklist pré-grid (PDF)",
    tag: null,
  },
  {
    id: "v3",
    title: "Análise de telemetria — última sessão",
    duration: "15:40",
    thumbnail: "/images/gallery-4.jpg",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfLabel: "Relatório da sessão (PDF)",
    tag: null,
  },
  {
    id: "v4",
    title: "Saida de curva e aceleração progressiva",
    duration: "9:12",
    thumbnail: "/images/gallery-2.jpg",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfLabel: "Ficha técnica (PDF)",
    tag: null,
  },
  {
    id: "v5",
    title: "Briefing — chuva e traçado alternativo",
    duration: "6:48",
    thumbnail: "/images/post-2.jpg",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfLabel: "Notas de pista (PDF)",
    tag: "Destaque",
  },
];

export type QuickAction = {
  key: string;
  label: string;
  subtitle: string;
  href?: string;
};

export const QUICK_ACTIONS: QuickAction[] = [
  { key: "agenda", label: "Agendar aula", subtitle: "Escolha data e turma", href: "/reserva" },
  { key: "pacote", label: "Comprar pacote", subtitle: "125cc ou F400" },
  {
    key: "coletivo",
    label: "Treino coletivo",
    subtitle: "Sessões em grupo",
  },
  { key: "campeonato", label: "Campeonatos", subtitle: "Datas e categorias" },
  { key: "equipa", label: "Falar com a equipa", subtitle: "WhatsApp rápido" },
];

export const SIDEBAR_PLAN = {
  title: "Seu plano",
  tier: "Competidor Pro",
  remaining: "6 de 10 aulas restantes",
  expiry: "Renova dia 06 de Dez de 2025",
  progressPct: 40,
  cta: "Ver detalhes",
} as const;

export const SIDEBAR_COMPETE = {
  title: "Quer competir?",
  description:
    "Participe de campeonatos internos e externos. Inscreva-se com a sua equipe!",
  cta: "Ver campeonatos",
} as const;
