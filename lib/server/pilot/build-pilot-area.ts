import type { Achievement } from "@/lib/student-area-mocks";
import { ACHIEVEMENTS } from "@/lib/student-area-mocks";
import { formatLapMs } from "@/lib/server/format-lap";
import { prisma } from "@/lib/server/prisma";

export type PilotEvolutionApiDTO = {
  lapSeries: { sessionDate: string; seconds: number }[];
  goal: {
    title: string;
    description: string;
    targetLap: string;
    currentBest: string;
    deadlineLabel: string;
    deadlineIso: string;
    progressPercent: number;
  };
};

function unlockRules(client: {
  totalSessions: number;
  bestLapMs: number | null;
  consistencyPct: number | null;
}): Record<string, boolean> {
  const consistency = client.consistencyPct ?? 0;
  return {
    primeira_bandeirada: client.totalSessions >= 1,
    piloto_frequente: client.totalSessions >= 5,
    veterano_pista: client.totalSessions >= 25,
    sempre_presente: false,
    em_evolucao: client.totalSessions >= 3 && client.bestLapMs != null,
    ajuste_fino: false,
    aluno_aplicado: client.totalSessions >= 20,
    telemetria_na_veia: false,
    volta_rapida: client.bestLapMs != null,
    top_3: false,
    vitoria_pista: false,
    mestre_consistencia: consistency >= 90,
    ritmo_competidor: consistency >= 85,
    foco_total: client.totalSessions >= 12,
  };
}

export async function buildPilotEvolution(
  clientId: string,
): Promise<PilotEvolutionApiDTO | null> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      bestLapMs: true,
      consistencyPct: true,
      totalSessions: true,
    },
  });
  if (!client) return null;

  const sessions = await prisma.lessonSession.findMany({
    where: { clientId, status: "concluida" },
    include: { scheduleEvent: { select: { startsAt: true } } },
    orderBy: { createdAt: "asc" },
    take: 12,
  });

  const lapSeries = sessions.map((s) => {
    const payload = s.registrationPayload as { bestLapMs?: number } | null;
    const ms =
      typeof payload?.bestLapMs === "number"
        ? payload.bestLapMs
        : client.bestLapMs ?? 55000;
    return {
      sessionDate: s.scheduleEvent.startsAt.toISOString().slice(0, 10),
      seconds: ms / 1000,
    };
  });

  if (lapSeries.length === 0 && client.bestLapMs) {
    lapSeries.push({
      sessionDate: new Date().toISOString().slice(0, 10),
      seconds: client.bestLapMs / 1000,
    });
  }

  const currentBestSec = client.bestLapMs ? client.bestLapMs / 1000 : 55;
  const targetSec = Math.max(currentBestSec - 0.4, currentBestSec * 0.99);

  return {
    lapSeries,
    goal: {
      title: "Meta do trimestre",
      description: "Estabilizar melhor volta abaixo da meta em condições secas.",
      targetLap: targetSec.toFixed(3).replace(".", ","),
      currentBest: currentBestSec.toFixed(3).replace(".", ","),
      deadlineLabel: "até 30/06/2026",
      deadlineIso: "2026-06-30",
      progressPercent: client.consistencyPct ?? 0,
    },
  };
}

export async function buildPilotAchievements(
  clientId: string,
): Promise<Achievement[]> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      totalSessions: true,
      bestLapMs: true,
      consistencyPct: true,
    },
  });
  if (!client) return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false }));

  const rules = unlockRules(client);
  return ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: rules[a.id] ?? false,
  }));
}

export function formatPilotBestLap(ms: number | null): string {
  if (ms == null) return "—";
  return formatLapMs(ms);
}
