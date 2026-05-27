/** Fluxo de Caixa — mocks (sem backend) */

export type CashFlowInnerTabKey =
  | "overview"
  | "detailed"
  | "dre"
  | "projection"
  | "movements";

export const CASH_FLOW_INNER_TABS: {
  key: CashFlowInnerTabKey;
  label: string;
}[] = [
  { key: "overview", label: "Visão geral" },
  { key: "detailed", label: "Detalhado" },
  { key: "dre", label: "DRE" },
  { key: "projection", label: "Projeção" },
  { key: "movements", label: "Movimentações" },
];

export type CashFlowKpiTone = "neutral" | "positive" | "negative" | "accent";

export type CashFlowKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  tone: CashFlowKpiTone;
  sparkline: number[];
};

export const CASH_FLOW_KPIS: CashFlowKpi[] = [
  {
    id: "opening",
    label: "Saldo inicial",
    value: "R$ 18.750,00",
    delta: "+2,4%",
    deltaPositive: true,
    tone: "neutral",
    sparkline: [16, 16.5, 17, 17.5, 18, 18.2, 18.75],
  },
  {
    id: "entries",
    label: "Entradas",
    value: "R$ 56.800,00",
    delta: "+9,1%",
    deltaPositive: true,
    tone: "positive",
    sparkline: [42, 45, 48, 50, 52, 54, 56.8],
  },
  {
    id: "exits",
    label: "Saídas",
    value: "R$ 34.250,00",
    delta: "+5,8%",
    deltaPositive: false,
    tone: "negative",
    sparkline: [28, 29, 30, 31, 32, 33, 34.25],
  },
  {
    id: "closing",
    label: "Saldo final",
    value: "R$ 41.300,00",
    delta: "+12,3%",
    deltaPositive: true,
    tone: "accent",
    sparkline: [30, 32, 34, 36, 38, 40, 41.3],
  },
  {
    id: "result",
    label: "Resultado do período",
    value: "R$ 22.550,00",
    delta: "+18,6%",
    deltaPositive: true,
    tone: "positive",
    sparkline: [12, 14, 15, 17, 18, 20, 22.55],
  },
];

export const PERIOD_SUMMARY = {
  entries: {
    operational: "R$ 52.400,00",
    other: "R$ 4.400,00",
    total: "R$ 56.800,00",
  },
  exits: {
    variable: "R$ 12.850,00",
    fixed: "R$ 9.600,00",
    operational: "R$ 11.800,00",
    total: "R$ 34.250,00",
  },
  result: "R$ 22.550,00",
};

export type ExpenseCategory = {
  id: string;
  label: string;
  value: number;
  amount: string;
  percent: number;
  impact: "Alto" | "Médio" | "Baixo";
};

export const EXPENSES_DISTRIBUTION: ExpenseCategory[] = [
  {
    id: "maintenance",
    label: "Manutenção",
    value: 8200,
    amount: "R$ 8.200",
    percent: 23.9,
    impact: "Alto",
  },
  {
    id: "parts",
    label: "Peças",
    value: 6450,
    amount: "R$ 6.450",
    percent: 18.8,
    impact: "Alto",
  },
  {
    id: "tires",
    label: "Pneus",
    value: 4200,
    amount: "R$ 4.200",
    percent: 12.3,
    impact: "Médio",
  },
  {
    id: "fuel",
    label: "Combustível",
    value: 3850,
    amount: "R$ 3.850",
    percent: 11.2,
    impact: "Médio",
  },
  {
    id: "external",
    label: "Serviços externos",
    value: 5100,
    amount: "R$ 5.100",
    percent: 14.9,
    impact: "Médio",
  },
  {
    id: "fees",
    label: "Taxas",
    value: 2450,
    amount: "R$ 2.450",
    percent: 7.2,
    impact: "Baixo",
  },
  {
    id: "structure",
    label: "Estrutura",
    value: 4000,
    amount: "R$ 4.000",
    percent: 11.7,
    impact: "Médio",
  },
];

export type DreRowKind = "section" | "subtotal" | "total" | "line";

export type DreRow = {
  id: string;
  label: string;
  kind: DreRowKind;
  currentValue: number;
  previousValue: number;
  indent?: number;
};

export const DRE_MONTHS = {
  current: "Jun/2025",
  previous: "Mai/2025",
};

/** Valores em reais (positivos = receita/lucro, negativos = deduções/despesas) */
export const DRE_ROWS: DreRow[] = [
  {
    id: "gross",
    label: "RECEITA BRUTA",
    kind: "section",
    currentValue: 56800,
    previousValue: 52100,
  },
  {
    id: "deductions",
    label: "(-) Deduções da receita",
    kind: "line",
    currentValue: -2840,
    previousValue: -2605,
    indent: 1,
  },
  {
    id: "net-revenue",
    label: "RECEITA LÍQUIDA",
    kind: "subtotal",
    currentValue: 53960,
    previousValue: 49495,
  },
  {
    id: "cogs",
    label: "(-) Custo dos serviços",
    kind: "line",
    currentValue: -20235,
    previousValue: -19280,
    indent: 1,
  },
  {
    id: "gross-profit",
    label: "LUCRO BRUTO",
    kind: "subtotal",
    currentValue: 33725,
    previousValue: 30215,
  },
  {
    id: "op-expenses",
    label: "(-) Despesas operacionais",
    kind: "line",
    currentValue: -11800,
    previousValue: -10950,
    indent: 1,
  },
  {
    id: "admin-expenses",
    label: "(-) Despesas administrativas",
    kind: "line",
    currentValue: -4650,
    previousValue: -4200,
    indent: 1,
  },
  {
    id: "operating-profit",
    label: "LUCRO OPERACIONAL",
    kind: "subtotal",
    currentValue: 17275,
    previousValue: 15065,
  },
  {
    id: "financial-expenses",
    label: "(-) Despesas financeiras",
    kind: "line",
    currentValue: -890,
    previousValue: -780,
    indent: 1,
  },
  {
    id: "other",
    label: "OUTRAS RECEITAS/DESPESAS",
    kind: "line",
    currentValue: 1165,
    previousValue: 920,
  },
  {
    id: "net-profit",
    label: "LUCRO LÍQUIDO",
    kind: "total",
    currentValue: 17550,
    previousValue: 15205,
  },
];

export type DailyCashEntry = {
  date: string;
  dateIso: string;
  balance: number;
  balanceLabel: string;
};

export const DAILY_CASH_PREVIEW: DailyCashEntry[] = [
  { date: "01/06", dateIso: "2025-06-01", balance: 18750, balanceLabel: "R$ 18.750" },
  { date: "02/06", dateIso: "2025-06-02", balance: 20900, balanceLabel: "R$ 20.900" },
  { date: "03/06", dateIso: "2025-06-03", balance: 19050, balanceLabel: "R$ 19.050" },
  { date: "04/06", dateIso: "2025-06-04", balance: 22150, balanceLabel: "R$ 22.150" },
  { date: "05/06", dateIso: "2025-06-05", balance: 26400, balanceLabel: "R$ 26.400" },
  { date: "06/06", dateIso: "2025-06-06", balance: 28850, balanceLabel: "R$ 28.850" },
];

export const DAILY_CASH_FULL: DailyCashEntry[] = [
  ...DAILY_CASH_PREVIEW.slice(0, 5),
  { date: "06/06", dateIso: "2025-06-06", balance: 28850, balanceLabel: "R$ 28.850" },
  { date: "07/06", dateIso: "2025-06-07", balance: 31200, balanceLabel: "R$ 31.200" },
  { date: "08/06", dateIso: "2025-06-08", balance: 29800, balanceLabel: "R$ 29.800" },
  { date: "09/06", dateIso: "2025-06-09", balance: 33450, balanceLabel: "R$ 33.450" },
  { date: "10/06", dateIso: "2025-06-10", balance: 35100, balanceLabel: "R$ 35.100" },
  { date: "11/06", dateIso: "2025-06-11", balance: 36800, balanceLabel: "R$ 36.800" },
  { date: "12/06", dateIso: "2025-06-12", balance: 38250, balanceLabel: "R$ 38.250" },
  { date: "13/06", dateIso: "2025-06-13", balance: 39500, balanceLabel: "R$ 39.500" },
  { date: "14/06", dateIso: "2025-06-14", balance: 40100, balanceLabel: "R$ 40.100" },
  { date: "15/06", dateIso: "2025-06-15", balance: 41300, balanceLabel: "R$ 41.300" },
];

export type FinancialIndicator = {
  id: string;
  label: string;
  value: string;
  tooltip: string;
};

export const CASH_FLOW_INDICATORS: FinancialIndicator[] = [
  {
    id: "gross-margin",
    label: "Margem bruta",
    value: "62,4%",
    tooltip: "Lucro bruto ÷ receita líquida no período",
  },
  {
    id: "operating-margin",
    label: "Margem operacional",
    value: "32,0%",
    tooltip: "Lucro operacional ÷ receita líquida",
  },
  {
    id: "net-margin",
    label: "Margem líquida",
    value: "32,5%",
    tooltip: "Lucro líquido ÷ receita líquida",
  },
  {
    id: "break-even",
    label: "Ponto de equilíbrio mensal",
    value: "R$ 28.400",
    tooltip: "Receita mínima para cobrir custos fixos e variáveis",
  },
  {
    id: "cash-turnover",
    label: "Giro de caixa",
    value: "1,8x",
    tooltip: "Entradas totais ÷ saldo médio do período",
  },
];

export const PERIOD_HIGHLIGHTS = {
  topEntry: { label: "Pacote Competidor", value: "R$ 8.400" },
  topExit: { label: "Manutenção Kart 12", value: "R$ 2.450" },
  bestDay: { label: "05/06", value: "R$ 4.250" },
  worstDay: { label: "03/06", value: "-R$ 1.850" },
  positiveDays: 22,
  negativeDays: 8,
};

export const CASH_FLOW_PROJECTION = {
  projectedBalance: "R$ 48.600",
  projectedEntries: "R$ 62.400",
  projectedExits: "R$ 38.200",
  receivables: "R$ 8.420",
  expectedCosts: "R$ 31.500",
  projectedResult: "R$ 24.200",
  months: ["Jul", "Ago", "Set"],
  balanceSeries: [41.3, 44.8, 48.6],
  entriesSeries: [56.8, 59.2, 62.4],
  exitsSeries: [34.2, 36.1, 38.2],
};

export type MovementType = "entrada" | "saída";
export type MovementStatus = "confirmado" | "pendente" | "previsto";

export type CashFlowMovement = {
  id: string;
  date: string;
  description: string;
  category: string;
  type: MovementType;
  amount: string;
  amountRaw: number;
  paymentMethod: string;
  status: MovementStatus;
};

export const CASH_FLOW_MOVEMENTS: CashFlowMovement[] = [
  {
    id: "m1",
    date: "15/06",
    description: "Pacote Competidor — Marina Souza",
    category: "Pacotes",
    type: "entrada",
    amount: "R$ 8.400,00",
    amountRaw: 8400,
    paymentMethod: "Pix",
    status: "confirmado",
  },
  {
    id: "m2",
    date: "14/06",
    description: "Manutenção Kart 12 — motor",
    category: "Manutenção",
    type: "saída",
    amount: "R$ 2.450,00",
    amountRaw: -2450,
    paymentMethod: "Transferência",
    status: "confirmado",
  },
  {
    id: "m3",
    date: "14/06",
    description: "Aulas avulsas — lote sábado",
    category: "Aulas",
    type: "entrada",
    amount: "R$ 3.280,00",
    amountRaw: 3280,
    paymentMethod: "Cartão",
    status: "confirmado",
  },
  {
    id: "m4",
    date: "13/06",
    description: "Pneus slick — lote 4 un.",
    category: "Pneus",
    type: "saída",
    amount: "R$ 1.890,00",
    amountRaw: -1890,
    paymentMethod: "Boleto",
    status: "pendente",
  },
  {
    id: "m5",
    date: "12/06",
    description: "Aluguel kart — evento corporativo",
    category: "Aluguel",
    type: "entrada",
    amount: "R$ 5.600,00",
    amountRaw: 5600,
    paymentMethod: "Pix",
    status: "confirmado",
  },
  {
    id: "m6",
    date: "11/06",
    description: "Combustível e lubrificantes",
    category: "Combustível",
    type: "saída",
    amount: "R$ 980,00",
    amountRaw: -980,
    paymentMethod: "Dinheiro",
    status: "confirmado",
  },
  {
    id: "m7",
    date: "10/06",
    description: "Mensalidade ilimitada — Lucas M.",
    category: "Pacotes",
    type: "entrada",
    amount: "R$ 1.850,00",
    amountRaw: 1850,
    paymentMethod: "Cartão",
    status: "confirmado",
  },
  {
    id: "m8",
    date: "09/06",
    description: "Taxas gateway pagamento",
    category: "Taxas",
    type: "saída",
    amount: "R$ 420,00",
    amountRaw: -420,
    paymentMethod: "Débito automático",
    status: "confirmado",
  },
  {
    id: "m9",
    date: "08/06",
    description: "Coaching avançado — turma junho",
    category: "Coaching",
    type: "entrada",
    amount: "R$ 2.400,00",
    amountRaw: 2400,
    paymentMethod: "Pix",
    status: "previsto",
  },
  {
    id: "m10",
    date: "07/06",
    description: "Energia e utilities paddock",
    category: "Estrutura",
    type: "saída",
    amount: "R$ 1.650,00",
    amountRaw: -1650,
    paymentMethod: "Boleto",
    status: "pendente",
  },
];

export type CashFlowPeriod = "daily" | "weekly" | "monthly";

export const CASH_FLOW_BY_PERIOD: Record<
  CashFlowPeriod,
  { labels: string[]; entries: number[]; exits: number[]; balance: number[] }
> = {
  daily: {
    labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"],
    entries: [4.2, 5.1, 2.8, 6.2, 7.4, 5.9, 4.1, 6.8, 5.5, 4.6],
    exits: [1.8, 2.1, 3.6, 2.4, 2.2, 3.1, 2.5, 2.8, 2.0, 2.4],
    balance: [18.75, 20.9, 19.05, 22.15, 26.4, 28.85, 30.2, 33.45, 35.1, 36.8],
  },
  weekly: {
    labels: ["S1", "S2", "S3", "S4"],
    entries: [12.4, 14.8, 15.2, 14.4],
    exits: [7.2, 8.1, 9.4, 9.55],
    balance: [24.0, 28.5, 32.1, 41.3],
  },
  monthly: {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    entries: [42, 45, 48, 50, 52, 56.8],
    exits: [28, 29, 30, 31, 32.4, 34.25],
    balance: [22, 26, 30, 33, 36, 41.3],
  },
};

/** Re-export gross revenue for DRE % calculations */
export const DRE_GROSS_REVENUE = 56800;

export function formatBrl(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prefix = value < 0 ? "-R$ " : "R$ ";
  return `${prefix}${formatted}`;
}

export function formatPercent(value: number, base: number): string {
  if (base === 0) return "—";
  return `${((value / base) * 100).toFixed(1)}%`;
}

export function formatVariation(current: number, previous: number): string {
  if (previous === 0) return "—";
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}
