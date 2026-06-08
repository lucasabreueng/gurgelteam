import type { CashFlowDataset, CashFlowPeriodFilter } from "@/lib/admin-cash-flow-mocks";
import { formatBrl } from "@/lib/admin-cash-flow-mocks";
import { prisma } from "@/lib/server/prisma";
import { isoDateFromDbDate } from "@/lib/server/format-money";

function resolveDateRange(filter: CashFlowPeriodFilter): {
  from: Date;
  to: Date;
  label: string;
} {
  const now = new Date();
  const today = new Date(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T00:00:00.000-03:00`,
  );

  switch (filter.key) {
    case "today":
      return { from: today, to: today, label: "Hoje" };
    case "week": {
      const from = new Date(today);
      from.setDate(from.getDate() - 6);
      return { from, to: today, label: "Últimos 7 dias" };
    }
    case "last-3-months": {
      const from = new Date(today);
      from.setMonth(from.getMonth() - 3);
      return { from, to: today, label: "Últimos 3 meses" };
    }
    case "custom":
      if (filter.customStart && filter.customEnd) {
        return {
          from: new Date(`${filter.customStart}T00:00:00.000-03:00`),
          to: new Date(`${filter.customEnd}T23:59:59.999-03:00`),
          label: `${filter.customStart} — ${filter.customEnd}`,
        };
      }
      break;
    default:
      break;
  }

  const from = new Date(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01T00:00:00.000-03:00`,
  );
  return { from, to: today, label: "Mês atual" };
}

export async function buildCashFlowDataset(
  filter: CashFlowPeriodFilter,
): Promise<CashFlowDataset> {
  const range = resolveDateRange(filter);

  const entries = await prisma.cashFlowEntry.findMany({
    where: {
      entryDate: { gte: range.from, lte: range.to },
    },
    orderBy: [{ entryDate: "desc" }, { createdAt: "desc" }],
  });

  let totalIn = 0;
  let totalOut = 0;
  const byCategory = new Map<string, number>();
  const byOrigin = new Map<string, number>();

  const movements: CashFlowDataset["movements"] = [];
  let runningBalance = 0;

  for (const row of entries) {
    const amount = row.amountCents / 100;
    const isEntry = row.type === "entrada";
    if (isEntry) {
      totalIn += amount;
      byOrigin.set(row.category, (byOrigin.get(row.category) ?? 0) + amount);
    } else {
      totalOut += amount;
      byCategory.set(row.category, (byCategory.get(row.category) ?? 0) + amount);
    }
    runningBalance += isEntry ? amount : -amount;

    const dateIso = isoDateFromDbDate(row.entryDate);
    movements.push({
      id: row.id,
      date: new Date(dateIso).toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "short",
      }),
      dateIso,
      type: isEntry ? "entrada" : "saída",
      category: row.category,
      description: row.description,
      paymentMethod: "—",
      entry: isEntry ? formatBrl(amount) : "—",
      entryRaw: isEntry ? amount : 0,
      exit: isEntry ? "—" : formatBrl(amount),
      exitRaw: isEntry ? 0 : amount,
      balance: formatBrl(runningBalance),
      balanceRaw: runningBalance,
    });
  }

  const balance = totalIn - totalOut;
  const entryCount = movements.filter((m) => m.type === "entrada").length;
  const exitCount = movements.filter((m) => m.type === "saída").length;

  return {
    periodLabel: range.label,
    summaryKpis: [
      {
        id: "balance",
        label: "Saldo atual",
        value: formatBrl(balance),
        delta: range.label,
        deltaPositive: balance >= 0,
        tone: "accent",
      },
      {
        id: "entries",
        label: "Entradas do período",
        value: formatBrl(totalIn),
        delta: `${entryCount} mov.`,
        deltaPositive: true,
        tone: "positive",
      },
      {
        id: "exits",
        label: "Saídas do período",
        value: formatBrl(totalOut),
        delta: `${exitCount} mov.`,
        deltaPositive: totalOut === 0,
        tone: "negative",
      },
      {
        id: "result",
        label: "Resultado do período",
        value: formatBrl(balance),
        delta: balance >= 0 ? "Positivo" : "Negativo",
        deltaPositive: balance >= 0,
        tone: balance >= 0 ? "positive" : "negative",
      },
      {
        id: "projected",
        label: "Saldo projetado (30 dias)",
        value: formatBrl(balance),
        delta: "Projeção simplificada",
        deltaPositive: balance >= 0,
        tone: "neutral",
      },
    ],
    chartByGranularity: {
      daily: { labels: [], entries: [], exits: [], balance: [] },
      weekly: { labels: [], entries: [], exits: [], balance: [] },
      monthly: { labels: [], entries: [], exits: [], balance: [] },
    },
    projection: {
      expectedEntries: formatBrl(totalIn),
      expectedExits: formatBrl(totalOut),
      projectedBalance: formatBrl(balance),
      projectedBalanceRaw: balance,
      riskDays: [],
      negativeAlert: balance < 0,
      alertMessage: balance < 0 ? "Saldo negativo no período." : undefined,
    },
    entriesByOrigin: [...byOrigin.entries()].map(([label, amountRaw], i) => ({
      id: `origin-${i}`,
      label,
      amount: formatBrl(amountRaw),
      amountRaw,
      percent: totalIn > 0 ? Math.round((amountRaw / totalIn) * 100) : 0,
    })),
    exitsByCategory: [...byCategory.entries()].map(([label, amountRaw], i) => ({
      id: `cat-${i}`,
      label,
      amount: formatBrl(amountRaw),
      amountRaw,
      percent: totalOut > 0 ? Math.round((amountRaw / totalOut) * 100) : 0,
    })),
    movements,
    calendarDays: [],
    calendarMonthLabel: range.label,
    alerts: balance < 0
      ? [{
          id: "neg-balance",
          priority: "warning" as const,
          title: "Saldo negativo",
          description: "Saldo negativo no período selecionado.",
          icon: "warning",
        }]
      : [],
    movementCategories: [...new Set(entries.map((e) => e.category))],
    paymentMethods: ["Pix", "Cartão", "Boleto"],
  };
}
