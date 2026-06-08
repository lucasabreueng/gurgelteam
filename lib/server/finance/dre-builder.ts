import type { DrePeriodFilter } from "@/lib/admin-dre-mocks";
import type { DreDataset } from "@/lib/admin-dre-mocks";
import { formatBrl } from "@/lib/admin-cash-flow-mocks";
import { prisma } from "@/lib/server/prisma";

const MONTH_SHORT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
] as const;

function resolvePeriod(filter: DrePeriodFilter): {
  year: number;
  month?: number;
  label: string;
  prevLabel: string;
} {
  const ref = new Date();
  const year = ref.getFullYear();
  const month = ref.getMonth();

  switch (filter.key) {
    case "previous-month": {
      const d = new Date(year, month - 1, 1);
      const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        label: `${MONTH_SHORT[d.getMonth()]}/${String(d.getFullYear()).slice(-2)}`,
        prevLabel: `${MONTH_SHORT[prev.getMonth()]}/${String(prev.getFullYear()).slice(-2)}`,
      };
    }
    case "current-year":
      return {
        year,
        label: String(year),
        prevLabel: String(year - 1),
      };
    default: {
      const prev = new Date(year, month - 1, 1);
      return {
        year,
        month: month + 1,
        label: `${MONTH_SHORT[month]}/${String(year).slice(-2)}`,
        prevLabel: `${MONTH_SHORT[prev.getMonth()]}/${String(prev.getFullYear()).slice(-2)}`,
      };
    }
  }
}

export async function buildDreDataset(
  filter: DrePeriodFilter,
): Promise<DreDataset> {
  const period = resolvePeriod(filter);
  const where =
    period.month !== undefined
      ? { year: period.year, month: period.month }
      : { year: period.year };

  const entries = await prisma.dreEntry.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { accountCode: "asc" }],
  });

  const prevWhere =
    period.month !== undefined
      ? {
          year: period.month === 1 ? period.year - 1 : period.year,
          month: period.month === 1 ? 12 : period.month - 1,
        }
      : { year: period.year - 1 };

  const prevEntries = await prisma.dreEntry.findMany({ where: prevWhere });
  const prevByCode = new Map(
    prevEntries.map((e) => [e.accountCode, e.amountCents]),
  );

  const groups = new Map<string, typeof entries>();
  for (const entry of entries) {
    const list = groups.get(entry.groupKey) ?? [];
    list.push(entry);
    groups.set(entry.groupKey, list);
  }

  const structuredRows: DreDataset["structuredRows"] = [];
  let grossRevenue = 0;

  for (const [groupKey, rows] of groups) {
    structuredRows.push({
      id: `group-${groupKey}`,
      label: groupKey,
      kind: "group",
      collapsible: true,
      currentValue: 0,
      previousValue: 0,
      level: 0,
    });

    let groupTotal = 0;
    let groupPrev = 0;

    for (const row of rows) {
      const current = row.amountCents / 100;
      const previous = (prevByCode.get(row.accountCode) ?? 0) / 100;
      groupTotal += current;
      groupPrev += previous;

      if (row.rowKind === "total" && groupKey === "Receita") {
        grossRevenue = current;
      }

      structuredRows.push({
        id: row.id,
        label: row.accountName,
        kind: row.rowKind as "line" | "subtotal" | "total",
        parentId: `group-${groupKey}`,
        currentValue: current,
        previousValue: previous,
        level: row.rowKind === "line" ? 1 : 2,
      });
    }

    structuredRows.push({
      id: `subtotal-${groupKey}`,
      label: `Subtotal ${groupKey}`,
      kind: "subtotal",
      parentId: `group-${groupKey}`,
      currentValue: groupTotal,
      previousValue: groupPrev,
      level: 1,
    });
  }

  const revenueTotalCents = entries
    .filter((e) => e.groupKey === "Receita")
    .reduce((s, e) => s + e.amountCents, 0);
  const revenuePrevCents = entries
    .filter((e) => e.groupKey === "Receita")
    .reduce((s, e) => s + (prevByCode.get(e.accountCode) ?? 0), 0);

  const costsTotalCents = entries
    .filter((e) => e.groupKey.toLowerCase().includes("custo"))
    .reduce((s, e) => s + e.amountCents, 0);
  const costsPrevCents = entries
    .filter((e) => e.groupKey.toLowerCase().includes("custo"))
    .reduce((s, e) => s + (prevByCode.get(e.accountCode) ?? 0), 0);

  const expensesTotalCents = entries
    .filter((e) => e.groupKey.toLowerCase().includes("despesa"))
    .reduce((s, e) => s + e.amountCents, 0);
  const expensesPrevCents = entries
    .filter((e) => e.groupKey.toLowerCase().includes("despesa"))
    .reduce((s, e) => s + (prevByCode.get(e.accountCode) ?? 0), 0);

  const gross = revenueTotalCents / 100;
  const opCosts = costsTotalCents / 100;
  const opExpenses = expensesTotalCents / 100;
  const netProfit = gross - opCosts - opExpenses;
  const netMargin = gross > 0 ? (netProfit / gross) * 100 : 0;

  return {
    periodLabel: period.label,
    previousPeriodLabel: period.prevLabel,
    grossRevenue: grossRevenue || gross,
    viewMode: "comparative",
    summaryKpis: [
      {
        id: "gross-revenue",
        label: "Receita Bruta",
        value: formatBrl(gross),
        delta: period.label,
        deltaPositive: true,
      },
      {
        id: "op-costs",
        label: "Custos Operacionais",
        value: formatBrl(opCosts),
        delta: period.prevLabel,
        deltaPositive: opCosts <= costsPrevCents / 100,
      },
      {
        id: "op-expenses",
        label: "Despesas Operacionais",
        value: formatBrl(opExpenses),
        delta: period.prevLabel,
        deltaPositive: opExpenses <= expensesPrevCents / 100,
      },
      {
        id: "net-profit",
        label: "Lucro Líquido",
        value: formatBrl(netProfit),
        delta: period.label,
        deltaPositive: netProfit >= 0,
      },
      {
        id: "net-margin",
        label: "Margem Líquida",
        value: `${netMargin.toFixed(1).replace(".", ",")}%`,
        delta: period.label,
        deltaPositive: netMargin >= 0,
      },
    ],
    structuredRows,
    monthlyComparison: { labels: [], revenue: [], costs: [], netProfit: [] },
    margins: [],
    revenueCenters: [],
    costCenters: [],
  };
}
