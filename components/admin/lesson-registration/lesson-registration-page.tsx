"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getRuntimeClientById } from "@/lib/clients-runtime-store";
import { queryKeys } from "@/lib/query/keys";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type {
  LessonRegistrationStatusFilterDTO,
} from "@/lib/contracts/lessons/lesson.types";
import { getAppServices } from "@/lib/data-source/app-services";
import { useLessonDefaultDate, useLessonSessionsAll } from "@/lib/query/hooks/use-lessons";
import { useModuleAccess } from "@/lib/query/hooks/use-module-access";
import { filterLessonSessions } from "@/services/lessons/lessonsService";
import { AdminShell } from "../admin-shell";
import { AdminSplitPanelSkeleton } from "../admin-page-skeletons";
import { ResponsiveTableFilters } from "@/components/ui/responsive-table-filters";
import {
  LessonRegistrationFilters,
  countLessonRegistrationFilters,
} from "./lesson-registration-filters";
import { LessonRegistrationHeader } from "./lesson-registration-header";
import { LessonSessionList } from "./lesson-session-list";
import { adminCardClass, adminCardMutedClass } from "@/lib/design";
import { LessonSessionWorkspace } from "./lesson-session-workspace";
import { NewClassModal } from "../schedule/new-class/new-class-modal";

const LessonRegistrationDrawer = dynamic(
  () =>
    import("./lesson-registration-drawer").then((m) => ({
      default: m.LessonRegistrationDrawer,
    })),
  { ssr: false },
);

const ADMIN_NAV_HREF: Partial<Record<AdminNavKey, string>> = {
  dashboard: "/admin",
  agenda: "/admin/agenda",
  registroAulas: "/admin/registro-aulas",
  alunos: "/admin/clientes",
  karts: "/admin/karts",
  manutencao: "/admin/manutencao",
  configuracoes: "/admin/configuracoes",
};

export function LessonRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: allSessions = [], isPending: sessionsLoading } =
    useLessonSessionsAll();
  const { data: defaultDate = "" } = useLessonDefaultDate();
  const [statusFilter, setStatusFilter] =
    useState<LessonRegistrationStatusFilterDTO>("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [newClassOpen, setNewClassOpen] = useState(false);
  const { canEdit } = useModuleAccess("registroAulas");

  useEffect(() => {
    if (defaultDate && !selectedDate) {
      setSelectedDate(defaultDate);
    }
  }, [defaultDate, selectedDate]);

  const onNav = useCallback(
    (key: AdminNavKey) => {
      const href = ADMIN_NAV_HREF[key];
      if (href) router.push(href);
    },
    [router],
  );

  const invalidateSessions = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.lessons.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.karts.all });
  }, [queryClient]);

  const categories = useMemo(() => {
    return getAppServices().lessons.getLessonCategories(allSessions);
  }, [allSessions]);

  const filtered = useMemo(
    () =>
      allSessions.length > 0 && selectedDate
        ? filterLessonSessions(allSessions, {
            date: selectedDate,
            statusFilter,
            category,
            search,
          })
        : [],
    [allSessions, selectedDate, statusFilter, category, search],
  );

  const selectedSession = useMemo(
    () =>
      filtered.find((s) => s.id === selectedId) ??
      allSessions.find((s) => s.id === selectedId) ??
      null,
    [filtered, selectedId, allSessions],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleFinalized = useCallback(
    (message: string) => {
      setFeedback(`${message} Kart liberado na frota quando aplicável.`);
      invalidateSessions();
      window.setTimeout(() => setFeedback(null), 5000);
    },
    [invalidateSessions],
  );

  useEffect(() => {
    if (sessionsLoading || allSessions.length === 0) return;

    const eventId = searchParams.get("event");
    if (eventId) {
      const session = allSessions.find((s) => s.scheduleEventId === eventId);
      if (session) {
        setSelectedId(session.id);
        setSelectedDate(session.date);
      }
      return;
    }

    const studentId = searchParams.get("studentId");
    if (!studentId) return;

    const client = getRuntimeClientById(studentId);
    if (!client) return;

    setSearch(client.name);
    const session = allSessions.find((s) => s.studentName === client.name);
    if (session) {
      setSelectedId(session.id);
      setSelectedDate(session.date);
    }
  }, [allSessions, searchParams, sessionsLoading]);

  const handleDrawerClose = useCallback(() => {
    setSelectedId(null);
  }, []);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCategory("");
  };

  const handleNewClassSuccess = (message: string) => {
    setFeedback(message);
    invalidateSessions();
    window.setTimeout(() => setFeedback(null), 5000);
  };

  const handleNewClassError = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <>
      <AdminShell
        activeNav="registroAulas"
        onNav={onNav}
        mobileTitle="Registro de aulas"
        pageHeader={
          <LessonRegistrationHeader
            onOpenFilters={() => setFiltersOpen(true)}
            activeFilterCount={countLessonRegistrationFilters({
              search,
              statusFilter,
              category,
            })}
            onNewClass={canEdit ? () => setNewClassOpen(true) : undefined}
          />
        }
        mainClassName="!pb-6"
      >
        {feedback ? (
          <p
            role="status"
            className="mb-4 rounded-xl border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900"
          >
            {feedback}
          </p>
        ) : null}

        <ResponsiveTableFilters
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          onClear={handleClearFilters}
          resultCount={filtered.length}
          resultUnit="sessão"
          renderFilters={(layout) => (
            <LessonRegistrationFilters
              layout={layout}
              filters={{ search, statusFilter, category, selectedDate }}
              categories={categories}
              onChange={(patch) => {
                if (patch.search !== undefined) setSearch(patch.search);
                if (patch.statusFilter !== undefined)
                  setStatusFilter(patch.statusFilter);
                if (patch.category !== undefined) setCategory(patch.category);
                if (patch.selectedDate !== undefined)
                  setSelectedDate(patch.selectedDate);
              }}
              onClear={handleClearFilters}
            />
          )}
        />

        {sessionsLoading ? (
          <AdminSplitPanelSkeleton />
        ) : (
        <div className="admin-page-grid grid min-h-[min(70vh,720px)] items-stretch lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col lg:max-h-[calc(100vh-280px)]">
            <div className={`flex min-h-[280px] flex-1 flex-col overflow-hidden ${adminCardClass} lg:min-h-0`}>
              <div className="min-h-0 flex-1 overflow-y-auto p-3 md:p-4 app-scrollbar">
                <LessonSessionList
                  sessions={filtered}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                />
              </div>
            </div>
          </aside>

          <div className={`hidden min-h-[320px] min-w-0 overflow-visible p-4 md:p-6 lg:block lg:max-h-[calc(100vh-280px)] lg:overflow-y-auto app-scrollbar ${adminCardMutedClass}`}>
            {selectedSession ? (
              <LessonSessionWorkspace
                key={`${selectedSession.id}-${selectedSession.status}`}
                session={selectedSession}
                onFinalized={handleFinalized}
              />
            ) : (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center px-6 text-center">
                <p className="text-lg font-bold text-[var(--ds-text-primary)]">
                  Selecione uma sessão
                </p>
                <p className="mt-2 max-w-sm text-sm text-[var(--ds-text-secondary)]">
                  Escolha uma aula, treino ou sessão da lista para registrar
                  resultados, vincular telemetria ou adicionar observações.
                </p>
              </div>
            )}
          </div>
        </div>
        )}
      </AdminShell>

      <LessonRegistrationDrawer
        open={Boolean(selectedSession)}
        session={selectedSession}
        onClose={handleDrawerClose}
        onFinalized={handleFinalized}
      />

      <NewClassModal
        open={newClassOpen}
        onClose={() => setNewClassOpen(false)}
        initialDate={selectedDate}
        onSuccess={handleNewClassSuccess}
        onError={handleNewClassError}
        onScheduled={invalidateSessions}
      />
    </>
  );
}
