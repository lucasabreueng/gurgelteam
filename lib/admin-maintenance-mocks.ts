/** Dados mockados — Manutenção Gurgel Team */

export type MaintenanceTabKey =
  | "todas"
  | "preventivas"
  | "corretivas"
  | "emergenciais"
  | "em_andamento"
  | "aguardando_peca"
  | "finalizadas"
  | "historico";

export type MaintenancePriority = "baixa" | "media" | "alta" | "critica";

export type MaintenanceStatus =
  | "detectado"
  | "aguardando_analise"
  | "aguardando_peca"
  | "em_manutencao"
  | "em_testes"
  | "finalizado"
  | "liberado";

export type MaintenanceType = "preventiva" | "corretiva" | "emergencial";

export type ChecklistItemStatus = "ok" | "warn" | "fail";

export const FLOW_STATUSES: MaintenanceStatus[] = [
  "detectado",
  "aguardando_analise",
  "aguardando_peca",
  "em_manutencao",
  "em_testes",
  "finalizado",
  "liberado",
];

export const MAINTENANCE_STATUS_LABELS: Record<MaintenanceStatus, string> = {
  detectado: "Detectado",
  aguardando_analise: "Aguardando análise",
  aguardando_peca: "Aguardando peça",
  em_manutencao: "Em manutenção",
  em_testes: "Em testes",
  finalizado: "Finalizado",
  liberado: "Liberado para pista",
};

export const MAINTENANCE_PRIORITY_LABELS: Record<MaintenancePriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  critica: "Crítica",
};

export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  preventiva: "Preventiva",
  corretiva: "Corretiva",
  emergencial: "Emergencial",
};

export type MaintenanceKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sparkline: number[];
};

export const MAINTENANCE_KPIS: MaintenanceKpi[] = [
  {
    id: "abertas",
    label: "Ordens abertas",
    value: "18",
    delta: "+3 esta semana",
    deltaPositive: false,
    sparkline: [12, 14, 13, 15, 16, 17, 18],
  },
  {
    id: "parados",
    label: "Karts parados",
    value: "6",
    delta: "2 críticos",
    deltaPositive: false,
    sparkline: [8, 7, 9, 6, 7, 6, 6],
  },
  {
    id: "preventivas",
    label: "Preventivas vencendo",
    value: "4",
    delta: "Até 7 dias",
    deltaPositive: false,
    sparkline: [2, 3, 2, 4, 3, 4, 4],
  },
  {
    id: "em_manut",
    label: "Em manutenção",
    value: "5",
    delta: "Na oficina",
    deltaPositive: true,
    sparkline: [3, 4, 5, 4, 5, 5, 5],
  },
  {
    id: "custo",
    label: "Custo mensal",
    value: "R$ 12.840",
    delta: "+8% vs mês",
    deltaPositive: false,
    sparkline: [9.2, 9.8, 10.1, 10.5, 11.2, 12.1, 12.8],
  },
  {
    id: "pecas",
    label: "Peças pendentes",
    value: "9",
    delta: "4 urgentes",
    deltaPositive: false,
    sparkline: [6, 7, 8, 7, 9, 8, 9],
  },
];

export const MAINTENANCE_TABLE_PAGE_SIZES = [10, 25, 50] as const;

export const MAINTENANCE_FILTER_PRIORITIES = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
  { value: "critica", label: "Crítica" },
] as const;

export const MAINTENANCE_FILTER_STATUSES = FLOW_STATUSES.map((value) => ({
  value,
  label: MAINTENANCE_STATUS_LABELS[value],
}));

export const MAINTENANCE_FILTER_TYPES = [
  { value: "preventiva", label: "Preventiva" },
  { value: "corretiva", label: "Corretiva" },
  { value: "emergencial", label: "Emergencial" },
] as const;

export const MAINTENANCE_MECHANICS = [
  { id: "m1", name: "Carlos Silva" },
  { id: "m2", name: "André Mendes" },
  { id: "m3", name: "Paulo Rocha" },
];

export const MAINTENANCE_KART_CATEGORIES = [
  { id: "f400", name: "F400" },
  { id: "125cc", name: "125cc" },
  { id: "cadete", name: "Cadete" },
  { id: "competicao", name: "Competição" },
  { id: "rental", name: "Rental" },
];

export type MaintenanceOrderListItem = {
  id: string;
  osNumber: string;
  kartId: string;
  kartNumber: number;
  kartPhoto: string;
  categoryId: string;
  categoryName: string;
  ownership: "rental" | "client";
  ownerName?: string;
  problem: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  type: MaintenanceType;
  mechanicId: string;
  mechanicName: string;
  openedAt: string;
  stoppedDays: number;
  partsNeeded: string[];
};

export const MAINTENANCE_ORDERS: MaintenanceOrderListItem[] = [
  {
    id: "os-001",
    osNumber: "OS-2026-0142",
    kartId: "k12",
    kartNumber: 12,
    kartPhoto: "/images/gallery-5.jpg",
    categoryId: "competicao",
    categoryName: "Competição",
    ownership: "rental",
    problem: "Queda de desempenho e vibração no eixo traseiro",
    priority: "critica",
    status: "aguardando_peca",
    type: "corretiva",
    mechanicId: "m1",
    mechanicName: "Carlos Silva",
    openedAt: "18 mai, 08:15",
    stoppedDays: 5,
    partsNeeded: ["Coroa 11×74", "Corrente O-Ring", "Pinhão"],
  },
  {
    id: "os-002",
    osNumber: "OS-2026-0138",
    kartId: "k18",
    kartNumber: 18,
    kartPhoto: "/images/gallery-2.jpg",
    categoryId: "125cc",
    categoryName: "125cc",
    ownership: "rental",
    problem: "Revisão preventiva 500h motor",
    priority: "media",
    status: "em_manutencao",
    type: "preventiva",
    mechanicId: "m2",
    mechanicName: "André Mendes",
    openedAt: "20 mai, 14:00",
    stoppedDays: 2,
    partsNeeded: ["Kit óleo", "Filtro ar"],
  },
  {
    id: "os-003",
    osNumber: "OS-2026-0135",
    kartId: "k07",
    kartNumber: 7,
    kartPhoto: "/images/gallery-4.jpg",
    categoryId: "125cc",
    categoryName: "125cc",
    ownership: "client",
    ownerName: "Rafael Costa",
    problem: "Freio dianteiro com resposta irregular",
    priority: "alta",
    status: "aguardando_analise",
    type: "corretiva",
    mechanicId: "m1",
    mechanicName: "Carlos Silva",
    openedAt: "21 mai, 09:30",
    stoppedDays: 1,
    partsNeeded: ["Pastilhas freio", "Fluido DOT4"],
  },
  {
    id: "os-004",
    osNumber: "OS-2026-0129",
    kartId: "k05",
    kartNumber: 5,
    kartPhoto: "/images/project-2.jpg",
    categoryId: "f400",
    categoryName: "F400",
    ownership: "rental",
    problem: "Carburador entupido após treino chuva",
    priority: "alta",
    status: "em_testes",
    type: "corretiva",
    mechanicId: "m3",
    mechanicName: "Paulo Rocha",
    openedAt: "19 mai, 16:45",
    stoppedDays: 3,
    partsNeeded: ["Kit giclêur", "Filtro combustível"],
  },
  {
    id: "os-005",
    osNumber: "OS-2026-0124",
    kartId: "k03",
    kartNumber: 3,
    kartPhoto: "/images/hero-image.jpg",
    categoryId: "cadete",
    categoryName: "Cadete",
    ownership: "rental",
    problem: "Preventiva vencida — pneus e alinhamento",
    priority: "media",
    status: "detectado",
    type: "preventiva",
    mechanicId: "m2",
    mechanicName: "André Mendes",
    openedAt: "21 mai, 11:00",
    stoppedDays: 0,
    partsNeeded: ["Pneus Vega Red", "Kit alinhamento"],
  },
  {
    id: "os-006",
    osNumber: "OS-2026-0118",
    kartId: "k22",
    kartNumber: 22,
    kartPhoto: "/images/gallery-3.jpg",
    categoryId: "competicao",
    categoryName: "Competição",
    ownership: "client",
    ownerName: "Marina Duarte",
    problem: "Impacto na carenagem — inspeção estrutural",
    priority: "critica",
    status: "em_manutencao",
    type: "emergencial",
    mechanicId: "m1",
    mechanicName: "Carlos Silva",
    openedAt: "17 mai, 07:20",
    stoppedDays: 6,
    partsNeeded: ["Carenagem lateral", "Suporte motor"],
  },
  {
    id: "os-007",
    osNumber: "OS-2026-0110",
    kartId: "k09",
    kartNumber: 9,
    kartPhoto: "/images/project-3.jpg",
    categoryId: "rental",
    categoryName: "Rental",
    ownership: "rental",
    problem: "Troca de relação e tensionamento corrente",
    priority: "baixa",
    status: "finalizado",
    type: "preventiva",
    mechanicId: "m3",
    mechanicName: "Paulo Rocha",
    openedAt: "15 mai, 10:00",
    stoppedDays: 4,
    partsNeeded: ["Corrente", "Pinhão", "Coroa"],
  },
  {
    id: "os-008",
    osNumber: "OS-2026-0105",
    kartId: "k14",
    kartNumber: 14,
    kartPhoto: "/images/gallery-1.jpg",
    categoryId: "f400",
    categoryName: "F400",
    ownership: "rental",
    problem: "Superaquecimento motor em treino longo",
    priority: "critica",
    status: "liberado",
    type: "corretiva",
    mechanicId: "m2",
    mechanicName: "André Mendes",
    openedAt: "12 mai, 13:10",
    stoppedDays: 7,
    partsNeeded: ["Radiador", "Mangueira", "Termostato"],
  },
  {
    id: "os-009",
    osNumber: "OS-2026-0098",
    kartId: "k11",
    kartNumber: 11,
    kartPhoto: "/images/about-body-image.png",
    categoryId: "125cc",
    categoryName: "125cc",
    ownership: "client",
    ownerName: "Felipe Nunes",
    problem: "Orçamento aprovado — revisão completa motor",
    priority: "media",
    status: "aguardando_peca",
    type: "corretiva",
    mechanicId: "m2",
    mechanicName: "André Mendes",
    openedAt: "16 mai, 08:00",
    stoppedDays: 5,
    partsNeeded: ["Carburador", "Vela", "Embreagem"],
  },
  {
    id: "os-010",
    osNumber: "OS-2026-0092",
    kartId: "k06",
    kartNumber: 6,
    kartPhoto: "/images/project-1.jpg",
    categoryId: "f400",
    categoryName: "F400",
    ownership: "rental",
    problem: "Checklist pós-treino reprovou freios",
    priority: "alta",
    status: "detectado",
    type: "emergencial",
    mechanicId: "m3",
    mechanicName: "Paulo Rocha",
    openedAt: "21 mai, 15:45",
    stoppedDays: 0,
    partsNeeded: ["Disco freio", "Pastilhas"],
  },
];

export type MaintenanceAlert = {
  id: string;
  message: string;
  severity: "info" | "warn" | "urgent";
  kartNumber?: number;
};

export const MAINTENANCE_ALERTS: MaintenanceAlert[] = [
  {
    id: "a1",
    message: "Kart 12 precisa trocar pneus em 3 sessões",
    severity: "warn",
    kartNumber: 12,
  },
  {
    id: "a2",
    message: "Motor do Kart 18 próximo da revisão",
    severity: "info",
    kartNumber: 18,
  },
  {
    id: "a3",
    message: "Kart 05 apresentou queda de desempenho",
    severity: "warn",
    kartNumber: 5,
  },
  {
    id: "a4",
    message: "Kart 07 está parado há 5 dias",
    severity: "urgent",
    kartNumber: 7,
  },
  {
    id: "a5",
    message: "Preventiva vencida do Kart 03",
    severity: "urgent",
    kartNumber: 3,
  },
];

export type ChecklistGroup = {
  title: string;
  items: { id: string; label: string; status: ChecklistItemStatus }[];
};

export type MaintenancePart = {
  id: string;
  name: string;
  supplier: string;
  qty: number;
  cost: string;
  status: "em_estoque" | "solicitado" | "aguardando" | "instalado";
  eta: string;
};

export type MaintenanceOrderDetail = {
  order: MaintenanceOrderListItem;
  eta: string;
  problemReport: {
    text: string;
    identifiedBy: string;
    dateTime: string;
    media: {
      id: string;
      label: string;
      type: "foto" | "video";
      url: string;
    }[];
    technicalNotes: string;
  };
  checklist: ChecklistGroup[];
  parts: MaintenancePart[];
  engineHours: {
    motor: number;
    remaining: number;
    preventive: string;
    oil: string;
    tires: string;
    ratio: string;
    alerts: { label: string; tone: "ok" | "warn" | "overdue" }[];
  };
  tests: {
    performed: boolean;
    pilot: string;
    notes: string;
    approved: boolean;
    released: boolean;
  };
  clientFlow?: {
    owner: string;
    phone: string;
    authorization: string;
    budget: string;
    approval: string;
    pendingFinance: string;
    steps: { label: string; done: boolean }[];
  };
  history: { id: string; date: string; title: string; detail: string; cost?: string }[];
  metrics: {
    monthlyCost: number[];
    topParts: { name: string; count: number }[];
    avgStopped: number[];
    failures: { issue: string; count: number }[];
    problematicKarts: { number: number; os: number }[];
    availability: number[];
  };
};

const DETAIL_BASE: Omit<MaintenanceOrderDetail, "order"> = {
  eta: "24 mai, 17:00",
  problemReport: {
    text: "Piloto relatou perda de tração na saída de curva lenta e ruído metálico intermitente.",
    identifiedBy: "Instrutor Lucas Mendes",
    dateTime: "18 mai 2026, 08:15",
    media: [
      {
        id: "med1",
        label: "Foto eixo traseiro",
        type: "foto",
        url: "/images/gallery-5.jpg",
      },
      {
        id: "med2",
        label: "Vídeo ruído motor",
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ],
    technicalNotes:
      "Desgaste irregular na coroa. Corrente com folga acima do limite. Recomendada troca do conjunto transmissão.",
  },
  checklist: [
    {
      title: "Motor",
      items: [
        { id: "mo1", label: "Funcionamento", status: "ok" },
        { id: "mo2", label: "Aceleração", status: "warn" },
        { id: "mo3", label: "Vazamentos", status: "ok" },
        { id: "mo4", label: "Temperatura", status: "ok" },
        { id: "mo5", label: "Carburador", status: "warn" },
      ],
    },
    {
      title: "Freios",
      items: [
        { id: "fr1", label: "Resposta", status: "ok" },
        { id: "fr2", label: "Pressão", status: "ok" },
        { id: "fr3", label: "Desgaste", status: "ok" },
        { id: "fr4", label: "Alinhamento", status: "ok" },
      ],
    },
    {
      title: "Pneus",
      items: [
        { id: "pn1", label: "Desgaste", status: "warn" },
        { id: "pn2", label: "Calibragem", status: "ok" },
        { id: "pn3", label: "Ciclos de uso", status: "warn" },
        { id: "pn4", label: "Temperatura", status: "ok" },
      ],
    },
    {
      title: "Estrutura",
      items: [
        { id: "es1", label: "Chassi", status: "ok" },
        { id: "es2", label: "Alinhamento", status: "ok" },
        { id: "es3", label: "Carenagem", status: "ok" },
        { id: "es4", label: "Parafusos", status: "ok" },
        { id: "es5", label: "Banco", status: "ok" },
        { id: "es6", label: "Volante", status: "ok" },
      ],
    },
  ],
  parts: [
    {
      id: "p1",
      name: "Corrente O-Ring",
      supplier: "Racing Parts BR",
      qty: 1,
      cost: "R$ 420",
      status: "aguardando",
      eta: "23 mai",
    },
    {
      id: "p2",
      name: "Coroa 11×74",
      supplier: "Racing Parts BR",
      qty: 1,
      cost: "R$ 680",
      status: "solicitado",
      eta: "23 mai",
    },
    {
      id: "p3",
      name: "Pinhão",
      supplier: "Kart Pro",
      qty: 1,
      cost: "R$ 290",
      status: "em_estoque",
      eta: "Imediato",
    },
    {
      id: "p4",
      name: "Pastilhas freio",
      supplier: "Kart Pro",
      qty: 2,
      cost: "R$ 180",
      status: "instalado",
      eta: "—",
    },
  ],
  engineHours: {
    motor: 512,
    remaining: 88,
    preventive: "Revisão em 88h",
    oil: "Troca em 12h",
    tires: "Troca recomendada",
    ratio: "11×74 — verificar",
    alerts: [
      { label: "Revisão preventiva próxima", tone: "warn" },
      { label: "Óleo dentro do prazo", tone: "ok" },
    ],
  },
  tests: {
    performed: false,
    pilot: "—",
    notes: "Aguardando peças para teste em pista.",
    approved: false,
    released: false,
  },
  history: [
    {
      id: "h1",
      date: "10 abr 2026",
      title: "Troca de pneus",
      detail: "Paulo Rocha — Vega Red",
      cost: "R$ 1.240",
    },
    {
      id: "h2",
      date: "22 mar 2026",
      title: "Revisão 400h motor",
      detail: "André Mendes — kit completo",
      cost: "R$ 2.890",
    },
    {
      id: "h3",
      date: "05 fev 2026",
      title: "Alinhamento e geometria",
      detail: "Carlos Silva",
      cost: "R$ 380",
    },
  ],
  metrics: {
    monthlyCost: [8.2, 9.1, 10.4, 11.2, 12.8],
    topParts: [
      { name: "Pneus", count: 24 },
      { name: "Corrente", count: 18 },
      { name: "Pastilhas", count: 15 },
      { name: "Carburador", count: 9 },
    ],
    avgStopped: [3.2, 2.9, 2.7, 2.5, 2.3],
    failures: [
      { issue: "Transmissão", count: 12 },
      { issue: "Freios", count: 9 },
      { issue: "Motor", count: 7 },
    ],
    problematicKarts: [
      { number: 12, os: 8 },
      { number: 7, os: 6 },
      { number: 22, os: 5 },
    ],
    availability: [88, 86, 90, 87, 91],
  },
};

export function getMaintenanceDetail(
  orderId: string
): MaintenanceOrderDetail | null {
  const order = MAINTENANCE_ORDERS.find((o) => o.id === orderId);
  if (!order) return null;

  const clientFlow =
    order.ownership === "client"
      ? {
          owner: order.ownerName ?? "Cliente",
          phone: "(11) 98765-4321",
          authorization: "Serviços mecânicos e transmissão",
          budget: "R$ 2.450,00",
          approval: "Aprovado em 17 mai",
          pendingFinance: "R$ 890 — peças extras",
          steps: [
            { label: "Problema detectado", done: true },
            { label: "Orçamento enviado", done: true },
            { label: "Cliente aprova", done: order.status !== "detectado" },
            { label: "Manutenção executada", done: ["em_testes", "finalizado", "liberado"].includes(order.status) },
            { label: "Entrega / liberação", done: order.status === "liberado" },
          ],
        }
      : undefined;

  return {
    order,
    ...DETAIL_BASE,
    eta: order.status === "liberado" ? "Concluído" : DETAIL_BASE.eta,
    tests: {
      performed: order.status === "em_testes" || order.status === "liberado",
      pilot: order.status === "liberado" ? "Lucas Mendes" : order.status === "em_testes" ? "Instrutor teste" : "—",
      notes:
        order.status === "liberado"
          ? "Kart aprovado em 3 voltas de validação. Sem anomalias."
          : DETAIL_BASE.tests.notes,
      approved: order.status === "liberado",
      released: order.status === "liberado",
    },
    clientFlow,
  };
}

export function filterOrdersByTab(
  orders: MaintenanceOrderListItem[],
  tab: MaintenanceTabKey
): MaintenanceOrderListItem[] {
  switch (tab) {
    case "preventivas":
      return orders.filter((o) => o.type === "preventiva");
    case "corretivas":
      return orders.filter((o) => o.type === "corretiva");
    case "emergenciais":
      return orders.filter((o) => o.type === "emergencial");
    case "em_andamento":
      return orders.filter((o) =>
        ["aguardando_analise", "em_manutencao", "em_testes", "detectado"].includes(o.status)
      );
    case "aguardando_peca":
      return orders.filter((o) => o.status === "aguardando_peca");
    case "finalizadas":
      return orders.filter((o) => ["finalizado", "liberado"].includes(o.status));
    case "historico":
      return orders.filter((o) => ["finalizado", "liberado"].includes(o.status));
    default:
      return orders;
  }
}

export const MAINTENANCE_PAGE_METRICS = DETAIL_BASE.metrics;

export const MAINTENANCE_HISTORY_LINES = MAINTENANCE_ORDERS.filter((o) =>
  ["finalizado", "liberado"].includes(o.status)
).map(
  (o) =>
    `${o.openedAt} — ${o.osNumber} — Kart ${String(o.kartNumber).padStart(2, "0")} — ${MAINTENANCE_TYPE_LABELS[o.type]} — ${MAINTENANCE_STATUS_LABELS[o.status]}`
);
