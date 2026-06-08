import { prisma } from "@/lib/server/prisma";
import { formatCentsBrl } from "@/lib/server/format-money";
import type { BusinessEvolutionPeriod } from "@/lib/admin-financial-mocks";

const MONTH_SHORT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
] as const;

function buildMonthRanges(count: number, endDate = new Date()) {
  const months: { start: Date; end: Date; label: string }[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    months.push({
      start: d,
      end,
      label: MONTH_SHORT[d.getMonth()],
    });
  }
  return months;
}

function monthRevenue(
  payments: { amountCents: number; paidAt: Date }[],
  m: { start: Date; end: Date },
): number {
  return (
    payments
      .filter((p) => p.paidAt >= m.start && p.paidAt <= m.end)
      .reduce((s, p) => s + p.amountCents, 0) / 100
  );
}

function monthExits(
  payables: { amountCents: number; dueDate: Date; status: string }[],
  m: { start: Date; end: Date },
): number {
  return (
    payables
      .filter(
        (p) =>
          p.status === "pago" &&
          p.dueDate >= m.start &&
          p.dueDate <= m.end,
      )
      .reduce((s, p) => s + p.amountCents, 0) / 100
  );
}

function buildBusinessEvolution(
  payments: { amountCents: number; paidAt: Date }[],
  payables: { amountCents: number; dueDate: Date; status: string }[],
  period: BusinessEvolutionPeriod,
) {
  const count = period === "3m" ? 3 : period === "6m" ? 6 : 12;
  const months = buildMonthRanges(count);
  const revenue = months.map((m) => monthRevenue(payments, m));
  const exits = months.map((m) => monthExits(payables, m));
  const profit = revenue.map((r, i) => Math.max(0, Math.round((r - exits[i]!) * 10) / 10));
  const goal = revenue.map((r) => Math.round(r * 1.05 * 10) / 10);
  return {
    labels: months.map((m) => m.label),
    revenue,
    profit,
    goal,
  };
}

function buildFinancialEvolution(
  payments: { amountCents: number; paidAt: Date }[],
  payables: { amountCents: number; dueDate: Date; status: string }[],
) {
  const weeks: { start: Date; end: Date; label: string }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i -= 1) {
    const end = new Date(now.getTime() - i * 7 * 86400000);
    const start = new Date(end.getTime() - 6 * 86400000);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    weeks.push({
      start,
      end,
      label: `S${6 - i}`,
    });
  }

  const revenue = weeks.map((w) => {
    const cents = payments
      .filter((p) => p.paidAt >= w.start && p.paidAt <= w.end)
      .reduce((s, p) => s + p.amountCents, 0);
    return Math.round((cents / 100000) * 10) / 10;
  });

  const costs = weeks.map((w) => {
    const cents = payables
      .filter(
        (p) =>
          p.status === "pago" &&
          p.dueDate >= w.start &&
          p.dueDate <= w.end,
      )
      .reduce((s, p) => s + p.amountCents, 0);
    return Math.round((cents / 100000) * 10) / 10;
  });

  const margin = revenue.map((r, i) =>
    Math.max(0, Math.round((r - costs[i]!) * 10) / 10),
  );

  return {
    weeks: weeks.map((w) => w.label),
    revenue,
    costs,
    margin,
  };
}

export async function buildFinanceCharts() {
  const now = new Date();
  const months = buildMonthRanges(6, now);
  const rangeStart12 = buildMonthRanges(12, now)[0]!.start;
  const rangeStart = months[0]!.start;
  const currentMonth = months[months.length - 1]!;

  const [payments, receivables, payables, upcomingRows] = await Promise.all([
    prisma.payment.findMany({
      where: { paidAt: { gte: rangeStart12 } },
      select: { amountCents: true, paidAt: true, method: true },
    }),
    prisma.accountReceivable.findMany({
      where: { dueDate: { gte: rangeStart } },
      select: { amountCents: true, serviceLabel: true, status: true },
    }),
    prisma.accountPayable.findMany({
      where: { dueDate: { gte: rangeStart12 } },
      select: {
        id: true,
        amountCents: true,
        category: true,
        status: true,
        dueDate: true,
        supplierName: true,
      },
    }),
    prisma.accountPayable.findMany({
      where: { status: { in: ["pendente", "vencido"] } },
      orderBy: { dueDate: "asc" },
      take: 6,
      select: {
        id: true,
        amountCents: true,
        category: true,
        dueDate: true,
        supplierName: true,
      },
    }),
  ]);

  const revenue = months.map((m) => monthRevenue(payments, m));
  const entries = revenue;
  const exits = months.map((m) => monthExits(payables, m));

  const byService = new Map<string, number>();
  for (const r of receivables) {
    byService.set(r.serviceLabel, (byService.get(r.serviceLabel) ?? 0) + r.amountCents);
  }
  const revenueByService = [...byService.entries()]
    .map(([name, cents]) => ({ name, value: cents / 100 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const serviceTotalCents = [...byService.values()].reduce((s, v) => s + v, 0);
  const revenueOrigin = revenueByService.map((item) => {
    const cents = Math.round(item.value * 100);
    const percent =
      serviceTotalCents > 0
        ? Math.round((cents / serviceTotalCents) * 1000) / 10
        : 0;
    return {
      name: item.name,
      value: item.value,
      amount: formatCentsBrl(cents),
      percent,
    };
  });

  const monthPayments = payments.filter(
    (p) => p.paidAt >= currentMonth.start && p.paidAt <= currentMonth.end,
  );
  const methodTotals = new Map<string, number>();
  for (const p of monthPayments) {
    const label = p.method?.trim() || "Outros";
    methodTotals.set(label, (methodTotals.get(label) ?? 0) + p.amountCents);
  }
  const methodGrand = [...methodTotals.values()].reduce((s, v) => s + v, 0);
  const paymentMethods = [...methodTotals.entries()]
    .map(([name, cents]) => ({
      name,
      value:
        methodGrand > 0 ? Math.round((cents / methodGrand) * 1000) / 10 : 0,
      amount: formatCentsBrl(cents),
    }))
    .sort((a, b) => b.value - a.value);

  const delinquent = receivables
    .filter((r) => r.status === "vencido")
    .reduce((s, r) => s + r.amountCents, 0);

  const insights: string[] = [];
  if (delinquent > 0) {
    insights.push(
      `Inadimplência de ${formatCentsBrl(delinquent)} em títulos vencidos.`,
    );
  }
  if (revenue[revenue.length - 1]! > revenue[0]!) {
    insights.push("Receita dos últimos meses em tendência de alta.");
  }
  if (insights.length === 0) {
    insights.push("Fluxo financeiro estável no período.");
  }

  const upcomingPayables = upcomingRows.map((row) => ({
    id: row.id,
    description: row.supplierName,
    category: row.category,
    amount: formatCentsBrl(row.amountCents),
    dueDate: row.dueDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  }));

  return {
    monthlyRevenueChart: {
      months: months.map((m) => m.label),
      revenue,
      forecast: revenue.map((v) => Math.round(v * 1.05 * 10) / 10),
    },
    inOutChart: {
      months: months.map((m) => m.label),
      entries,
      exits,
    },
    financialEvolution: buildFinancialEvolution(payments, payables),
    revenueByService,
    revenueOrigin,
    paymentMethods,
    businessEvolution: {
      "3m": buildBusinessEvolution(payments, payables, "3m"),
      "6m": buildBusinessEvolution(payments, payables, "6m"),
      "12m": buildBusinessEvolution(payments, payables, "12m"),
    },
    upcomingPayables,
    smartInsights: insights,
    executiveAlerts: delinquent > 0
      ? [
          {
            id: "delinquency",
            severity: "warning" as const,
            title: "Inadimplência",
            message: formatCentsBrl(delinquent),
          },
        ]
      : [],
  };
}
