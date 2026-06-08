import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import type { LessonRegistrationPayloadApiDTO } from "@/lib/contracts/api/v1/lessons.api.schemas";
import type { DashboardViewData } from "@/lib/student-dashboard-view-mocks";
import type {
  DevTabKey,
  ResultRow,
  TimelineItem,
  VideoMaterial,
} from "@/lib/student-area-mocks";
import { DEVELOPMENT_BY_TAB, DEVELOPMENT_TABS } from "@/lib/student-area-mocks";
import { clientInclude } from "@/lib/server/clients/map-client";
import { formatLapMs } from "@/lib/server/format-lap";
import { prisma } from "@/lib/server/prisma";
import { buildPilotAchievements, buildPilotEvolution } from "@/lib/server/pilot/build-pilot-area";

const FEEDBACK_PHOTO = "/images/team-3.png";

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function formatEventDateLabel(date: Date): string {
  return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
}

function formatEventTimeRange(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    });
  return `${fmt(start)} - ${fmt(end)}`;
}

function parseLapSeconds(total: string): number | null {
  const normalized = total.replace(",", ".").replace(/s$/i, "").trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function buildResultsFromLessons(
  lessons: Array<{
    id: string;
    registrationPayload: unknown;
    scheduleEvent: { startsAt: Date; endsAt: Date };
  }>,
): ResultRow[] {
  return lessons
    .map((lesson) => {
      const payload = lesson.registrationPayload as LessonRegistrationPayloadApiDTO | null;
      if (!payload?.laps?.length) return null;

      const lapTimes = payload.laps
        .map((l) => parseLapSeconds(l.total))
        .filter((v): v is number => v != null);
      if (lapTimes.length === 0) return null;

      const best = Math.min(...lapTimes);
      const avg =
        lapTimes.reduce((a, b) => a + b, 0) / Math.max(lapTimes.length, 1);
      const durationMs =
        lesson.scheduleEvent.endsAt.getTime() -
        lesson.scheduleEvent.startsAt.getTime();
      const totalMin = Math.max(0, Math.round(durationMs / 60000));

      return {
        id: lesson.id,
        dateLabel: lesson.scheduleEvent.startsAt.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          timeZone: "America/Sao_Paulo",
        }),
        bestLap: best.toFixed(3).replace(".", ","),
        avgLap: avg.toFixed(3).replace(".", ","),
        totalTrackTime: `${totalMin} min`,
        laps: payload.laps.map((l) => ({
          lap: l.lap,
          time: l.total,
        })),
      } satisfies ResultRow;
    })
    .filter((r): r is ResultRow => r != null);
}

export type PilotHomeApiDTO = DashboardViewData & {
  avatarUrl: string | null;
  nextClass: { dateLabel: string; timeRange: string };
  results: ResultRow[];
  videoMaterials: VideoMaterial[];
  developmentTabs: typeof DEVELOPMENT_TABS;
  developmentByTab: typeof DEVELOPMENT_BY_TAB;
};

export async function buildPilotHome(
  clientId: string,
): Promise<PilotHomeApiDTO | null> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      ...clientInclude,
      packageCredits: {
        where: { status: "ativo" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  if (!client) return null;

  const now = new Date();
  const [nextEvent, upcomingEvents, completedLessons, evolution, achievements] =
    await Promise.all([
      prisma.scheduleEvent.findFirst({
        where: {
          clientId,
          startsAt: { gte: now },
          status: { notIn: ["cancelado"] },
        },
        orderBy: { startsAt: "asc" },
      }),
      prisma.scheduleEvent.findMany({
        where: {
          clientId,
          startsAt: { gte: now },
          status: { notIn: ["cancelado"] },
        },
        orderBy: { startsAt: "asc" },
        take: 5,
      }),
      prisma.lessonSession.findMany({
        where: { clientId, status: "concluida" },
        include: { scheduleEvent: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      buildPilotEvolution(clientId),
      buildPilotAchievements(clientId),
    ]);

  const latestLesson = completedLessons[0];
  const latestPayload = latestLesson?.registrationPayload as
    | LessonRegistrationPayloadApiDTO
    | null
    | undefined;

  const feedback = latestPayload?.notes
    ? {
        authorName: latestLesson?.registeredByName ?? "Gurgel Team",
        authorPhoto: FEEDBACK_PHOTO,
        dateLabel: latestLesson
          ? formatEventDateLabel(latestLesson.scheduleEvent.startsAt)
          : "—",
        commentary:
          latestPayload.notes.general?.trim() ||
          [latestPayload.notes.positives, latestPayload.notes.recommendations]
            .filter(Boolean)
            .join(" ") ||
          "Feedback registrado pela equipe.",
        strengths: latestPayload.notes.positives
          ? latestPayload.notes.positives
              .split(/[.;]\s+/)
              .map((s) => s.trim())
              .filter(Boolean)
              .slice(0, 4)
          : [],
        improve: latestPayload.notes.improvements
          ? latestPayload.notes.improvements
              .split(/[.;]\s+/)
              .map((s) => s.trim())
              .filter(Boolean)
              .slice(0, 4)
          : [],
      }
    : {
        authorName: "Gurgel Team",
        authorPhoto: FEEDBACK_PHOTO,
        dateLabel: "—",
        commentary:
          "Ainda não há feedback registrado. Após a próxima aula concluída, a equipe publicará os comentários aqui.",
        strengths: [] as string[],
        improve: [] as string[],
      };

  const pkg = client.packageCredits[0];
  const progressPercent = pkg
    ? Math.min(
        100,
        Math.round((pkg.lessonsUsed / Math.max(pkg.lessonsTotal, 1)) * 100),
      )
    : client.consistencyPct ?? 0;

  const nextActivities: TimelineItem[] = upcomingEvents.map((event) => ({
    id: event.id,
    title: event.type.replace(/_/g, " "),
    meta: `${format(event.startsAt, "d MMM", { locale: ptBR })} · ${formatEventTimeRange(event.startsAt, event.endsAt).split(" - ")[0]}`,
    location: "Gurgel Team Kart",
  }));

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const developmentByTab = {
    foco: {
      ...DEVELOPMENT_BY_TAB.foco,
      progressPercent: Math.min(100, Math.round((client.totalSessions / 20) * 100)),
      checklist: DEVELOPMENT_BY_TAB.foco.checklist.map((item, i) => ({
        ...item,
        done: client.totalSessions > i * 4,
      })),
    },
    proximos: {
      ...DEVELOPMENT_BY_TAB.proximos,
      progressPercent: Math.min(100, Math.round((client.totalSessions / 30) * 100)),
    },
    conquistas: {
      ...DEVELOPMENT_BY_TAB.conquistas,
      progressPercent: Math.min(
        100,
        Math.round((unlockedCount / Math.max(achievements.length, 1)) * 100),
      ),
      checklist: achievements.slice(0, 5).map((a) => ({
        id: a.id,
        label: a.label,
        done: a.unlocked,
      })),
    },
  } satisfies Record<DevTabKey, (typeof DEVELOPMENT_BY_TAB)[DevTabKey]>;

  const evolutionGoal = evolution?.goal ?? {
    title: "Meta do trimestre",
    description: "Complete treinos para definir sua meta.",
    targetLap: "—",
    currentBest: "—",
    deadlineLabel: "",
    deadlineIso: "2026-12-31",
    progressPercent: 0,
  };

  return {
    profile: {
      firstName: firstName(client.name),
      tag: client.skillLevel.name,
      pilotSinceYear: client.memberSince
        ? String(client.memberSince.getFullYear())
        : String(client.createdAt.getFullYear()),
    },
    avatarUrl: client.avatarUrl,
    heroLevel: {
      title: client.skillLevel.name,
      progressPercent,
      goalLabel: pkg
        ? `${pkg.lessonsUsed}/${pkg.lessonsTotal} aulas do pacote`
        : evolutionGoal.description,
    },
    nextClass: nextEvent
      ? {
          dateLabel: formatEventDateLabel(nextEvent.startsAt),
          timeRange: formatEventTimeRange(nextEvent.startsAt, nextEvent.endsAt),
        }
      : {
          dateLabel: "Nenhuma aula agendada",
          timeRange: "Consulte a agenda",
        },
    kpiMetrics: [
      {
        id: "best",
        label: "Melhor volta",
        value: client.bestLapMs ? formatLapMs(client.bestLapMs) : "—",
        sub: client.totalSessions > 0 ? `${client.totalSessions} sessões` : "",
        delta: null,
        deltaPositive: true,
      },
      {
        id: "avg",
        label: "Média de tempo",
        value: client.bestLapMs
          ? formatLapMs(Math.round(client.bestLapMs * 1.02))
          : "—",
        sub: "Estimativa recente",
        delta: null,
        deltaPositive: true,
      },
      {
        id: "consistency",
        label: "Consistência",
        value: client.consistencyPct != null ? `${client.consistencyPct}%` : "—",
        sub: "Índice da equipe",
        delta: null,
        deltaPositive: true,
      },
      {
        id: "evolution",
        label: "Evolução (30 dias)",
        value: `${client.totalSessions} treinos`,
        sub: "Sessões registradas",
        delta: null,
        deltaPositive: true,
      },
    ],
    evolutionLapSeries: evolution?.lapSeries ?? [],
    evolutionGoal,
    nextActivities,
    feedback,
    results: buildResultsFromLessons(completedLessons),
    videoMaterials: [],
    developmentTabs: [...DEVELOPMENT_TABS],
    developmentByTab,
  };
}
