import { prisma } from "@/lib/server/prisma";
import { formatCentsBrl } from "@/lib/server/format-money";
import type { PackageCreditStatus } from "@/lib/contracts/finance";
import type {
  ClientFinancial,
  CommercialRankingEntry,
  DelinquencyItem,
  ExpenseCategory,
  KartFinancial,
  PackageCredit,
  RevenueSource,
  RevenueSourceKey,
} from "@/lib/admin-financial-mocks";

const REVENUE_SOURCE_META: Record<
  string,
  { key: string; label: string }
> = {
  avulsas: { key: "avulsas", label: "Aulas avulsas" },
  pacotes: { key: "pacotes", label: "Pacotes" },
  aluguel: { key: "aluguel", label: "Aluguel de kart" },
  manutencao: { key: "manutencao", label: "Manutenção kart cliente" },
  eventos: { key: "eventos", label: "Eventos" },
  coaching: { key: "coaching", label: "Coaching/telemetria" },
  outros: { key: "outros", label: "Outros" },
};

function currentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );
  return { start, end, now };
}

function previousMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  return { start, end };
}

function formatPtDate(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysLateFrom(dueDate: Date, now: Date) {
  return Math.max(
    0,
    Math.floor((now.getTime() - dueDate.getTime()) / 86400000),
  );
}

function categorizeService(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("pacote")) return "pacotes";
  if (l.includes("avulsa") || l.includes("aula")) return "avulsas";
  if (l.includes("aluguel")) return "aluguel";
  if (l.includes("manuten")) return "manutencao";
  if (l.includes("evento")) return "eventos";
  if (l.includes("coach") || l.includes("telemetria")) return "coaching";
  return "outros";
}

function growthLabel(current: number, previous: number) {
  if (previous === 0) {
    return {
      growth: current > 0 ? "+100%" : "0%",
      growthPositive: current >= 0,
    };
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  return {
    growth: `${pct >= 0 ? "+" : ""}${pct}%`,
    growthPositive: pct >= 0,
  };
}

function expenseImpact(
  cents: number,
  total: number,
): ExpenseCategory["impact"] {
  if (total <= 0) return "baixo";
  const ratio = cents / total;
  if (ratio >= 0.25) return "alto";
  if (ratio >= 0.12) return "medio";
  return "baixo";
}

export async function buildFinanceInsights() {
  const { start: monthStart, end: monthEnd, now } = currentMonthRange();
  const prev = previousMonthRange();

  const [
    packageRows,
    delinquentReceivables,
    paymentsThisMonth,
    paymentsPrevMonth,
    allPayments,
    karts,
    partUses,
    maintenanceOrdersMonth,
    payablesMonth,
    payablesPrevMonth,
    eventCounts,
    clientRows,
  ] = await Promise.all([
    prisma.packageCredit.findMany({
      include: { client: { select: { name: true } } },
      orderBy: [{ status: "asc" }, { expiresAt: "asc" }],
    }),
    prisma.accountReceivable.findMany({
      where: { status: "vencido" },
      include: {
        client: { select: { id: true, name: true, phone: true } },
        payments: { orderBy: { paidAt: "desc" }, take: 1 },
      },
      orderBy: { dueDate: "asc" },
    }),
    prisma.payment.findMany({
      where: { paidAt: { gte: monthStart, lte: monthEnd } },
      include: {
        receivable: {
          select: {
            serviceLabel: true,
            clientId: true,
            scheduleEvent: { select: { kartId: true } },
          },
        },
      },
    }),
    prisma.payment.findMany({
      where: { paidAt: { gte: prev.start, lte: prev.end } },
      include: {
        receivable: { select: { serviceLabel: true, clientId: true } },
      },
    }),
    prisma.payment.findMany({
      include: {
        receivable: {
          select: {
            clientId: true,
            serviceLabel: true,
            client: { select: { name: true } },
          },
        },
      },
      orderBy: { paidAt: "desc" },
    }),
    prisma.kart.findMany({
      select: { id: true, number: true, engineHours: true },
      orderBy: { number: "asc" },
    }),
    prisma.maintenancePartUse.findMany({
      include: {
        part: { select: { unitCostCents: true } },
        order: { select: { kartId: true, detectedAt: true } },
      },
    }),
    prisma.maintenanceOrder.findMany({
      where: { detectedAt: { gte: monthStart, lte: monthEnd } },
      select: { kartId: true },
    }),
    prisma.accountPayable.findMany({
      where: { dueDate: { gte: monthStart, lte: monthEnd } },
      select: { category: true, amountCents: true },
    }),
    prisma.accountPayable.findMany({
      where: { dueDate: { gte: prev.start, lte: prev.end } },
      select: { category: true, amountCents: true },
    }),
    prisma.scheduleEvent.groupBy({
      by: ["kartId"],
      where: {
        kartId: { not: null },
        status: "finalizado",
        startsAt: { gte: monthStart, lte: monthEnd },
      },
      _count: { _all: true },
    }),
    prisma.client.findMany({
      select: {
        id: true,
        name: true,
        packageCredits: {
          orderBy: { expiresAt: "desc" },
        },
        accountsReceivable: {
          where: { status: { in: ["pendente", "vencido", "parcial"] } },
          select: { amountCents: true },
        },
      },
    }),
  ]);

  const packageCredits: PackageCredit[] = await Promise.all(
    packageRows.map(async (row) => {
      const paid = await prisma.payment.aggregate({
        where: {
          receivable: {
            clientId: row.clientId,
            serviceLabel: { contains: row.name.split(" ")[0]!, mode: "insensitive" },
          },
        },
        _sum: { amountCents: true },
      });
      return {
        id: row.id,
        clientId: row.clientId,
        clientName: row.client.name,
        packageName: row.name,
        lessonsTotal: row.lessonsTotal,
        lessonsUsed: row.lessonsUsed,
        validity: row.expiresAt ? formatPtDate(row.expiresAt) : "—",
        status: row.status as PackageCreditStatus,
        amountPaid: paid._sum.amountCents
          ? formatCentsBrl(paid._sum.amountCents)
          : "—",
      };
    }),
  );

  const delinquencyItems: DelinquencyItem[] = delinquentReceivables.map(
    (row) => {
      const due = new Date(row.dueDate);
      const lastPayment = row.payments[0];
      return {
        id: row.id,
        clientId: row.clientId,
        clientName: row.client.name,
        amount: formatCentsBrl(row.amountCents),
        daysLate: daysLateFrom(due, now),
        lastCharge: lastPayment
          ? `Último pag. — ${formatPtDate(lastPayment.paidAt)}`
          : `Venc. ${formatPtDate(due)}`,
        phone: row.client.phone ?? "",
      };
    },
  );

  const delinquencyTotalCents = delinquentReceivables.reduce(
    (sum, row) => sum + row.amountCents,
    0,
  );

  const clientRevenue = new Map<
    string,
    { name: string; cents: number; count: number }
  >();
  for (const payment of allPayments) {
    const clientId = payment.receivable.clientId;
    const current = clientRevenue.get(clientId) ?? {
      name: payment.receivable.client.name,
      cents: 0,
      count: 0,
    };
    current.cents += payment.amountCents;
    current.count += 1;
    clientRevenue.set(clientId, current);
  }

  const commercialRanking: CommercialRankingEntry[] = [...clientRevenue.values()]
    .sort((a, b) => b.cents - a.cents)
    .slice(0, 5)
    .map((row, index) => ({
      rank: index + 1,
      clientName: row.name,
      revenue: formatCentsBrl(row.cents),
      lessonsCount: row.count,
      ticketAvg: formatCentsBrl(
        row.count > 0 ? Math.round(row.cents / row.count) : 0,
      ),
    }));

  const revenueThisMonth = new Map<string, { cents: number; count: number }>();
  const revenuePrevMonth = new Map<string, number>();

  for (const payment of paymentsThisMonth) {
    const key = categorizeService(payment.receivable.serviceLabel);
    const current = revenueThisMonth.get(key) ?? { cents: 0, count: 0 };
    current.cents += payment.amountCents;
    current.count += 1;
    revenueThisMonth.set(key, current);
  }

  for (const payment of paymentsPrevMonth) {
    const key = categorizeService(payment.receivable.serviceLabel);
    revenuePrevMonth.set(key, (revenuePrevMonth.get(key) ?? 0) + payment.amountCents);
  }

  const revenueSources: RevenueSource[] = [...revenueThisMonth.entries()]
    .sort((a, b) => b[1].cents - a[1].cents)
    .map(([key, stats]) => {
      const meta = REVENUE_SOURCE_META[key] ?? REVENUE_SOURCE_META.outros!;
      const growth = growthLabel(stats.cents, revenuePrevMonth.get(key) ?? 0);
      return {
        key: meta.key as RevenueSourceKey,
        label: meta.label,
        revenue: formatCentsBrl(stats.cents),
        growth: growth.growth,
        growthPositive: growth.growthPositive,
        salesCount: stats.count,
      };
    });

  const expenseThisMonth = new Map<string, number>();
  const expensePrevMonth = new Map<string, number>();

  for (const row of payablesMonth) {
    expenseThisMonth.set(
      row.category,
      (expenseThisMonth.get(row.category) ?? 0) + row.amountCents,
    );
  }
  for (const row of payablesPrevMonth) {
    expensePrevMonth.set(
      row.category,
      (expensePrevMonth.get(row.category) ?? 0) + row.amountCents,
    );
  }

  const expenseTotal = [...expenseThisMonth.values()].reduce(
    (sum, cents) => sum + cents,
    0,
  );

  const expenseCategories: ExpenseCategory[] = [...expenseThisMonth.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category, cents]) => {
      const trend = growthLabel(cents, expensePrevMonth.get(category) ?? 0);
      return {
        id: category.toLowerCase().replace(/\s+/g, "-"),
        label: category,
        monthlyCost: formatCentsBrl(cents),
        trend: trend.growth,
        trendPositive: !trend.growthPositive,
        impact: expenseImpact(cents, expenseTotal),
      };
    });

  const revenueByKart = new Map<string, number>();
  for (const payment of paymentsThisMonth) {
    const kartId = payment.receivable.scheduleEvent?.kartId;
    if (!kartId) continue;
    revenueByKart.set(
      kartId,
      (revenueByKart.get(kartId) ?? 0) + payment.amountCents,
    );
  }

  const partsByKart = new Map<string, number>();
  for (const use of partUses) {
    if (
      use.order.detectedAt < monthStart ||
      use.order.detectedAt > monthEnd
    ) {
      continue;
    }
    const cost = use.qty * use.part.unitCostCents;
    partsByKart.set(use.order.kartId, (partsByKart.get(use.order.kartId) ?? 0) + cost);
  }

  const ordersByKart = new Map<string, number>();
  for (const order of maintenanceOrdersMonth) {
    ordersByKart.set(
      order.kartId,
      (ordersByKart.get(order.kartId) ?? 0) + 1,
    );
  }

  const eventsByKart = new Map<string, number>();
  for (const group of eventCounts) {
    if (group.kartId) {
      eventsByKart.set(group.kartId, group._count._all);
    }
  }

  const kartFinancials: KartFinancial[] = karts.map((kart) => {
    const revenueCents = revenueByKart.get(kart.id) ?? 0;
    const partsCents = partsByKart.get(kart.id) ?? 0;
    const orderCount = ordersByKart.get(kart.id) ?? 0;
    const maintenanceCents = partsCents + orderCount * 35_000;
    const profitCents = revenueCents - maintenanceCents - partsCents;
    const usageHours =
      eventsByKart.get(kart.id) ??
      Math.round(Number(kart.engineHours ?? 0) * 10) / 10;
    const totalCostCents = maintenanceCents + partsCents;
    const costPerHourCents =
      usageHours > 0 ? Math.round(totalCostCents / usageHours) : 0;
    const marginPct =
      revenueCents > 0
        ? Math.round((profitCents / revenueCents) * 100)
        : profitCents >= 0
          ? 0
          : -100;

    return {
      kartId: kart.id,
      number: kart.number,
      revenue: formatCentsBrl(revenueCents),
      maintenanceCost: formatCentsBrl(maintenanceCents),
      partsCost: formatCentsBrl(partsCents),
      estimatedProfit: formatCentsBrl(profitCents),
      usageHours: Math.round(usageHours * 10) / 10,
      costPerHour: formatCentsBrl(costPerHourCents),
      operationalMargin: `${marginPct}%`,
      profitPositive: profitCents >= 0,
    };
  });

  const paymentsByClient = new Map<string, typeof allPayments>();
  for (const payment of allPayments) {
    const clientId = payment.receivable.clientId;
    const list = paymentsByClient.get(clientId) ?? [];
    list.push(payment);
    paymentsByClient.set(clientId, list);
  }

  const clientFinancials: ClientFinancial[] = clientRows
    .map((client) => {
      const payments = paymentsByClient.get(client.id) ?? [];
      const totalCents = payments.reduce((sum, p) => sum + p.amountCents, 0);
      const pendingCents = client.accountsReceivable.reduce(
        (sum, row) => sum + row.amountCents,
        0,
      );
      const activeCredit = client.packageCredits.find(
        (credit) => credit.status === "ativo" || credit.status === "expirando",
      );
      const lessonsLeft = client.packageCredits.reduce(
        (sum, credit) =>
          sum + Math.max(0, credit.lessonsTotal - credit.lessonsUsed),
        0,
      );

      return {
        id: client.id,
        name: client.name,
        totalSpent: formatCentsBrl(totalCents),
        currentPlan: activeCredit?.name ?? "—",
        paymentsCount: payments.length,
        pending: pendingCents > 0 ? formatCentsBrl(pendingCents) : "—",
        lessonsLeft,
        ticketAvg: formatCentsBrl(
          payments.length > 0 ? Math.round(totalCents / payments.length) : 0,
        ),
        paymentHistory: payments.slice(0, 3).map(
          (payment) =>
            `${formatPtDate(payment.paidAt)} — ${formatCentsBrl(payment.amountCents)}`,
        ),
        _totalCents: totalCents,
      };
    })
    .filter((client) => client._totalCents > 0 || client.pending !== "—")
    .sort((a, b) => b._totalCents - a._totalCents)
    .slice(0, 12)
    .map(({ _totalCents, ...client }) => {
      void _totalCents;
      return client as ClientFinancial;
    });

  return {
    packageCredits,
    delinquencyItems,
    delinquencyTotal: formatCentsBrl(delinquencyTotalCents),
    commercialRanking,
    kartFinancials,
    clientFinancials,
    revenueSources,
    expenseCategories,
  };
}

export type FinanceInsightsPayload = Awaited<
  ReturnType<typeof buildFinanceInsights>
>;
