/** Fluxo de Caixa operacional — mocks Gurgel Team */

/** Data de referência (mês atual = maio/2026) */
export const CASH_FLOW_REFERENCE_DATE = new Date(2026, 4, 28);

export type CashFlowPeriodKey =
  | "today"
  | "week"
  | "current-month"
  | "last-3-months"
  | "custom";

export type CashFlowPeriodFilter = {
  key: CashFlowPeriodKey;
  customStart?: string;
  customEnd?: string;
};

export const CASH_FLOW_PERIOD_OPTIONS: {
  key: Exclude<CashFlowPeriodKey, "custom">;
  label: string;
}[] = [
  { key: "today", label: "Hoje" },
  { key: "week", label: "Semana" },
  { key: "current-month", label: "Mês" },
  { key: "last-3-months", label: "3 meses" },
];

export type CashFlowChartGranularity = "daily" | "weekly" | "monthly";

export type CashFlowKpiTone = "neutral" | "positive" | "negative" | "accent";

export type CashFlowKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  tone: CashFlowKpiTone;
};

export type CashFlowChartData = {
  labels: string[];
  entries: number[];
  exits: number[];
  balance: number[];
};

export type CashFlowProjection = {
  expectedEntries: string;
  expectedExits: string;
  projectedBalance: string;
  projectedBalanceRaw: number;
  riskDays: { date: string; label: string; balance: string; balanceRaw: number }[];
  negativeAlert: boolean;
  alertMessage?: string;
};

export type CashFlowOriginItem = {
  id: string;
  label: string;
  amount: string;
  amountRaw: number;
  percent: number;
};

export type CashFlowCategoryItem = {
  id: string;
  label: string;
  amount: string;
  amountRaw: number;
  percent: number;
};

export type MovementType = "entrada" | "saída";

export type CashFlowStatementRow = {
  id: string;
  date: string;
  dateIso: string;
  description: string;
  category: string;
  type: MovementType;
  paymentMethod: string;
  entry: string;
  entryRaw: number;
  exit: string;
  exitRaw: number;
  balance: string;
  balanceRaw: number;
};

export type CashFlowCalendarDay = {
  day: number;
  dateIso: string;
  entries: string;
  entriesRaw: number;
  exits: string;
  exitsRaw: number;
  balance: string;
  balanceRaw: number;
  isToday?: boolean;
  isWeekend?: boolean;
};

export type CashFlowAlertPriority = "critical" | "warning" | "info";

export type CashFlowAlert = {
  id: string;
  priority: CashFlowAlertPriority;
  title: string;
  description: string;
  icon: string;
};

export type CashFlowDataset = {
  periodLabel: string;
  summaryKpis: CashFlowKpi[];
  chartByGranularity: Record<CashFlowChartGranularity, CashFlowChartData>;
  projection: CashFlowProjection;
  entriesByOrigin: CashFlowOriginItem[];
  exitsByCategory: CashFlowCategoryItem[];
  movements: CashFlowStatementRow[];
  calendarDays: CashFlowCalendarDay[];
  calendarMonthLabel: string;
  alerts: CashFlowAlert[];
  movementCategories: string[];
  paymentMethods: string[];
};

const PERIOD_SCALE: Record<Exclude<CashFlowPeriodKey, "custom">, number> = {
  today: 0.04,
  week: 0.22,
  "current-month": 1,
  "last-3-months": 2.85,
};

const BASE = {
  balance: 41300,
  entries: 56800,
  exits: 34250,
  result: 22550,
  projected30: 48600,
};

function scale(value: number, factor: number): number {
  return Math.round(value * factor);
}

export function formatBrl(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R$ ${formatted}`;
}

export function formatVariation(current: number, previous: number): string {
  if (previous === 0) return "—";
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

export function formatPercent(value: number, base: number): string {
  if (base === 0) return "—";
  return `${((value / base) * 100).toFixed(1)}%`;
}

function buildSummaryKpis(factor: number): CashFlowKpi[] {
  const balance = scale(BASE.balance, 1);
  const entries = scale(BASE.entries, factor);
  const exits = scale(BASE.exits, factor);
  const result = entries - exits;
  const projected = scale(BASE.projected30, 1);

  return [
    {
      id: "balance",
      label: "Saldo atual",
      value: formatBrl(balance),
      delta: "+12,3%",
      deltaPositive: true,
      tone: "accent",
    },
    {
      id: "entries",
      label: "Entradas do período",
      value: formatBrl(entries),
      delta: "+9,1%",
      deltaPositive: true,
      tone: "positive",
    },
    {
      id: "exits",
      label: "Saídas do período",
      value: formatBrl(exits),
      delta: "+5,8%",
      deltaPositive: false,
      tone: "negative",
    },
    {
      id: "result",
      label: "Resultado do período",
      value: formatBrl(result),
      delta: "+18,6%",
      deltaPositive: result >= 0,
      tone: "positive",
    },
    {
      id: "projected",
      label: "Saldo projetado (30 dias)",
      value: formatBrl(projected),
      delta: "+17,7%",
      deltaPositive: true,
      tone: "neutral",
    },
  ];
}

function buildChartData(factor: number): Record<CashFlowChartGranularity, CashFlowChartData> {
  const f = Math.max(factor, 0.15);
  return {
    daily: {
      labels: ["24", "25", "26", "27", "28", "29", "30"],
      entries: [2.1, 3.4, 1.8, 4.2, 5.6, 3.1, 2.8].map((v) => Number((v * f).toFixed(1))),
      exits: [1.2, 0.9, 2.1, 1.4, 1.8, 2.4, 1.1].map((v) => Number((v * f).toFixed(1))),
      balance: [38.2, 40.7, 40.4, 43.2, 47.0, 47.7, 41.3],
    },
    weekly: {
      labels: ["S1", "S2", "S3", "S4"],
      entries: [12.4, 14.8, 15.2, 14.4].map((v) => Number((v * f).toFixed(1))),
      exits: [7.2, 8.1, 9.4, 9.5].map((v) => Number((v * f).toFixed(1))),
      balance: [24.0, 28.5, 32.1, 41.3],
    },
    monthly: {
      labels: ["MAR", "ABR", "MAI"],
      entries: [48, 52, 56.8].map((v) => Number((v * f).toFixed(1))),
      exits: [30, 32.4, 34.25].map((v) => Number((v * f).toFixed(1))),
      balance: [30, 36, 41.3],
    },
  };
}

function buildProjection(): CashFlowProjection {
  const projectedBalanceRaw = 48600;
  const riskDays = [
    { date: "2026-06-08", label: "08/06", balance: "R$ 3.200,00", balanceRaw: 3200 },
    { date: "2026-06-15", label: "15/06", balance: "R$ 1.850,00", balanceRaw: 1850 },
    { date: "2026-06-22", label: "22/06", balance: "-R$ 420,00", balanceRaw: -420 },
  ];
  const negativeAlert = riskDays.some((d) => d.balanceRaw < 0);

  return {
    expectedEntries: formatBrl(62400),
    expectedExits: formatBrl(38200),
    projectedBalance: formatBrl(projectedBalanceRaw),
    projectedBalanceRaw,
    riskDays,
    negativeAlert,
    alertMessage: negativeAlert
      ? "Atenção: saldo projetado negativo em 22/06. Revise saídas previstas."
      : undefined,
  };
}

function buildEntriesByOrigin(factor: number): CashFlowOriginItem[] {
  const items = [
    { id: "lessons", label: "Aulas", raw: 20400 },
    { id: "rental", label: "Aluguel de kart", raw: 9600 },
    { id: "packages", label: "Pacotes", raw: 15800 },
    { id: "products", label: "Produtos", raw: 5340 },
    { id: "other", label: "Outros", raw: 4660 },
  ];
  const total = items.reduce((acc, i) => acc + i.raw, 0);
  return items.map((item) => {
    const amountRaw = scale(item.raw, factor);
    return {
      id: item.id,
      label: item.label,
      amount: formatBrl(amountRaw),
      amountRaw,
      percent: Number(((amountRaw / scale(total, factor)) * 100).toFixed(1)),
    };
  });
}

function buildExitsByCategory(factor: number): CashFlowCategoryItem[] {
  const items = [
    { id: "fuel", label: "Combustível", raw: 5680 },
    { id: "tires", label: "Pneus", raw: 4850 },
    { id: "maintenance", label: "Manutenção", raw: 4200 },
    { id: "parts", label: "Peças", raw: 3650 },
    { id: "equipment", label: "Equipamentos", raw: 1855 },
    { id: "marketing", label: "Marketing", raw: 2800 },
    { id: "admin", label: "Administrativo", raw: 4650 },
    { id: "fees", label: "Taxas", raw: 2465 },
  ];
  const total = items.reduce((acc, i) => acc + i.raw, 0);
  return items.map((item) => {
    const amountRaw = scale(item.raw, factor);
    return {
      id: item.id,
      label: item.label,
      amount: formatBrl(amountRaw),
      amountRaw,
      percent: Number(((amountRaw / scale(total, factor)) * 100).toFixed(1)),
    };
  });
}

const STATEMENT_TEMPLATE: Omit<
  CashFlowStatementRow,
  "entry" | "entryRaw" | "exit" | "exitRaw" | "balance" | "balanceRaw"
>[] = [
  {
    id: "s1",
    date: "28/05",
    dateIso: "2026-05-28",
    description: "Pacote Competidor — Marina Souza",
    category: "Pacotes",
    type: "entrada",
    paymentMethod: "Pix",
  },
  {
    id: "s2",
    date: "28/05",
    dateIso: "2026-05-28",
    description: "Aula avulsa F400 — Lucas Mendes",
    category: "Aulas",
    type: "entrada",
    paymentMethod: "Cartão",
  },
  {
    id: "s3",
    date: "27/05",
    dateIso: "2026-05-27",
    description: "Manutenção Kart 12 — motor",
    category: "Manutenção",
    type: "saída",
    paymentMethod: "Transferência",
  },
  {
    id: "s4",
    date: "27/05",
    dateIso: "2026-05-27",
    description: "Aluguel kart F400 — evento corporativo",
    category: "Aluguel de kart",
    type: "entrada",
    paymentMethod: "Pix",
  },
  {
    id: "s5",
    date: "26/05",
    dateIso: "2026-05-26",
    description: "Pneus slick — lote 4 un.",
    category: "Pneus",
    type: "saída",
    paymentMethod: "Boleto",
  },
  {
    id: "s6",
    date: "26/05",
    dateIso: "2026-05-26",
    description: "Luvas homologadas — venda balcão",
    category: "Produtos",
    type: "entrada",
    paymentMethod: "Dinheiro",
  },
  {
    id: "s7",
    date: "25/05",
    dateIso: "2026-05-25",
    description: "Combustível 2T — abastecimento pista",
    category: "Combustível",
    type: "saída",
    paymentMethod: "Dinheiro",
  },
  {
    id: "s8",
    date: "24/05",
    dateIso: "2026-05-24",
    description: "Aulas avulsas — lote sábado",
    category: "Aulas",
    type: "entrada",
    paymentMethod: "Cartão",
  },
  {
    id: "s9",
    date: "23/05",
    dateIso: "2026-05-23",
    description: "Campanha Instagram — impulsionamento",
    category: "Marketing",
    type: "saída",
    paymentMethod: "Cartão",
  },
  {
    id: "s10",
    date: "22/05",
    dateIso: "2026-05-22",
    description: "Taxas gateway pagamento",
    category: "Taxas",
    type: "saída",
    paymentMethod: "Débito automático",
  },
  {
    id: "s11",
    date: "21/05",
    dateIso: "2026-05-21",
    description: "Coaching avançado — turma maio",
    category: "Outros",
    type: "entrada",
    paymentMethod: "Pix",
  },
  {
    id: "s12",
    date: "20/05",
    dateIso: "2026-05-20",
    description: "Pastilhas Brembo — kart 07",
    category: "Peças",
    type: "saída",
    paymentMethod: "Transferência",
  },
];

const AMOUNT_BY_ID: Record<string, number> = {
  s1: 8400,
  s2: 280,
  s3: 2450,
  s4: 5600,
  s5: 1890,
  s6: 540,
  s7: 980,
  s8: 3280,
  s9: 680,
  s10: 420,
  s11: 2400,
  s12: 640,
};

function buildMovements(factor: number): CashFlowStatementRow[] {
  let running = scale(38750, 1);
  const rows = STATEMENT_TEMPLATE.map((row) => {
    const amount = scale(AMOUNT_BY_ID[row.id] ?? 0, Math.max(factor, 0.5));
    if (row.type === "entrada") running += amount;
    else running -= amount;

    return {
      ...row,
      entry: row.type === "entrada" ? formatBrl(amount) : "—",
      entryRaw: row.type === "entrada" ? amount : 0,
      exit: row.type === "saída" ? formatBrl(amount) : "—",
      exitRaw: row.type === "saída" ? amount : 0,
      balance: formatBrl(running),
      balanceRaw: running,
    };
  });

  return rows.reverse();
}

function buildCalendar(): { days: CashFlowCalendarDay[]; label: string } {
  const ref = CASH_FLOW_REFERENCE_DATE;
  const year = ref.getFullYear();
  const month = ref.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const label = `MAI/${String(year).slice(-2)}`;

  const profile = [
    1200, 800, 2100, 3400, 4250, 5100, 2800, 1900, 3600, 2200,
    1800, 4100, 2900, 5200, 3800, 2400, 1600, 3300, 2700, 4500,
    3100, 2200, 3900, 2600, 4800, 3500, 2100, 8400,
  ];

  let balance = 35200;
  const days: CashFlowCalendarDay[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dow = date.getDay();
    const entriesRaw = profile[day - 1] ?? 1500;
    const exitsRaw = Math.round(entriesRaw * 0.55);
    balance += entriesRaw - exitsRaw;

    days.push({
      day,
      dateIso: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      entries: formatBrl(entriesRaw),
      entriesRaw,
      exits: formatBrl(exitsRaw),
      exitsRaw,
      balance: formatBrl(balance),
      balanceRaw: balance,
      isToday: day === ref.getDate(),
      isWeekend: dow === 0 || dow === 6,
    });
  }

  return { days, label };
}

function buildAlerts(factor: number): CashFlowAlert[] {
  return [
    {
      id: "a1",
      priority: "critical",
      title: "Saldo projetado negativo",
      description: "Em 22/06 o saldo projetado cai para -R$ 420,00 com pagamentos de manutenção e pneus.",
      icon: "⚠️",
    },
    {
      id: "a2",
      priority: "warning",
      title: "Saídas acima da média",
      description: `Saídas da semana (${formatBrl(scale(9200, factor))}) estão 18% acima da média das últimas 4 semanas.`,
      icon: "📉",
    },
    {
      id: "a3",
      priority: "info",
      title: "Entradas abaixo do esperado",
      description: "Entradas de pacotes estão 12% abaixo da meta semanal. Considere ações comerciais.",
      icon: "📊",
    },
    {
      id: "a4",
      priority: "warning",
      title: "Alto gasto com manutenção",
      description: `Manutenção de karts representou ${formatBrl(scale(4200, factor))} no período (+24% vs. mês anterior).`,
      icon: "🔧",
    },
  ];
}

function periodLabelFor(key: CashFlowPeriodKey): string {
  const ref = CASH_FLOW_REFERENCE_DATE;
  switch (key) {
    case "today":
      return `${String(ref.getDate()).padStart(2, "0")}/MAI/${String(ref.getFullYear()).slice(-2)}`;
    case "week":
      return "Semana atual";
    case "current-month":
      return "MAI/26";
    case "last-3-months":
      return "MAR–MAI/26";
    case "custom":
      return "Período personalizado";
    default:
      return "MAI/26";
  }
}

export function getCashFlowDataset(filter: CashFlowPeriodFilter): CashFlowDataset {
  const factor =
    filter.key === "custom"
      ? 1.2
      : PERIOD_SCALE[filter.key as Exclude<CashFlowPeriodKey, "custom">] ?? 1;

  const calendar = buildCalendar();

  return {
    periodLabel: periodLabelFor(filter.key),
    summaryKpis: buildSummaryKpis(factor),
    chartByGranularity: buildChartData(factor),
    projection: buildProjection(),
    entriesByOrigin: buildEntriesByOrigin(factor),
    exitsByCategory: buildExitsByCategory(factor),
    movements: buildMovements(factor),
    calendarDays: calendar.days,
    calendarMonthLabel: calendar.label,
    alerts: buildAlerts(factor),
    movementCategories: [
      "Aulas",
      "Aluguel de kart",
      "Pacotes",
      "Produtos",
      "Combustível",
      "Pneus",
      "Manutenção",
      "Peças",
      "Equipamentos",
      "Marketing",
      "Administrativo",
      "Taxas",
      "Outros",
    ],
    paymentMethods: ["Pix", "Cartão", "Transferência", "Boleto", "Dinheiro", "Débito automático"],
  };
}

export function filterCashFlowMovements(
  movements: CashFlowStatementRow[],
  filters: {
    type?: MovementType | "";
    category?: string;
    paymentMethod?: string;
    search?: string;
  }
): CashFlowStatementRow[] {
  return movements.filter((row) => {
    if (filters.type && row.type !== filters.type) return false;
    if (filters.category && row.category !== filters.category) return false;
    if (filters.paymentMethod && row.paymentMethod !== filters.paymentMethod) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !row.description.toLowerCase().includes(q) &&
        !row.category.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });
}

/** @deprecated DRE removido do fluxo de caixa — use admin-dre-mocks */
export type DreRowKind = "section" | "subtotal" | "total" | "line";
/** @deprecated */
export type DreRow = {
  id: string;
  label: string;
  kind: DreRowKind;
  currentValue: number;
  previousValue: number;
  indent?: number;
};
