import type { EvolutionRankingEntry } from "@/lib/admin-clients-mocks";
import { formatLapMs } from "@/lib/server/format-lap";
import { prisma } from "@/lib/server/prisma";

const TOP = 3;

type ClientRow = {
  id: string;
  name: string;
  avatarUrl: string | null;
  bestLapMs: number | null;
  consistencyPct: number | null;
  totalSessions: number;
};

function mapEntry(
  client: ClientRow,
  rank: number,
  metric: string,
  value: string,
): EvolutionRankingEntry {
  return {
    id: client.id,
    name: client.name,
    avatar: client.avatarUrl ?? "",
    metric,
    value,
    rank,
  };
}

function topN<T>(rows: T[], n: number): T[] {
  return rows.slice(0, n);
}

export async function buildClientEvolutionRankings(): Promise<{
  evolution: EvolutionRankingEntry[];
  training: EvolutionRankingEntry[];
  laps: EvolutionRankingEntry[];
  consistency: EvolutionRankingEntry[];
}> {
  const clients = await prisma.client.findMany({
    where: { status: "Ativo" },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      bestLapMs: true,
      consistencyPct: true,
      totalSessions: true,
    },
  });

  const since30d = new Date();
  since30d.setDate(since30d.getDate() - 30);

  const lessonCounts = await prisma.lessonSession.groupBy({
    by: ["clientId"],
    where: {
      clientId: { not: null },
      status: "concluida",
      createdAt: { gte: since30d },
    },
    _count: { id: true },
  });

  const lessonsByClient = new Map(
    lessonCounts
      .filter((r) => r.clientId)
      .map((r) => [r.clientId!, r._count.id]),
  );

  const evolutionSorted = [...clients]
    .filter((c) => c.totalSessions > 0)
    .sort((a, b) => b.totalSessions - a.totalSessions);

  const trainingSorted = [...clients]
    .map((c) => ({ client: c, count: lessonsByClient.get(c.id) ?? 0 }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const lapsSorted = [...clients]
    .filter((c) => c.bestLapMs != null)
    .sort((a, b) => (a.bestLapMs ?? 0) - (b.bestLapMs ?? 0));

  const consistencySorted = [...clients]
    .filter((c) => c.consistencyPct != null)
    .sort((a, b) => (b.consistencyPct ?? 0) - (a.consistencyPct ?? 0));

  return {
    evolution: topN(evolutionSorted, TOP).map((c, i) =>
      mapEntry(c, i + 1, "Evolução", `${c.totalSessions} treinos`),
    ),
    training: topN(trainingSorted, TOP).map((r, i) =>
      mapEntry(r.client, i + 1, "Treinos", `${r.count} sessões`),
    ),
    laps: topN(lapsSorted, TOP).map((c, i) =>
      mapEntry(
        c,
        i + 1,
        "Melhor volta",
        formatLapMs(c.bestLapMs!),
      ),
    ),
    consistency: topN(consistencySorted, TOP).map((c, i) =>
      mapEntry(c, i + 1, "Consistência", `${c.consistencyPct}%`),
    ),
  };
}
