/** Controle Financeiro — mocks (sem backend) */

export type FinancialKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sparkline: number[];
  /** Texto auxiliar abaixo do valor (ex.: vs mês anterior) */
  sub?: string;
  /** Tooltip explicativo do indicador */
  tooltip?: string;
};

export const FINANCIAL_KPIS: FinancialKpi[] = [
  {
    id: "revenue-month",
    label: "Receita do mês",
    value: "R$ 48.500",
    delta: "↑ 12%",
    deltaPositive: true,
    sub: "vs mês anterior",
    sparkline: [38, 40, 42, 44, 45, 47, 48.5],
  },
  {
    id: "revenue-forecast",
    label: "Receita prevista",
    value: "R$ 56.200",
    delta: "+15,9%",
    deltaPositive: true,
    sparkline: [44, 46, 48, 50, 52, 54, 56.2],
  },
  {
    id: "receivable",
    label: "Contas a receber",
    value: "R$ 8.420",
    delta: "12 títulos",
    deltaPositive: true,
    sparkline: [6, 7, 7.5, 8, 8.2, 8.3, 8.42],
  },
  {
    id: "delinquency",
    label: "Inadimplência",
    value: "R$ 2.180",
    delta: "↓ 4%",
    deltaPositive: true,
    sub: "vs mês anterior",
    sparkline: [3.2, 2.9, 2.7, 2.5, 2.4, 2.2, 2.18],
  },
  {
    id: "ticket",
    label: "Ticket médio",
    value: "R$ 1.240",
    delta: "+6%",
    deltaPositive: true,
    sparkline: [980, 1020, 1080, 1120, 1160, 1200, 1240],
  },
  {
    id: "profit",
    label: "Lucro estimado",
    value: "R$ 21.300",
    delta: "+11%",
    deltaPositive: true,
    sparkline: [14, 16, 17, 18, 19, 20, 21.3],
  },
  {
    id: "profit-month",
    label: "Lucro do mês",
    value: "R$ 21.300",
    delta: "↑ 11%",
    deltaPositive: true,
    sub: "vs mês anterior",
    sparkline: [14, 16, 17, 18, 19, 20, 21.3],
  },
  {
    id: "cash-balance",
    label: "Saldo em caixa",
    value: "R$ 34.800",
    delta: "↑ 5%",
    deltaPositive: true,
    sub: "vs mês anterior",
    sparkline: [28, 29, 30, 31, 32, 33, 34.8],
  },
  {
    id: "monthly-goal",
    label: "Meta mensal",
    value: "97%",
    delta: "R$ 50.000",
    deltaPositive: true,
    sub: "da meta de receita",
    sparkline: [82, 85, 88, 91, 93, 95, 97],
  },
  {
    id: "growth",
    label: "Crescimento mensal",
    value: "+12%",
    delta: "vs. mês anterior",
    deltaPositive: true,
    sparkline: [4, 5, 6, 8, 9, 10, 12],
  },
  {
    id: "packages",
    label: "Pacotes ativos",
    value: "42",
    delta: "+5 novos",
    deltaPositive: true,
    sparkline: [32, 34, 36, 37, 39, 40, 42],
  },
];

export const MONTHLY_REVENUE_CHART = {
  months: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  revenue: [32, 38, 41, 44, 46, 48.5],
  forecast: [34, 40, 43, 46, 50, 56.2],
};

export const IN_OUT_CHART = {
  months: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  entries: [32, 38, 41, 44, 46, 48.5],
  exits: [18, 19, 20, 21, 22, 27.2],
};

export type CashFlowPeriod = "daily" | "weekly" | "monthly";

export const CASH_FLOW_BY_PERIOD: Record<
  CashFlowPeriod,
  { labels: string[]; entries: number[]; exits: number[]; balance: number[] }
> = {
  daily: {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    entries: [4.2, 5.1, 3.8, 6.2, 7.4, 9.1, 4.8],
    exits: [1.8, 2.1, 1.9, 2.4, 2.8, 3.2, 1.5],
    balance: [2.4, 3.0, 1.9, 3.8, 4.6, 5.9, 3.3],
  },
  weekly: {
    labels: ["S1", "S2", "S3", "S4"],
    entries: [18, 22, 24, 28],
    exits: [9, 10, 11, 12],
    balance: [9, 12, 13, 16],
  },
  monthly: {
    labels: MONTHLY_REVENUE_CHART.months,
    entries: IN_OUT_CHART.entries,
    exits: IN_OUT_CHART.exits,
    balance: [14, 19, 21, 23, 24, 21.3],
  },
};

export const REVENUE_BY_SERVICE = [
  { name: "Pacotes", value: 18.2 },
  { name: "Aulas avulsas", value: 12.4 },
  { name: "Aluguel kart", value: 8.6 },
  { name: "Manutenção cliente", value: 4.1 },
  { name: "Eventos", value: 3.2 },
  { name: "Coaching", value: 2.0 },
];

export const PAYMENT_METHODS = [
  { name: "Pix", value: 52, amount: "R$ 25.220" },
  { name: "Cartão", value: 28, amount: "R$ 13.580" },
  { name: "Dinheiro", value: 12, amount: "R$ 5.820" },
  { name: "Transferência", value: 8, amount: "R$ 3.880" },
];

export const FINANCIAL_EVOLUTION = {
  weeks: ["S1", "S2", "S3", "S4", "S5", "S6"],
  revenue: [10, 11.5, 12, 13.2, 14, 15.8],
  costs: [5.5, 5.8, 6, 6.4, 6.8, 7.2],
  margin: [4.5, 5.7, 6, 6.8, 7.2, 8.6],
};

export type RevenueSourceKey =
  | "avulsas"
  | "pacotes"
  | "aluguel"
  | "manutencao"
  | "eventos"
  | "coaching";

export type RevenueSource = {
  key: RevenueSourceKey;
  label: string;
  revenue: string;
  growth: string;
  growthPositive: boolean;
  salesCount: number;
};

export const REVENUE_SOURCES: RevenueSource[] = [
  {
    key: "avulsas",
    label: "Aulas avulsas",
    revenue: "R$ 12.400",
    growth: "+9%",
    growthPositive: true,
    salesCount: 28,
  },
  {
    key: "pacotes",
    label: "Pacotes",
    revenue: "R$ 18.200",
    growth: "+14%",
    growthPositive: true,
    salesCount: 19,
  },
  {
    key: "aluguel",
    label: "Aluguel de kart",
    revenue: "R$ 8.600",
    growth: "+6%",
    growthPositive: true,
    salesCount: 34,
  },
  {
    key: "manutencao",
    label: "Manutenção kart cliente",
    revenue: "R$ 4.100",
    growth: "+3%",
    growthPositive: true,
    salesCount: 11,
  },
  {
    key: "eventos",
    label: "Campeonatos/eventos",
    revenue: "R$ 3.200",
    growth: "-2%",
    growthPositive: false,
    salesCount: 4,
  },
  {
    key: "coaching",
    label: "Coaching/telemetria",
    revenue: "R$ 2.000",
    growth: "+18%",
    growthPositive: true,
    salesCount: 8,
  },
];

export type ExpenseCategory = {
  id: string;
  label: string;
  monthlyCost: string;
  trend: string;
  trendPositive: boolean;
  impact: "baixo" | "medio" | "alto";
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: "manut",
    label: "Manutenção",
    monthlyCost: "R$ 8.400",
    trend: "+4%",
    trendPositive: false,
    impact: "alto",
  },
  {
    id: "pecas",
    label: "Peças",
    monthlyCost: "R$ 5.200",
    trend: "-2%",
    trendPositive: true,
    impact: "medio",
  },
  {
    id: "pneus",
    label: "Pneus",
    monthlyCost: "R$ 3.800",
    trend: "+6%",
    trendPositive: false,
    impact: "medio",
  },
  {
    id: "combustivel",
    label: "Combustível",
    monthlyCost: "R$ 2.900",
    trend: "+1%",
    trendPositive: false,
    impact: "baixo",
  },
  {
    id: "externos",
    label: "Serviços externos",
    monthlyCost: "R$ 2.100",
    trend: "estável",
    trendPositive: true,
    impact: "baixo",
  },
  {
    id: "taxas",
    label: "Taxas",
    monthlyCost: "R$ 1.600",
    trend: "+3%",
    trendPositive: false,
    impact: "baixo",
  },
  {
    id: "estrutura",
    label: "Estrutura",
    monthlyCost: "R$ 3.200",
    trend: "0%",
    trendPositive: true,
    impact: "alto",
  },
];

export type ReceivableStatus = "pago" | "pendente" | "vencido" | "parcial";

export type AccountReceivable = {
  id: string;
  clientId: string;
  clientName: string;
  amount: string;
  dueDate: string;
  status: ReceivableStatus;
  paymentMethod: string;
  service: string;
};

export const ACCOUNTS_RECEIVABLE: AccountReceivable[] = [
  {
    id: "ar1",
    clientId: "c1",
    clientName: "Lucas Mendes",
    amount: "R$ 1.280",
    dueDate: "22 mai 2026",
    status: "vencido",
    paymentMethod: "Pix",
    service: "Pacote competição",
  },
  {
    id: "ar2",
    clientId: "c2",
    clientName: "Ana Ribeiro",
    amount: "R$ 900",
    dueDate: "25 mai 2026",
    status: "pendente",
    paymentMethod: "Cartão",
    service: "Pacote 20 aulas",
  },
  {
    id: "ar3",
    clientId: "c3",
    clientName: "João Silva",
    amount: "R$ 420",
    dueDate: "20 mai 2026",
    status: "parcial",
    paymentMethod: "Pix",
    service: "Aula avulsa",
  },
  {
    id: "ar4",
    clientId: "c4",
    clientName: "Marina Costa",
    amount: "R$ 2.400",
    dueDate: "28 mai 2026",
    status: "pendente",
    paymentMethod: "Transferência",
    service: "Pacote F400",
  },
  {
    id: "ar5",
    clientId: "c5",
    clientName: "Pedro Alves",
    amount: "R$ 580",
    dueDate: "18 mai 2026",
    status: "pago",
    paymentMethod: "Pix",
    service: "Aluguel kart",
  },
];

export type PackageCreditStatus = "ativo" | "expirando" | "esgotado";

export type PackageCredit = {
  id: string;
  clientId: string;
  clientName: string;
  packageName: string;
  lessonsTotal: number;
  lessonsUsed: number;
  validity: string;
  status: PackageCreditStatus;
  amountPaid: string;
};

export const PACKAGE_CREDITS: PackageCredit[] = [
  {
    id: "pk1",
    clientId: "c1",
    clientName: "Lucas Mendes",
    packageName: "Pacote competidor",
    lessonsTotal: 20,
    lessonsUsed: 18,
    validity: "15 jun 2026",
    status: "expirando",
    amountPaid: "R$ 4.800",
  },
  {
    id: "pk2",
    clientId: "c2",
    clientName: "Ana Ribeiro",
    packageName: "Pacote iniciante",
    lessonsTotal: 20,
    lessonsUsed: 12,
    validity: "30 ago 2026",
    status: "ativo",
    amountPaid: "R$ 3.200",
  },
  {
    id: "pk3",
    clientId: "c6",
    clientName: "Rafael Duarte",
    packageName: "Coaching premium",
    lessonsTotal: 8,
    lessonsUsed: 6,
    validity: "10 jun 2026",
    status: "expirando",
    amountPaid: "R$ 2.400",
  },
  {
    id: "pk4",
    clientId: "c7",
    clientName: "Carla Nunes",
    packageName: "Telemetria",
    lessonsTotal: 6,
    lessonsUsed: 6,
    validity: "01 mai 2026",
    status: "esgotado",
    amountPaid: "R$ 1.800",
  },
];

export type DelinquencyItem = {
  id: string;
  clientId: string;
  clientName: string;
  amount: string;
  daysLate: number;
  lastCharge: string;
  phone: string;
};

export const DELINQUENCY_ITEMS: DelinquencyItem[] = [
  {
    id: "d1",
    clientId: "c1",
    clientName: "Lucas Mendes",
    amount: "R$ 1.280",
    daysLate: 3,
    lastCharge: "Cobrança Pix — 19 mai",
    phone: "5511999990001",
  },
  {
    id: "d2",
    clientId: "c8",
    clientName: "Bruno Ferreira",
    amount: "R$ 900",
    daysLate: 7,
    lastCharge: "WhatsApp — 15 mai",
    phone: "5511999990008",
  },
];

export const DELINQUENCY_TOTAL = "R$ 2.180";

export type KartFinancial = {
  kartId: string;
  number: number;
  revenue: string;
  maintenanceCost: string;
  partsCost: string;
  estimatedProfit: string;
  usageHours: number;
  costPerHour: string;
  operationalMargin: string;
  profitPositive: boolean;
};

export const KART_FINANCIALS: KartFinancial[] = [
  {
    kartId: "k07",
    number: 7,
    revenue: "R$ 6.800",
    maintenanceCost: "R$ 1.200",
    partsCost: "R$ 840",
    estimatedProfit: "R$ 4.760",
    usageHours: 128,
    costPerHour: "R$ 16",
    operationalMargin: "70%",
    profitPositive: true,
  },
  {
    kartId: "k03",
    number: 3,
    revenue: "R$ 5.400",
    maintenanceCost: "R$ 2.100",
    partsCost: "R$ 1.400",
    estimatedProfit: "R$ 1.900",
    usageHours: 96,
    costPerHour: "R$ 36",
    operationalMargin: "35%",
    profitPositive: true,
  },
  {
    kartId: "k12",
    number: 12,
    revenue: "R$ 4.200",
    maintenanceCost: "R$ 2.800",
    partsCost: "R$ 1.600",
    estimatedProfit: "R$ -200",
    usageHours: 72,
    costPerHour: "R$ 61",
    operationalMargin: "-5%",
    profitPositive: false,
  },
  {
    kartId: "k06",
    number: 6,
    revenue: "R$ 5.900",
    maintenanceCost: "R$ 980",
    partsCost: "R$ 620",
    estimatedProfit: "R$ 4.300",
    usageHours: 110,
    costPerHour: "R$ 15",
    operationalMargin: "73%",
    profitPositive: true,
  },
];

export type ClientFinancial = {
  id: string;
  name: string;
  totalSpent: string;
  currentPlan: string;
  paymentsCount: number;
  pending: string;
  lessonsLeft: number;
  ticketAvg: string;
  paymentHistory: string[];
};

export const CLIENT_FINANCIALS: ClientFinancial[] = [
  {
    id: "c1",
    name: "Lucas Mendes",
    totalSpent: "R$ 18.400",
    currentPlan: "Pacote competidor",
    paymentsCount: 12,
    pending: "R$ 1.280",
    lessonsLeft: 2,
    ticketAvg: "R$ 1.530",
    paymentHistory: ["18 mai — R$ 580", "10 mai — R$ 1.200", "02 mai — R$ 900"],
  },
  {
    id: "c2",
    name: "Ana Ribeiro",
    totalSpent: "R$ 9.800",
    currentPlan: "Pacote 20 aulas",
    paymentsCount: 6,
    pending: "R$ 900",
    lessonsLeft: 8,
    ticketAvg: "R$ 1.630",
    paymentHistory: ["15 mai — R$ 900", "01 mai — R$ 800"],
  },
  {
    id: "c4",
    name: "Marina Costa",
    totalSpent: "R$ 14.200",
    currentPlan: "Pacote F400",
    paymentsCount: 9,
    pending: "R$ 2.400",
    lessonsLeft: 5,
    ticketAvg: "R$ 1.578",
    paymentHistory: ["17 mai — R$ 1.200", "05 mai — R$ 2.400"],
  },
];

export const FINANCIAL_TABLE_PAGE_SIZES = [10, 25, 50] as const;

export const OVERVIEW_FINANCIAL_KPI_IDS = [
  "revenue-month",
  "profit-month",
  "cash-balance",
  "delinquency",
  "monthly-goal",
] as const;

export type OperationalKpi = {
  id: string;
  label: string;
  value: string;
  sub?: string;
  tooltip?: string;
};

export const EXECUTIVE_OPERATIONAL_KPIS: OperationalKpi[] = [
  {
    id: "active-students",
    label: "Alunos ativos",
    value: "87",
    sub: "+4 vs mês anterior",
    tooltip: "Pilotos com plano ou créditos ativos na escola.",
  },
  {
    id: "lessons-month",
    label: "Aulas realizadas no mês",
    value: "142",
    sub: "92% da capacidade",
    tooltip: "Sessões concluídas no mês corrente.",
  },
  {
    id: "lessons-week",
    label: "Aulas agendadas (7 dias)",
    value: "38",
    sub: "Próximos 7 dias",
    tooltip: "Aulas confirmadas na agenda para a próxima semana.",
  },
  {
    id: "karts-available",
    label: "Karts disponíveis",
    value: "14",
    sub: "de 18 na frota",
    tooltip: "Karts operacionais e liberados para pista.",
  },
  {
    id: "karts-maintenance",
    label: "Karts em manutenção",
    value: "4",
    sub: "2 aguardando peças",
    tooltip: "Karts indisponíveis por ordem de serviço aberta.",
  },
];

export type BusinessEvolutionPeriod = "3m" | "6m" | "12m";

export const BUSINESS_EVOLUTION: Record<
  BusinessEvolutionPeriod,
  { labels: string[]; revenue: number[]; profit: number[]; goal: number[] }
> = {
  "3m": {
    labels: ["Mar", "Abr", "Mai"],
    revenue: [41, 44, 48.5],
    profit: [17, 19, 21.3],
    goal: [42, 45, 50],
  },
  "6m": {
    labels: ["Dez", "Jan", "Fev", "Mar", "Abr", "Mai"],
    revenue: [36, 32, 38, 41, 44, 48.5],
    profit: [14, 12, 16, 17, 19, 21.3],
    goal: [38, 40, 42, 42, 45, 50],
  },
  "12m": {
    labels: [
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
    ],
    revenue: [28, 30, 31, 33, 34, 35, 36, 32, 38, 41, 44, 48.5],
    profit: [10, 11, 12, 13, 13.5, 14, 14, 12, 16, 17, 19, 21.3],
    goal: [32, 33, 34, 35, 36, 37, 38, 40, 42, 42, 45, 50],
  },
};

export type RevenueOriginItem = {
  name: string;
  value: number;
  amount: string;
  percent: number;
};

export const REVENUE_ORIGIN: RevenueOriginItem[] = [
  { name: "Aulas", value: 18.4, amount: "R$ 17.800", percent: 36.7 },
  { name: "Pacotes", value: 14.2, amount: "R$ 13.740", percent: 28.3 },
  { name: "Aluguel de kart", value: 8.6, amount: "R$ 8.320", percent: 17.2 },
  { name: "Produtos", value: 4.8, amount: "R$ 4.640", percent: 9.6 },
  { name: "Outros", value: 4.1, amount: "R$ 4.000", percent: 8.2 },
];

export type ExecutiveAlertAction =
  | "receivables"
  | "agenda"
  | "renew-package"
  | "maintenance";

export type ExecutiveAlertPriority = "critical" | "warning" | "info" | "maintenance";

export type ExecutiveAlert = {
  id: string;
  priority: ExecutiveAlertPriority;
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  action: ExecutiveAlertAction;
};

export const EXECUTIVE_ALERTS: ExecutiveAlert[] = [
  {
    id: "alert-delinq",
    priority: "critical",
    icon: "🔴",
    title: "Clientes inadimplentes",
    description: "3 clientes com R$ 2.180 em atraso · maior atraso: 12 dias",
    actionLabel: "Cobrar cliente",
    action: "receivables",
  },
  {
    id: "alert-packages",
    priority: "warning",
    icon: "🟠",
    title: "Pacotes próximos do término",
    description: "5 pacotes com 2 aulas ou menos · risco de churn",
    actionLabel: "Renovar pacote",
    action: "renew-package",
  },
  {
    id: "alert-goal",
    priority: "warning",
    icon: "🟡",
    title: "Receita abaixo da meta",
    description: "Faltam R$ 1.500 para atingir 100% da meta de maio",
    actionLabel: "Ver agenda",
    action: "agenda",
  },
  {
    id: "alert-karts",
    priority: "maintenance",
    icon: "🔧",
    title: "Karts aguardando manutenção",
    description: "4 karts parados · 2 aguardando peças de freio",
    actionLabel: "Abrir manutenção",
    action: "maintenance",
  },
];

export type UpcomingPayable = {
  id: string;
  description: string;
  category: string;
  amount: string;
  dueDate: string;
};

export const EXECUTIVE_UPCOMING_PAYABLES: UpcomingPayable[] = [
  {
    id: "ap2",
    description: "MG Tires — pneus slick",
    category: "Pneus",
    amount: "R$ 5.800",
    dueDate: "20 mai 2026",
  },
  {
    id: "ap1",
    description: "Racing Parts BR — pastilhas e discos",
    category: "Peças",
    amount: "R$ 3.420",
    dueDate: "24 mai 2026",
  },
  {
    id: "ap3",
    description: "Motul BR — óleo 2T",
    category: "Lubrificantes",
    amount: "R$ 1.280",
    dueDate: "26 mai 2026",
  },
  {
    id: "ap6",
    description: "Track Rental — locação pista",
    category: "Estrutura",
    amount: "R$ 8.400",
    dueDate: "28 mai 2026",
  },
  {
    id: "ap7",
    description: "Seguro frota — parcela mensal",
    category: "Administrativo",
    amount: "R$ 2.650",
    dueDate: "30 mai 2026",
  },
];

export type CommercialRankingEntry = {
  rank: number;
  clientName: string;
  revenue: string;
  lessonsCount: number;
  ticketAvg: string;
};

export const EXECUTIVE_COMMERCIAL_RANKING: CommercialRankingEntry[] = [
  {
    rank: 1,
    clientName: "Lucas Mendes",
    revenue: "R$ 18.400",
    lessonsCount: 24,
    ticketAvg: "R$ 767",
  },
  {
    rank: 2,
    clientName: "Marina Costa",
    revenue: "R$ 14.200",
    lessonsCount: 18,
    ticketAvg: "R$ 789",
  },
  {
    rank: 3,
    clientName: "Rafael Duarte",
    revenue: "R$ 11.600",
    lessonsCount: 15,
    ticketAvg: "R$ 773",
  },
  {
    rank: 4,
    clientName: "Ana Ribeiro",
    revenue: "R$ 9.800",
    lessonsCount: 12,
    ticketAvg: "R$ 817",
  },
  {
    rank: 5,
    clientName: "João Silva",
    revenue: "R$ 8.200",
    lessonsCount: 10,
    ticketAvg: "R$ 820",
  },
];

export type FinancialTabKey =
  | "overview"
  | "receivables"
  | "payables"
  | "cashflow"
  | "dre";

export const FINANCIAL_TABS: { key: FinancialTabKey; label: string }[] = [
  { key: "overview", label: "Visão Geral" },
  { key: "receivables", label: "Contas a receber" },
  { key: "payables", label: "Contas a pagar" },
  { key: "cashflow", label: "Fluxo de Caixa" },
  { key: "dre", label: "DRE" },
];

export const FINANCIAL_TAB_META: Record<
  FinancialTabKey,
  { title: string; subtitle: string }
> = {
  overview: {
    title: "Visão Geral",
    subtitle: "Dashboard executivo — indicadores, alertas e decisões do Gurgel Team",
  },
  receivables: {
    title: "Contas a receber",
    subtitle: "Títulos, cobranças e recebimentos do período",
  },
  payables: {
    title: "Contas a pagar",
    subtitle: "Despesas, fornecedores e vencimentos",
  },
  cashflow: {
    title: "Fluxo de Caixa",
    subtitle: "Controle de entradas, saídas e saldo projetado",
  },
  dre: {
    title: "DRE",
    subtitle: "Demonstração do Resultado do Exercício",
  },
};

export const RECEIVABLE_STATUS_FILTER_OPTIONS: {
  value: ReceivableStatus | "";
  label: string;
}[] = [
  { value: "", label: "Status" },
  { value: "pago", label: "Pago" },
  { value: "pendente", label: "Pendente" },
  { value: "vencido", label: "Vencido" },
  { value: "parcial", label: "Parcial" },
];

export const RECEIVABLE_PAYMENT_METHODS = [
  "Pix",
  "Cartão",
  "Transferência",
  "Dinheiro",
] as const;

export const RECEIVABLE_SERVICES = [
  "Pacote competição",
  "Pacote 20 aulas",
  "Aula avulsa",
  "Pacote F400",
  "Aluguel kart",
] as const;

export const PAYABLE_CATEGORIES = [
  "Peças",
  "Pneus",
  "Lubrificantes",
  "Estrutura",
  "Ferramentas",
  "Motor",
] as const;

export function filterAccountsReceivable(
  items: AccountReceivable[],
  filters: {
    query: string;
    status: ReceivableStatus | "";
    method: string;
    service: string;
  },
): AccountReceivable[] {
  const q = filters.query.trim().toLowerCase();
  return items.filter((row) => {
    if (filters.status && row.status !== filters.status) return false;
    if (filters.method && row.paymentMethod !== filters.method) return false;
    if (filters.service && row.service !== filters.service) return false;
    if (!q) return true;
    return (
      row.clientName.toLowerCase().includes(q) ||
      row.service.toLowerCase().includes(q) ||
      row.amount.toLowerCase().includes(q)
    );
  });
}

export const RECEIVABLES_KPIS: FinancialKpi[] = [
  {
    id: "received",
    label: "Recebidos",
    value: "R$ 40.080",
    delta: "18 pagamentos",
    deltaPositive: true,
    sparkline: [32, 34, 36, 37, 39, 40, 40.08],
  },
  {
    id: "pending",
    label: "Pendentes",
    value: "R$ 3.300",
    delta: "2 títulos",
    deltaPositive: true,
    sparkline: [4, 3.8, 3.5, 3.4, 3.3, 3.3, 3.3],
  },
  {
    id: "overdue",
    label: "Vencidos",
    value: "R$ 1.280",
    delta: "1 título",
    deltaPositive: false,
    sparkline: [2, 1.8, 1.5, 1.4, 1.3, 1.28, 1.28],
  },
  {
    id: "partial",
    label: "Parciais",
    value: "R$ 420",
    delta: "1 título em aberto",
    deltaPositive: true,
    sparkline: [0.6, 0.55, 0.5, 0.48, 0.45, 0.42, 0.42],
  },
];

export const RECEIVABLES_SUMMARY = {
  received: "R$ 40.080",
  pending: "R$ 3.300",
  overdue: "R$ 1.280",
  partial: "R$ 420",
  receivedCount: 18,
  pendingCount: 2,
  overdueCount: 1,
};

export type ReceivedPayment = {
  id: string;
  clientName: string;
  amount: string;
  paidAt: string;
  method: string;
  service: string;
};

export type AccountPayable = {
  id: string;
  supplierName: string;
  category: string;
  amount: string;
  dueDate: string;
  status: ReceivableStatus;
  paymentMethod: string;
};

export const ACCOUNTS_PAYABLE: AccountPayable[] = [
  {
    id: "ap1",
    supplierName: "Racing Parts BR",
    category: "Peças",
    amount: "R$ 3.420",
    dueDate: "24 mai 2026",
    status: "pendente",
    paymentMethod: "Boleto",
  },
  {
    id: "ap2",
    supplierName: "MG Tires",
    category: "Pneus",
    amount: "R$ 5.800",
    dueDate: "20 mai 2026",
    status: "vencido",
    paymentMethod: "Pix",
  },
  {
    id: "ap3",
    supplierName: "Motul BR",
    category: "Lubrificantes",
    amount: "R$ 1.280",
    dueDate: "26 mai 2026",
    status: "pendente",
    paymentMethod: "Transferência",
  },
  {
    id: "ap4",
    supplierName: "Energia CEB",
    category: "Estrutura",
    amount: "R$ 2.100",
    dueDate: "18 mai 2026",
    status: "pago",
    paymentMethod: "Débito automático",
  },
  {
    id: "ap5",
    supplierName: "Kart Pro",
    category: "Ferramentas",
    amount: "R$ 890",
    dueDate: "22 mai 2026",
    status: "parcial",
    paymentMethod: "Pix",
  },
];

export function filterAccountsPayable(
  items: AccountPayable[],
  filters: {
    query: string;
    status: ReceivableStatus | "";
    method: string;
    category: string;
  },
): AccountPayable[] {
  const q = filters.query.trim().toLowerCase();
  return items.filter((row) => {
    if (filters.status && row.status !== filters.status) return false;
    if (filters.method && row.paymentMethod !== filters.method) return false;
    if (filters.category && row.category !== filters.category) return false;
    if (!q) return true;
    return (
      row.supplierName.toLowerCase().includes(q) ||
      row.category.toLowerCase().includes(q) ||
      row.amount.toLowerCase().includes(q)
    );
  });
}

export const PAYABLES_KPIS: FinancialKpi[] = [
  {
    id: "paid",
    label: "Pagos",
    value: "R$ 12.400",
    delta: "8 pagamentos",
    deltaPositive: true,
    sparkline: [8, 9, 10, 11, 11.5, 12, 12.4],
  },
  {
    id: "pending",
    label: "Pendentes",
    value: "R$ 9.500",
    delta: "3 títulos",
    deltaPositive: true,
    sparkline: [7, 8, 8.5, 9, 9.2, 9.4, 9.5],
  },
  {
    id: "overdue",
    label: "Vencidos",
    value: "R$ 5.800",
    delta: "1 título",
    deltaPositive: false,
    sparkline: [4, 4.5, 5, 5.2, 5.5, 5.7, 5.8],
  },
  {
    id: "partial",
    label: "Parciais",
    value: "R$ 450",
    delta: "1 título em aberto",
    deltaPositive: true,
    sparkline: [0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.45],
  },
];

export const PAYABLES_SUMMARY = {
  paid: "R$ 12.400",
  pending: "R$ 9.500",
  overdue: "R$ 5.800",
  partial: "R$ 450",
  paidCount: 8,
  pendingCount: 3,
  overdueCount: 1,
};

export type PaidExpense = {
  id: string;
  supplierName: string;
  amount: string;
  paidAt: string;
  method: string;
  category: string;
};

export const PAID_EXPENSES: PaidExpense[] = [
  {
    id: "pe1",
    supplierName: "Energia CEB",
    amount: "R$ 2.100",
    paidAt: "18 mai 2026",
    method: "Débito automático",
    category: "Estrutura",
  },
  {
    id: "pe2",
    supplierName: "NGK",
    amount: "R$ 640",
    paidAt: "16 mai 2026",
    method: "Pix",
    category: "Peças",
  },
  {
    id: "pe3",
    supplierName: "IAME Distrib.",
    amount: "R$ 4.200",
    paidAt: "14 mai 2026",
    method: "Boleto",
    category: "Motor",
  },
];

export const RECEIVED_PAYMENTS: ReceivedPayment[] = [
  {
    id: "rp1",
    clientName: "Pedro Alves",
    amount: "R$ 580",
    paidAt: "18 mai 2026",
    method: "Pix",
    service: "Aluguel kart",
  },
  {
    id: "rp2",
    clientName: "Marina Costa",
    amount: "R$ 1.200",
    paidAt: "17 mai 2026",
    method: "Cartão",
    service: "Pacote F400",
  },
  {
    id: "rp3",
    clientName: "Ana Ribeiro",
    amount: "R$ 900",
    paidAt: "15 mai 2026",
    method: "Pix",
    service: "Pacote 20 aulas",
  },
];

export const FINANCIAL_REPORTS = [
  { id: "daily", label: "Receita diária", desc: "Consolidado por dia" },
  { id: "monthly", label: "Receita mensal", desc: "Comparativo mensal" },
  { id: "service", label: "Receita por serviço", desc: "Mix de receitas" },
  { id: "client", label: "Receita por cliente", desc: "Ranking de clientes" },
  { id: "kart", label: "Receita por kart", desc: "Performance por kart" },
  { id: "costs", label: "Custos operacionais", desc: "Saídas detalhadas" },
  { id: "delinq", label: "Inadimplência", desc: "Títulos em atraso" },
  { id: "cashflow", label: "Fluxo de caixa", desc: "Entradas, saídas e saldo" },
];

export const SMART_FINANCIAL_INSIGHTS = [
  "Cliente Lucas possui pagamento vencido há 3 dias.",
  "Pacote de Rafael vence em 2 aulas.",
  "Kart 12 apresentou custo acima da média.",
  "Receita semanal abaixo do esperado.",
];

export const PAYMENT_CLIENT_OPTIONS = [
  { value: "c1", label: "Lucas Mendes" },
  { value: "c2", label: "Ana Ribeiro" },
  { value: "c3", label: "João Silva" },
  { value: "c4", label: "Marina Costa" },
];

export const PAYMENT_SERVICE_OPTIONS = [
  { value: "aula", label: "Aula avulsa" },
  { value: "pacote", label: "Pacote" },
  { value: "aluguel", label: "Aluguel de kart" },
  { value: "manutencao", label: "Manutenção" },
  { value: "evento", label: "Evento/campeonato" },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: "pix", label: "Pix" },
  { value: "cartao", label: "Cartão" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "transferencia", label: "Transferência" },
];

export const RECEIVABLE_STATUS_LABEL: Record<ReceivableStatus, string> = {
  pago: "Pago",
  pendente: "Pendente",
  vencido: "Vencido",
  parcial: "Parcial",
};

export const PACKAGE_STATUS_LABEL: Record<PackageCreditStatus, string> = {
  ativo: "Ativo",
  expirando: "Expirando",
  esgotado: "Esgotado",
};
