import { prisma } from "@/lib/server/prisma";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
const MONTH_SHORT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
] as const;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isOutbound(type: string): boolean {
  return type === "saida" || type === "perda";
}

function isInbound(type: string): boolean {
  return type === "entrada" || type === "devolucao";
}

export async function buildInventoryCharts() {
  const now = new Date();
  const weekStart = startOfDay(new Date(now.getTime() - 6 * 86400000));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const fiveMonthsStart = new Date(now.getFullYear(), now.getMonth() - 4, 1);

  const movements = await prisma.stockMovement.findMany({
    where: { createdAt: { gte: fiveMonthsStart } },
    include: { part: true },
    orderBy: { createdAt: "asc" },
  });

  const weeklyBuckets = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart.getTime() + i * 86400000);
    return {
      day: DAY_LABELS[d.getDay()],
      value: 0,
    };
  });

  for (const move of movements) {
    if (move.createdAt < weekStart || !isOutbound(move.type)) continue;
    const index = Math.floor(
      (startOfDay(move.createdAt).getTime() - weekStart.getTime()) / 86400000,
    );
    if (index >= 0 && index < 7) {
      weeklyBuckets[index]!.value += move.qty;
    }
  }

  const monthRanges: { label: string; start: Date; end: Date }[] = [];
  for (let i = 4; i >= 0; i -= 1) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
    monthRanges.push({
      label: MONTH_SHORT[start.getMonth()],
      start,
      end,
    });
  }

  const monthlyMovements = monthRanges.map((range) => {
    let entrada = 0;
    let saida = 0;
    for (const move of movements) {
      if (move.createdAt < range.start || move.createdAt > range.end) continue;
      if (isInbound(move.type)) entrada += move.qty;
      if (isOutbound(move.type)) saida += move.qty;
    }
    return { month: range.label, entrada, saida };
  });

  const categoryTotals = new Map<string, number>();
  const partTotals = new Map<string, { name: string; count: number }>();
  const costTotals = new Map<string, number>();

  for (const move of movements) {
    if (move.createdAt < monthStart || !isOutbound(move.type)) continue;
    const category = move.part.category;
    categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + move.qty);

    const partEntry = partTotals.get(move.part.id) ?? {
      name: move.part.name,
      count: 0,
    };
    partEntry.count += move.qty;
    partTotals.set(move.part.id, partEntry);

    const cost = (move.qty * move.part.unitCostCents) / 100;
    costTotals.set(category, (costTotals.get(category) ?? 0) + cost);
  }

  const consumptionByCategory = [...categoryTotals.entries()]
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);

  const topUsedParts = [...partTotals.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((row) => ({ name: row.name, count: row.count }));

  const costByCategory = [...costTotals.entries()]
    .map(([category, value]) => ({
      category,
      value: Math.round(value),
    }))
    .sort((a, b) => b.value - a.value);

  return {
    weeklyConsumption: weeklyBuckets,
    monthlyMovements,
    consumptionByCategory,
    topUsedParts,
    costByCategory,
  };
}

export type InventoryChartsDTO = Awaited<ReturnType<typeof buildInventoryCharts>>;
