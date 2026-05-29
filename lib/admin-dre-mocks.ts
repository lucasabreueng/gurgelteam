/** DRE gerencial — mocks Gurgel Team */

import {
  formatBrl,
  formatPercent,
  formatVariation,
} from "@/lib/admin-cash-flow-mocks";

export { formatBrl, formatPercent, formatVariation };

/** Valor monetário DRE sem sinal negativo (conta já indica natureza). */
export function formatDreBrlAbs(value: number): string {
  const formatted = Math.abs(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R$ ${formatted}`;
}

/** Rótulos de período DRE com mês em maiúsculas (ex.: MAI/26). */
export function formatDrePeriodLabel(label: string): string {
  return label.replace(
    /\b(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\b/gi,
    (match) => match.toUpperCase()
  );
}

/** Data de referência do mock (mês atual = maio/2026) */
export const DRE_REFERENCE_DATE = new Date(2026, 4, 28);

const MONTH_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const;

export type DrePeriodKey =
  | "current-month"
  | "previous-month"
  | "current-year"
  | "last-12-months"
  | "custom";

export type DrePeriodFilter = {
  key: DrePeriodKey;
  customStart?: string;
  customEnd?: string;
};

export const DRE_PERIOD_OPTIONS: { key: Exclude<DrePeriodKey, "custom">; label: string }[] =
  [
    { key: "current-month", label: "Mês" },
    { key: "previous-month", label: "Anterior" },
    { key: "current-year", label: "Ano atual" },
    { key: "last-12-months", label: "12 meses" },
  ];

export type DreTableViewMode = "comparative" | "monthly";

export type DreSummaryKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  tooltip?: string;
};

export type DreStructuredRowKind = "group" | "line" | "subtotal" | "total";

export type DreStructuredRow = {
  id: string;
  label: string;
  kind: DreStructuredRowKind;
  parentId?: string;
  collapsible?: boolean;
  currentValue: number;
  previousValue: number;
  level: number;
  monthlyValues?: number[];
};

export type DreMonthlyComparison = {
  labels: string[];
  revenue: number[];
  costs: number[];
  netProfit: number[];
};

export type DreMargin = {
  id: string;
  label: string;
  percent: number;
  description: string;
};

export type DreCenterItem = {
  name: string;
  amount: string;
  percent: number;
  variation: string;
  variationPositive: boolean;
};

export type DreAccountEntry = {
  id: string;
  date: string;
  dateIso: string;
  description: string;
  amount: number;
  reference?: string;
};

export type DreDataset = {
  periodLabel: string;
  previousPeriodLabel: string;
  grossRevenue: number;
  viewMode: DreTableViewMode;
  monthColumns?: string[];
  summaryKpis: DreSummaryKpi[];
  structuredRows: DreStructuredRow[];
  monthlyComparison: DreMonthlyComparison;
  margins: DreMargin[];
  revenueCenters: DreCenterItem[];
  costCenters: DreCenterItem[];
};

function formatMonthLabel(year: number, monthIndex: number): string {
  return `${MONTH_SHORT[monthIndex].toUpperCase()}/${String(year).slice(-2)}`;
}

function monthKey(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

const BASE_MONTH_VALUES: Record<string, number> = {
  "gross-revenue": 56800,
  "rev-lessons": 20400,
  "rev-rental": 9600,
  "rev-packages": 15800,
  "rev-products": 5340,
  "rev-other": 4660,
  taxes: -2840,
  "net-revenue": 53960,
  "op-costs": -20235,
  "cost-fuel": -5680,
  "cost-tires": -4850,
  "cost-maintenance": -4200,
  "cost-parts": -3650,
  "cost-track": -1855,
  "gross-profit": 33725,
  "op-expenses": -16450,
  "exp-admin": -4650,
  "exp-marketing": -2800,
  "exp-tech": -3200,
  "exp-bank": -1890,
  "exp-other": -3910,
  "operating-profit": 17275,
  "financial-result": 275,
  "fin-interest-in": 650,
  "fin-interest-out": -200,
  "fin-fees": -175,
  "net-profit": 17550,
};

/** Perfil sazonal dos últimos 12 meses (jun/25 → mai/26) */
const TWELVE_MONTH_PROFILE = [0.82, 0.84, 0.86, 0.88, 0.9, 0.92, 0.94, 0.95, 0.96, 0.98, 0.99, 1];

function getLast12Months(): { year: number; month: number; label: string; key: string }[] {
  const ref = DRE_REFERENCE_DATE;
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(ref.getFullYear(), ref.getMonth() - (11 - i), 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      label: formatMonthLabel(d.getFullYear(), d.getMonth()),
      key: monthKey(d.getFullYear(), d.getMonth()),
    };
  });
}

function scaleValues(values: Record<string, number>, factor: number): Record<string, number> {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, Math.round(value * factor)])
  );
}

function sumValues(valuesList: Record<string, number>[]): Record<string, number> {
  const keys = Object.keys(BASE_MONTH_VALUES);
  return Object.fromEntries(
    keys.map((key) => [
      key,
      valuesList.reduce((acc, values) => acc + (values[key] ?? 0), 0),
    ])
  );
}

function buildMonthlySeries(
  months: { year: number; month: number; label: string; profileIndex?: number }[]
): {
  columns: string[];
  byRow: Record<string, number[]>;
} {
  const columns = months.map((m) => m.label);
  const byRow: Record<string, number[]> = {};

  for (const key of Object.keys(BASE_MONTH_VALUES)) {
    byRow[key] = months.map((m, index) => {
      const profile =
        m.profileIndex !== undefined
          ? TWELVE_MONTH_PROFILE[m.profileIndex]
          : TWELVE_MONTH_PROFILE[index] ?? 1;
      return scaleValues(BASE_MONTH_VALUES, profile)[key];
    });
  }

  return { columns, byRow };
}

function buildStructuredRows(
  current: Record<string, number>,
  previous: Record<string, number>,
  monthlyByRow?: Record<string, number[]>
): DreStructuredRow[] {
  const defs: Omit<DreStructuredRow, "currentValue" | "previousValue">[] = [
    { id: "gross-revenue", label: "Receita Bruta", kind: "group", level: 0, collapsible: true },
    { id: "rev-lessons", label: "Aulas", kind: "line", level: 1, parentId: "gross-revenue" },
    { id: "rev-rental", label: "Aluguel de kart", kind: "line", level: 1, parentId: "gross-revenue" },
    { id: "rev-packages", label: "Pacotes", kind: "line", level: 1, parentId: "gross-revenue" },
    { id: "rev-products", label: "Produtos", kind: "line", level: 1, parentId: "gross-revenue" },
    { id: "rev-other", label: "Outros", kind: "line", level: 1, parentId: "gross-revenue" },
    { id: "taxes", label: "(-) Impostos e taxas", kind: "line", level: 0 },
    { id: "net-revenue", label: "Receita Líquida", kind: "subtotal", level: 0 },
    { id: "op-costs", label: "(-) Custos Operacionais", kind: "group", level: 0, collapsible: true },
    { id: "cost-fuel", label: "Combustível", kind: "line", level: 1, parentId: "op-costs" },
    { id: "cost-tires", label: "Pneus", kind: "line", level: 1, parentId: "op-costs" },
    { id: "cost-maintenance", label: "Manutenção dos karts", kind: "line", level: 1, parentId: "op-costs" },
    { id: "cost-parts", label: "Peças e componentes", kind: "line", level: 1, parentId: "op-costs" },
    { id: "cost-track", label: "Equipamentos de pista", kind: "line", level: 1, parentId: "op-costs" },
    { id: "gross-profit", label: "Lucro Bruto", kind: "subtotal", level: 0 },
    { id: "op-expenses", label: "(-) Despesas Operacionais", kind: "group", level: 0, collapsible: true },
    { id: "exp-admin", label: "Administrativo", kind: "line", level: 1, parentId: "op-expenses" },
    { id: "exp-marketing", label: "Marketing", kind: "line", level: 1, parentId: "op-expenses" },
    { id: "exp-tech", label: "Sistema/tecnologia", kind: "line", level: 1, parentId: "op-expenses" },
    { id: "exp-bank", label: "Taxas bancárias", kind: "line", level: 1, parentId: "op-expenses" },
    { id: "exp-other", label: "Outras despesas", kind: "line", level: 1, parentId: "op-expenses" },
    { id: "operating-profit", label: "Lucro Operacional", kind: "subtotal", level: 0 },
    { id: "financial-result", label: "Resultado Financeiro", kind: "group", level: 0, collapsible: true },
    { id: "fin-interest-in", label: "Juros recebidos", kind: "line", level: 1, parentId: "financial-result" },
    { id: "fin-interest-out", label: "Juros pagos", kind: "line", level: 1, parentId: "financial-result" },
    { id: "fin-fees", label: "Tarifas", kind: "line", level: 1, parentId: "financial-result" },
    { id: "net-profit", label: "Lucro Líquido", kind: "total", level: 0 },
  ];

  return defs.map((def) => ({
    ...def,
    currentValue: current[def.id] ?? 0,
    previousValue: previous[def.id] ?? 0,
    monthlyValues: monthlyByRow?.[def.id],
  }));
}

function buildSummaryKpis(
  gross: number,
  opCosts: number,
  opExpenses: number,
  netProfit: number,
  grossDelta: string,
  costsDelta: string,
  costsDeltaPositive: boolean,
  expensesDelta: string,
  expensesDeltaPositive: boolean,
  profitDelta: string,
  netMargin: number
): DreSummaryKpi[] {
  return [
    {
      id: "gross-revenue",
      label: "Receita Bruta",
      value: formatDreBrlAbs(gross),
      delta: grossDelta,
      deltaPositive: true,
    },
    {
      id: "op-costs",
      label: "Custos Operacionais",
      value: formatDreBrlAbs(opCosts),
      delta: costsDelta,
      deltaPositive: costsDeltaPositive,
    },
    {
      id: "op-expenses",
      label: "Despesas Operacionais",
      value: formatDreBrlAbs(opExpenses),
      delta: expensesDelta,
      deltaPositive: expensesDeltaPositive,
    },
    {
      id: "net-profit",
      label: "Lucro Líquido",
      value: formatDreBrlAbs(netProfit),
      delta: profitDelta,
      deltaPositive: netProfit >= 0,
    },
    {
      id: "net-margin",
      label: "Margem Líquida",
      value: `${netMargin.toFixed(1).replace(".", ",")}%`,
      delta: profitDelta,
      deltaPositive: netMargin >= 0,
    },
  ];
}

function buildCenters(
  items: { name: string; current: number; previous: number; base: number }[],
  lowerIsBetter = false
): DreCenterItem[] {
  return items.map((item) => {
    const variation = formatVariation(item.current, item.previous);
    const improved = lowerIsBetter
      ? Math.abs(item.current) <= Math.abs(item.previous)
      : item.current >= item.previous;
    return {
      name: item.name,
      amount: formatDreBrlAbs(item.current),
      percent: Number(((Math.abs(item.current) / item.base) * 100).toFixed(1)),
      variation,
      variationPositive: improved,
    };
  });
}

function buildMonthlyComparison(
  columns: string[],
  monthlyByRow: Record<string, number[]>
): DreMonthlyComparison {
  const gross = monthlyByRow["gross-revenue"] ?? [];
  const costs = gross.map((_, i) =>
    Math.abs(monthlyByRow["op-costs"]?.[i] ?? 0) +
    Math.abs(monthlyByRow["op-expenses"]?.[i] ?? 0)
  );
  const profit = monthlyByRow["net-profit"] ?? [];

  return {
    labels: columns,
    revenue: gross.map((v) => Number((v / 1000).toFixed(1))),
    costs: costs.map((v) => Number((v / 1000).toFixed(1))),
    netProfit: profit.map((v) => Number((v / 1000).toFixed(1))),
  };
}

function buildDatasetFromValues(params: {
  periodLabel: string;
  previousPeriodLabel: string;
  current: Record<string, number>;
  previous: Record<string, number>;
  viewMode: DreTableViewMode;
  monthColumns?: string[];
  monthlyByRow?: Record<string, number[]>;
  summaryDeltas: {
    gross: string;
    costs: string;
    costsPositive: boolean;
    expenses: string;
    expensesPositive: boolean;
    profit: string;
  };
}): DreDataset {
  const gross = params.current["gross-revenue"];
  const netRevenue = params.current["net-revenue"];
  const netProfit = params.current["net-profit"];
  const opCosts = Math.abs(params.current["op-costs"]);
  const opExpenses = Math.abs(params.current["op-expenses"]);
  const netMargin = netRevenue ? (netProfit / netRevenue) * 100 : 0;
  const grossProfit = params.current["gross-profit"];
  const operatingProfit = params.current["operating-profit"];

  const chartColumns =
    params.viewMode === "monthly" && params.monthColumns
      ? params.monthColumns
      : getLast12Months().map((m) => m.label);

  const chartMonthly =
    params.viewMode === "monthly" && params.monthlyByRow
      ? params.monthlyByRow
      : buildMonthlySeries(getLast12Months().map((m, i) => ({ ...m, profileIndex: i }))).byRow;

  return {
    periodLabel: params.periodLabel,
    previousPeriodLabel: params.previousPeriodLabel,
    grossRevenue: gross,
    viewMode: params.viewMode,
    monthColumns: params.monthColumns,
    summaryKpis: buildSummaryKpis(
      gross,
      opCosts,
      opExpenses,
      netProfit,
      params.summaryDeltas.gross,
      params.summaryDeltas.costs,
      params.summaryDeltas.costsPositive,
      params.summaryDeltas.expenses,
      params.summaryDeltas.expensesPositive,
      params.summaryDeltas.profit,
      netMargin
    ),
    structuredRows: buildStructuredRows(
      params.current,
      params.previous,
      params.monthlyByRow
    ),
    monthlyComparison: buildMonthlyComparison(chartColumns, chartMonthly),
    margins: [
      {
        id: "gross",
        label: "Margem Bruta",
        percent: netRevenue ? (grossProfit / netRevenue) * 100 : 0,
        description: "Lucro bruto ÷ receita líquida",
      },
      {
        id: "operating",
        label: "Margem Operacional",
        percent: netRevenue ? (operatingProfit / netRevenue) * 100 : 0,
        description: "Lucro operacional ÷ receita líquida",
      },
      {
        id: "net",
        label: "Margem Líquida",
        percent: netMargin,
        description: "Lucro líquido ÷ receita líquida",
      },
    ],
    revenueCenters: buildCenters([
      { name: "Aulas", current: params.current["rev-lessons"], previous: params.previous["rev-lessons"], base: gross },
      { name: "Aluguel de kart", current: params.current["rev-rental"], previous: params.previous["rev-rental"], base: gross },
      { name: "Pacotes", current: params.current["rev-packages"], previous: params.previous["rev-packages"], base: gross },
      { name: "Produtos", current: params.current["rev-products"], previous: params.previous["rev-products"], base: gross },
      { name: "Outros", current: params.current["rev-other"], previous: params.previous["rev-other"], base: gross },
    ]),
    costCenters: buildCenters(
      [
        { name: "Combustível", current: params.current["cost-fuel"], previous: params.previous["cost-fuel"], base: opCosts },
        { name: "Pneus", current: params.current["cost-tires"], previous: params.previous["cost-tires"], base: opCosts },
        { name: "Manutenção", current: params.current["cost-maintenance"], previous: params.previous["cost-maintenance"], base: opCosts },
        { name: "Peças", current: params.current["cost-parts"], previous: params.previous["cost-parts"], base: opCosts },
        { name: "Equipamentos", current: params.current["cost-track"], previous: params.previous["cost-track"], base: opCosts },
        {
          name: "Taxas",
          current: params.current["fin-fees"] + params.current["exp-bank"],
          previous: params.previous["fin-fees"] + params.previous["exp-bank"],
          base: opCosts + opExpenses,
        },
      ],
      true
    ),
  };
}

const DELTAS_DEFAULT = {
  gross: "↑ 9,0%",
  costs: "↑ 4,9%",
  costsPositive: false,
  expenses: "↑ 8,6%",
  expensesPositive: false,
  profit: "↑ 15,4%",
};

function buildCurrentMonthDataset(): DreDataset {
  const ref = DRE_REFERENCE_DATE;
  const prev = new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
  const current = { ...BASE_MONTH_VALUES };
  const previous = scaleValues(BASE_MONTH_VALUES, 0.917);

  return buildDatasetFromValues({
    periodLabel: formatMonthLabel(ref.getFullYear(), ref.getMonth()),
    previousPeriodLabel: formatMonthLabel(prev.getFullYear(), prev.getMonth()),
    current,
    previous,
    viewMode: "comparative",
    summaryDeltas: DELTAS_DEFAULT,
  });
}

function buildPreviousMonthDataset(): DreDataset {
  const ref = new Date(DRE_REFERENCE_DATE.getFullYear(), DRE_REFERENCE_DATE.getMonth() - 1, 1);
  const prev = new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
  const current = scaleValues(BASE_MONTH_VALUES, 0.917);
  const previous = scaleValues(BASE_MONTH_VALUES, 0.876);

  return buildDatasetFromValues({
    periodLabel: formatMonthLabel(ref.getFullYear(), ref.getMonth()),
    previousPeriodLabel: formatMonthLabel(prev.getFullYear(), prev.getMonth()),
    current,
    previous,
    viewMode: "comparative",
    summaryDeltas: {
      gross: "↑ 4,6%",
      costs: "↑ 2,1%",
      costsPositive: false,
      expenses: "↑ 3,4%",
      expensesPositive: false,
      profit: "↑ 10,2%",
    },
  });
}

function buildCurrentYearDataset(): DreDataset {
  const ref = DRE_REFERENCE_DATE;
  const year = ref.getFullYear();
  const months = Array.from({ length: ref.getMonth() + 1 }, (_, i) => ({
    year,
    month: i,
    label: formatMonthLabel(year, i),
    profileIndex: 6 + i,
  }));

  const { columns, byRow } = buildMonthlySeries(months);
  const monthlyValues = months.map((_, i) => scaleValues(BASE_MONTH_VALUES, TWELVE_MONTH_PROFILE[6 + i] ?? 1));
  const current = sumValues(monthlyValues);
  const previousYearMonths = months.map((m) => ({
    ...m,
    year: year - 1,
    label: formatMonthLabel(year - 1, m.month),
  }));
  const previous = sumValues(
    previousYearMonths.map((_, i) => scaleValues(BASE_MONTH_VALUES, (TWELVE_MONTH_PROFILE[6 + i] ?? 1) * 0.88))
  );

  return buildDatasetFromValues({
    periodLabel: `Jan–${formatMonthLabel(year, ref.getMonth()).split("/")[0]}/${String(year).slice(-2)}`,
    previousPeriodLabel: `Jan–${formatMonthLabel(year - 1, ref.getMonth()).split("/")[0]}/${String(year - 1).slice(-2)}`,
    current,
    previous,
    viewMode: "monthly",
    monthColumns: columns,
    monthlyByRow: byRow,
    summaryDeltas: {
      gross: "↑ 14,8%",
      costs: "↑ 11,2%",
      costsPositive: false,
      expenses: "↑ 9,5%",
      expensesPositive: false,
      profit: "↑ 23,1%",
    },
  });
}

function buildLast12MonthsDataset(): DreDataset {
  const last12 = getLast12Months();
  const { columns, byRow } = buildMonthlySeries(
    last12.map((m, i) => ({ ...m, profileIndex: i }))
  );
  const monthlyValues = last12.map((_, i) =>
    scaleValues(BASE_MONTH_VALUES, TWELVE_MONTH_PROFILE[i])
  );
  const current = sumValues(monthlyValues);
  const previous = sumValues(
    last12.map((_, i) => scaleValues(BASE_MONTH_VALUES, TWELVE_MONTH_PROFILE[i] * 0.86))
  );

  return buildDatasetFromValues({
    periodLabel: `${last12[0].label}–${last12[last12.length - 1].label}`,
    previousPeriodLabel: "Período anterior",
    current,
    previous,
    viewMode: "monthly",
    monthColumns: columns,
    monthlyByRow: byRow,
    summaryDeltas: {
      gross: "↑ 16,1%",
      costs: "↑ 12,4%",
      costsPositive: false,
      expenses: "↑ 10,8%",
      expensesPositive: false,
      profit: "↑ 32,7%",
    },
  });
}

function buildCustomDataset(startIso: string, endIso: string): DreDataset {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return buildCurrentMonthDataset();
  }

  const months: { year: number; month: number; label: string; profileIndex: number }[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
  let profileIndex = 0;

  while (cursor <= endMonth) {
    months.push({
      year: cursor.getFullYear(),
      month: cursor.getMonth(),
      label: formatMonthLabel(cursor.getFullYear(), cursor.getMonth()),
      profileIndex: profileIndex % TWELVE_MONTH_PROFILE.length,
    });
    cursor.setMonth(cursor.getMonth() + 1);
    profileIndex += 1;
  }

  if (months.length === 0) return buildCurrentMonthDataset();

  const useMonthly = months.length > 1;
  const { columns, byRow } = buildMonthlySeries(months);
  const monthlyValues = months.map((m) =>
    scaleValues(BASE_MONTH_VALUES, TWELVE_MONTH_PROFILE[m.profileIndex] ?? 1)
  );
  const current = useMonthly ? sumValues(monthlyValues) : monthlyValues[0];
  const previous = scaleValues(current, 0.9);

  const startLabel = formatMonthLabel(start.getFullYear(), start.getMonth());
  const endLabel = formatMonthLabel(end.getFullYear(), end.getMonth());

  return buildDatasetFromValues({
    periodLabel: startLabel === endLabel ? startLabel : `${startLabel}–${endLabel}`,
    previousPeriodLabel: "Período anterior",
    current,
    previous,
    viewMode: useMonthly ? "monthly" : "comparative",
    monthColumns: useMonthly ? columns : undefined,
    monthlyByRow: useMonthly ? byRow : undefined,
    summaryDeltas: DELTAS_DEFAULT,
  });
}

const ACCOUNT_ENTRY_TEMPLATES: Record<
  string,
  { descriptions: string[]; amountBase: number }[]
> = {
  "rev-lessons": [
    { descriptions: ["Aula avulsa — Lucas Mendes", "Aula avulsa — Ana Ribeiro", "Aula F400 — Rafael Duarte"], amountBase: 280 },
  ],
  "rev-rental": [
    { descriptions: ["Aluguel kart F400 — Marina Costa", "Aluguel kart 125cc — João Silva"], amountBase: 420 },
  ],
  "rev-packages": [
    { descriptions: ["Pacote 10 aulas — Lucas Mendes", "Pacote competidor — Marina Costa"], amountBase: 2200 },
  ],
  "rev-products": [
    { descriptions: ["Luvas homologadas", "Capacete reserva"], amountBase: 180 },
  ],
  "rev-other": [
    { descriptions: ["Taxa de evento corporativo", "Coaching avulso"], amountBase: 350 },
  ],
  "cost-fuel": [
    { descriptions: ["Combustível 2T — abastecimento pista", "Combustível treino sábado"], amountBase: 890 },
  ],
  "cost-tires": [
    { descriptions: ["Pneus slick MG — kart 07", "Pneus chuva — kart 12"], amountBase: 1200 },
  ],
  "cost-maintenance": [
    { descriptions: ["OS #1842 — Kart 12 freios", "OS #1838 — Kart 06 motor"], amountBase: 980 },
  ],
  "cost-parts": [
    { descriptions: ["Pastilhas Brembo", "Corrente e coroa"], amountBase: 640 },
  ],
  "cost-track": [
    { descriptions: ["Locação equipamento cronometragem", "Manutenção balizas"], amountBase: 420 },
  ],
  "exp-admin": [
    { descriptions: ["Folha administrativa", "Contabilidade mensal"], amountBase: 2100 },
  ],
  "exp-marketing": [
    { descriptions: ["Campanha Instagram", "Material gráfico"], amountBase: 680 },
  ],
  "exp-tech": [
    { descriptions: ["Assinatura sistema gestão", "Telemetria cloud"], amountBase: 890 },
  ],
  "exp-bank": [
    { descriptions: ["Tarifa Pix", "Tarifa cartão"], amountBase: 120 },
  ],
  "exp-other": [
    { descriptions: ["Despesas diversas paddock"], amountBase: 450 },
  ],
  taxes: [
    { descriptions: ["ISS sobre serviços", "Simples Nacional"], amountBase: 980 },
  ],
  "fin-interest-in": [
    { descriptions: ["Rendimento aplicação"], amountBase: 85 },
  ],
  "fin-interest-out": [
    { descriptions: ["Juros rotativo"], amountBase: 45 },
  ],
  "fin-fees": [
    { descriptions: ["Tarifa bancária"], amountBase: 35 },
  ],
};

function generateAccountEntries(accountId: string): DreAccountEntry[] {
  const templates = ACCOUNT_ENTRY_TEMPLATES[accountId];
  if (!templates) return [];

  const ref = DRE_REFERENCE_DATE;
  const entries: DreAccountEntry[] = [];
  let index = 0;

  for (const group of templates) {
    for (const description of group.descriptions) {
      const day = Math.max(1, 28 - index * 3);
      const month = ref.getMonth();
      const year = ref.getFullYear();
      const dateIso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isCost = accountId.startsWith("cost-") || accountId.startsWith("exp-") || ["taxes", "fin-interest-out", "fin-fees"].includes(accountId);
      entries.push({
        id: `${accountId}-${index}`,
        date: `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`,
        dateIso,
        description,
        amount: isCost ? -group.amountBase : group.amountBase,
        reference: `LAN-${1000 + index}`,
      });
      index += 1;
    }
  }

  return entries;
}

const ACCOUNT_ENTRIES_CACHE = Object.fromEntries(
  Object.keys({ ...BASE_MONTH_VALUES, ...ACCOUNT_ENTRY_TEMPLATES }).map((id) => [
    id,
    generateAccountEntries(id),
  ])
);

export function getDreDataset(filter: DrePeriodFilter): DreDataset {
  switch (filter.key) {
    case "current-month":
      return buildCurrentMonthDataset();
    case "previous-month":
      return buildPreviousMonthDataset();
    case "current-year":
      return buildCurrentYearDataset();
    case "last-12-months":
      return buildLast12MonthsDataset();
    case "custom":
      if (filter.customStart && filter.customEnd) {
        return buildCustomDataset(filter.customStart, filter.customEnd);
      }
      return buildCurrentMonthDataset();
    default:
      return buildCurrentMonthDataset();
  }
}

export function getDreAccountEntries(
  accountId: string,
  filter: DrePeriodFilter
): DreAccountEntry[] {
  const entries = ACCOUNT_ENTRIES_CACHE[accountId] ?? [];
  const dataset = getDreDataset(filter);

  if (filter.key === "custom" && filter.customStart && filter.customEnd) {
    return entries.filter(
      (e) => e.dateIso >= filter.customStart! && e.dateIso <= filter.customEnd!
    );
  }

  if (filter.key === "current-year") {
    const year = DRE_REFERENCE_DATE.getFullYear();
    return entries.filter((e) => e.dateIso.startsWith(`${year}-`));
  }

  if (filter.key === "last-12-months") {
    const start = getLast12Months()[0];
    return entries.filter((e) => e.dateIso >= `${start.key}-01`);
  }

  if (filter.key === "previous-month") {
    const d = new Date(DRE_REFERENCE_DATE.getFullYear(), DRE_REFERENCE_DATE.getMonth() - 1, 1);
    const prefix = monthKey(d.getFullYear(), d.getMonth());
    return entries.filter((e) => e.dateIso.startsWith(prefix));
  }

  const prefix = monthKey(DRE_REFERENCE_DATE.getFullYear(), DRE_REFERENCE_DATE.getMonth());
  return entries.filter((e) => e.dateIso.startsWith(prefix));
}

/** @deprecated Use getDreDataset(filter) */
export function getDreDatasetLegacy(period: Exclude<DrePeriodKey, "custom">): DreDataset {
  return getDreDataset({ key: period });
}
