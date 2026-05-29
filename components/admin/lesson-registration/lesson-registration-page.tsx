"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type {
  LessonRegistrationStatusFilterDTO,
} from "@/lib/contracts/lessons/lesson.types";
import { AdminShell } from "../admin-shell";
import { ResponsiveTableFilters } from "@/components/ui/responsive-table-filters";
import {
  LessonRegistrationFilters,
  countLessonRegistrationFilters,
} from "./lesson-registration-filters";
import { LessonRegistrationHeader } from "./lesson-registration-header";
import { LessonSessionList } from "./lesson-session-list";
import { LessonSessionWorkspace } from "./lesson-session-workspace";
import { LessonServiceMock } from "@/services/lessons/lessonServiceMock";
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
  const [statusFilter, setStatusFilter] =
    useState<LessonRegistrationStatusFilterDTO>("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    LessonServiceMock.getDefaultSelectedDate(),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sessionVersion, setSessionVersion] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [newClassOpen, setNewClassOpen] = useState(false);

  const onNav = useCallback(
    (key: AdminNavKey) => {
      const href = ADMIN_NAV_HREF[key];
      if (href) router.push(href);
    },
    [router],
  );

  const allSessions = useMemo(() => {
    void sessionVersion;
    return LessonServiceMock.getAllSessionsWithOverrides();
  }, [sessionVersion]);

  const categories = useMemo(() => {
    return LessonServiceMock.getLessonCategories(allSessions);
  }, [allSessions]);

  const filtered = useMemo(
    () =>
      LessonServiceMock.listSessions({
        date: selectedDate,
        statusFilter,
        category,
        search,
      }),
    [selectedDate, statusFilter, category, search],
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

  const handleFinalized = useCallback((message: string) => {
    setFeedback(message);
    setSessionVersion((v) => v + 1);
    window.setTimeout(() => setFeedback(null), 5000);
  }, []);

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
    setSessionVersion((v) => v + 1);
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
            onNewClass={() => setNewClassOpen(true)}
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

        <div className="admin-page-grid grid min-h-[min(70vh,720px)] items-stretch lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col lg:max-h-[calc(100vh-280px)]">
            <div className="flex min-h-[280px] flex-1 flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-sm lg:min-h-0">
              <div className="min-h-0 flex-1 overflow-y-auto p-3 md:p-4 app-scrollbar">
                <LessonSessionList
                  sessions={filtered}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                />
              </div>
            </div>
          </aside>

          <div className="hidden min-h-[320px] min-w-0 overflow-visible rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc]/80 p-4 md:p-6 lg:block lg:max-h-[calc(100vh-280px)] lg:overflow-y-auto app-scrollbar">
            {selectedSession ? (
              <LessonSessionWorkspace
                key={`${selectedSession.id}-${sessionVersion}`}
                session={selectedSession}
                onFinalized={handleFinalized}
              />
            ) : (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center px-6 text-center">
                <p className="text-lg font-bold text-[#0d1f3c]">
                  Selecione uma sessão
                </p>
                <p className="mt-2 max-w-sm text-sm text-neutral-600">
                  Escolha uma aula, treino ou sessão da lista para registrar
                  resultados, vincular telemetria ou adicionar observações.
                </p>
              </div>
            )}
          </div>
        </div>
      </AdminShell>

      <LessonRegistrationDrawer
        open={Boolean(selectedSession)}
        session={selectedSession}
        onClose={handleDrawerClose}
        onFinalized={handleFinalized}
        sessionVersion={sessionVersion}
      />

      <NewClassModal
        open={newClassOpen}
        onClose={() => setNewClassOpen(false)}
        initialDate={selectedDate}
        onSuccess={handleNewClassSuccess}
      />
    </>
  );
}
