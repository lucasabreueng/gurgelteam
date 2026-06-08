import { format } from "date-fns";

import { prisma } from "@/lib/server/prisma";
import { financeRepository } from "@/lib/server/finance/finance-repository";
import { formatTimeHHmm } from "@/lib/server/format-money";

function todayIso(): string {
  return format(new Date(), "yyyy-MM-dd");
}

function dayBounds(date: string) {
  return {
    gte: new Date(`${date}T00:00:00.000-03:00`),
    lte: new Date(`${date}T23:59:59.999-03:00`),
  };
}

export const dashboardRepository = {
  async getSummary() {
    const today = todayIso();
    const bounds = dayBounds(today);

    const [todayEvents, activeClients, karts, financeStats] = await Promise.all([
      prisma.scheduleEvent.findMany({
        where: {
          startsAt: bounds,
          status: { notIn: ["cancelado"] },
        },
        include: {
          client: {
            select: {
              name: true,
              skillLevel: { select: { name: true } },
            },
          },
        },
        orderBy: { startsAt: "asc" },
        take: 12,
      }),
      prisma.client.count({ where: { status: "Ativo" } }),
      prisma.kart.findMany({
        select: {
          id: true,
          number: true,
          status: true,
          ownership: true,
          clientOwner: { select: { name: true } },
        },
        orderBy: { number: "asc" },
      }),
      financeRepository.getOverviewStats(),
    ]);

    const categoryIds = [
      ...new Set(todayEvents.map((e) => e.categoryId).filter(Boolean)),
    ] as string[];
    const categories = categoryIds.length
      ? await prisma.kartCategory.findMany({
          where: { id: { in: categoryIds } },
        })
      : [];
    const categoryById = new Map(categories.map((c) => [c.id, c.name]));

    const operationalAgenda = todayEvents.map((event) => ({
      id: event.id,
      startTime: formatTimeHHmm(event.startsAt),
      endTime: formatTimeHHmm(event.endsAt),
      pilotName: event.client?.name ?? "—",
      category: event.categoryId
        ? (categoryById.get(event.categoryId) ?? "—")
        : "—",
      level: event.client?.skillLevel.name ?? "—",
    }));

    const todayCount = todayEvents.length;
    const disponiveis = karts.filter((k) => k.status === "disponivel").length;

    const kpis = [
      {
        id: "aulas",
        label: "Aulas hoje",
        value: String(todayCount),
        delta: `Agenda ${today}`,
        deltaPositive: true,
        sparkline: [todayCount],
      },
      {
        id: "alunos",
        label: "Alunos ativos",
        value: String(activeClients),
        delta: "Cadastrados",
        deltaPositive: true,
        sparkline: [activeClients],
      },
      {
        id: "ocupacao",
        label: "Karts disponíveis",
        value: String(disponiveis),
        delta: `${karts.length} na frota`,
        deltaPositive: disponiveis > 0,
        sparkline: [disponiveis],
      },
      {
        id: "receita",
        label: "Receita do mês",
        value: financeStats.formatted.revenueMonth,
        delta: financeStats.monthLabel,
        deltaPositive: true,
        sparkline: [financeStats.revenueMonthCents / 100],
      },
    ];

    const kartFleet = karts.map((kart) => ({
      id: kart.id,
      number: kart.number,
      status: kart.status,
      ownership: kart.ownership,
      ownerName: kart.clientOwner?.name,
    }));

    return {
      kpis,
      operationalAgenda,
      kartFleet,
      financial: {
        receivableTotal: financeStats.formatted.receivableTotal,
        delinquentTotal: financeStats.formatted.delinquentTotal,
        revenueMonth: financeStats.formatted.revenueMonth,
      },
    };
  },
};
