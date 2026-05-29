"use client";

import { StudentDashboardServiceMock } from "@/services/student/studentDashboardServiceMock";
import type { NavItemKey } from "@/lib/contracts/student-area";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { StudentShell } from "./student-shell";
import { StudentDashboardHeader } from "./student-dashboard-header";
import {
  HiChartBar,
  HiClock,
  HiFlag,
  HiSparkles,
} from "react-icons/hi2";
import { AdminResponsiveKpis } from "@/components/admin/admin-responsive-kpis";
import { TimelineCard } from "./timeline-card";
import { InstructorFeedback } from "./instructor-feedback";
import { DevelopmentPlan } from "./development-plan";
import { AchievementsCard } from "./achievements-card";
import { ResultsCard } from "./results-card";
import { MaterialsCard } from "./materials-card";
import { EvolutionTimeChart } from "./evolution-time-chart";
import { EvolutionGoalCard } from "./evolution-goal-card";

const NAV_TO_SECTION: Partial<Record<NavItemKey, string>> = {
  dashboard: "section-dashboard",
  agenda: "section-agenda",
  evolucao: "section-evolucao",
  feedbacks: "section-feedbacks",
  plano: "section-plano",
  resultados: "section-resultados",
  materiais: "section-materiais",
  conquistas: "section-conquistas",
  ranking: "section-resultados",
};

const KPI_ICONS = {
  best: HiFlag,
  avg: HiClock,
  consistency: HiChartBar,
  evolution: HiSparkles,
} as const;

function scrollToSection(id: string) {
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

export function StudentDashboardPage() {
  const searchParams = useSearchParams();
  const sessionKind = StudentDashboardServiceMock.getStudentSessionKind(searchParams.get("demo"));
  const pilotViewOptions = useMemo(
    () => StudentDashboardServiceMock.getPilotViewOptions(sessionKind),
    [sessionKind]
  );

  const [activePilotViewId, setActivePilotViewId] = useState(() =>
    StudentDashboardServiceMock.getDefaultPilotViewId(sessionKind)
  );
  const [activeNav, setActiveNav] = useState<NavItemKey>("dashboard");

  useEffect(() => {
    setActivePilotViewId(StudentDashboardServiceMock.getDefaultPilotViewId(sessionKind));
  }, [sessionKind]);

  const viewData = useMemo(
    () => StudentDashboardServiceMock.getDashboardViewData(activePilotViewId),
    [activePilotViewId]
  );

  const headerFirstName = viewData.profile.firstName.split(" ")[0];
  const headerSubtitle = `Piloto desde ${viewData.profile.pilotSinceYear} · Nível ${viewData.heroLevel.title} · ${viewData.profile.tag}`;

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const key = Object.entries(NAV_TO_SECTION).find(([, id]) => id === hash)?.[0] as
      | NavItemKey
      | undefined;
    if (key) setActiveNav(key);
    scrollToSection(hash);
  }, []);

  const onNav = useCallback((key: NavItemKey | null) => {
    if (!key) return;
    setActiveNav(key);
    const id = NAV_TO_SECTION[key];
    if (id) scrollToSection(id);
  }, []);

  return (
    <StudentShell
      activeNav={activeNav}
      onNav={onNav}
      mobileTitle={`Olá, ${headerFirstName}`}
      pageHeader={
        <StudentDashboardHeader
          firstName={headerFirstName}
          subtitle={headerSubtitle}
          pilotViewOptions={
            pilotViewOptions.length > 0 ? pilotViewOptions : undefined
          }
          activePilotViewId={activePilotViewId}
          onPilotViewChange={setActivePilotViewId}
        />
      }
    >
      <section id="section-dashboard" className="scroll-mt-28" aria-hidden />

      <section
        id="section-evolucao"
        className="scroll-mt-28 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_2px_12px_rgba(13,31,60,0.06)] md:p-8"
      >
        <h2 className="text-xl font-bold text-[#0d1f3c] md:text-2xl">
          Sua evolução
        </h2>

        <div className="admin-page-stack mt-4">
          <AdminResponsiveKpis
            kpis={viewData.kpiMetrics}
            icons={KPI_ICONS}
            desktopClassName="admin-page-grid grid grid-cols-2 xl:grid-cols-4"
          />

          <div className="admin-page-grid grid lg:grid-cols-2">
            <div className="min-h-0 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-5 md:p-6">
              <EvolutionTimeChart data={viewData.evolutionLapSeries} />
            </div>
            <EvolutionGoalCard
              initial={{
                title: viewData.evolutionGoal.title,
                description: viewData.evolutionGoal.description,
                targetLap: viewData.evolutionGoal.targetLap,
                currentBest: viewData.evolutionGoal.currentBest,
                progressPercent: viewData.evolutionGoal.progressPercent,
              }}
              initialDeadlineIso={viewData.evolutionGoal.deadlineIso}
            />
          </div>
        </div>
      </section>

      <section className="admin-page-grid scroll-mt-28 grid lg:grid-cols-3 lg:items-stretch">
        <div id="section-agenda" className="scroll-mt-28 flex min-h-0">
          <TimelineCard
            className="w-full min-w-0"
            items={viewData.nextActivities}
          />
        </div>
        <div id="section-feedbacks" className="scroll-mt-28 flex min-h-0">
          <InstructorFeedback className="w-full min-w-0" {...viewData.feedback} />
        </div>
        <div id="section-plano" className="scroll-mt-28 flex min-h-0">
          <DevelopmentPlan className="w-full min-w-0" />
        </div>
      </section>

      <section className="admin-page-grid scroll-mt-28 grid lg:grid-cols-2 lg:items-stretch">
        <div id="section-conquistas" className="scroll-mt-28 flex min-h-0 min-w-0">
          <AchievementsCard className="w-full flex-1" />
        </div>
        <div id="section-resultados" className="scroll-mt-28 flex min-h-0 min-w-0">
          <ResultsCard className="w-full flex-1" />
        </div>
      </section>

      <section id="section-materiais" className="scroll-mt-28">
        <MaterialsCard />
      </section>

      <footer className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white px-6 py-8 shadow-[0_2px_12px_rgba(13,31,60,0.06)] md:px-8 md:py-9">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center">
          <Image
            src="/images/logo.svg"
            alt="Gurgel Team"
            width={160}
            height={44}
            className="h-9 w-auto"
          />
          <div className="flex gap-6 text-sm font-semibold text-neutral-600">
            <Link href="#" className="transition hover:text-accent">
              Instagram
            </Link>
            <Link href="#" className="transition hover:text-accent">
              YouTube
            </Link>
            <Link href="#" className="transition hover:text-accent">
              Facebook
            </Link>
          </div>
          <p className="text-center text-[12px] text-neutral-500 md:text-right">
            © 2026 Gurgel Team. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </StudentShell>
  );
}
