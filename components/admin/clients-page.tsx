"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type { IconType } from "react-icons/lib";
import {
  HiArrowTrendingUp,
  HiCurrencyDollar,
  HiExclamationTriangle,
  HiUsers,
} from "react-icons/hi2";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { ClientListItem } from "@/lib/contracts/clients";
import { useClientsPageData, useClientsReference } from "@/lib/query/hooks/use-clients";
import { useModuleAccess } from "@/lib/query/hooks/use-module-access";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";
import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";
import { exportClientsToExcel } from "@/lib/export-clients-excel";
import { AdminShell } from "./admin-shell";
import { ConfirmDialog } from "./settings/confirm-dialog";
import { ClientTable } from "./clients/client-table";
import { ClientMobileList } from "./clients/client-mobile-card";
import {
  ClientsFilters,
  type ClientsFilterState,
} from "./clients/clients-filters";
import { ClientsHeader } from "./clients/clients-header";
import { ResponsiveTableFilters } from "@/components/ui/responsive-table-filters";
import { AdminResponsiveKpis } from "./admin-responsive-kpis";
import {
  AdminKpiStripSkeleton,
  AdminTableSkeleton,
} from "./admin-page-skeletons";
import { AdminErrorState } from "./admin-error-state";

const ClientProfileDrawer = dynamic(
  () =>
    import("./clients/client-profile-drawer").then((m) => ({
      default: m.ClientProfileDrawer,
    })),
  { ssr: false },
);

const ClientEditDrawer = dynamic(
  () =>
    import("./clients/client-edit-drawer").then((m) => ({
      default: m.ClientEditDrawer,
    })),
  { ssr: false },
);

const NewClientDrawer = dynamic(
  () =>
    import("./clients/new-client-drawer").then((m) => ({
      default: m.NewClientDrawer,
    })),
  { ssr: false },
);

const EvolutionRanking = dynamic(
  () =>
    import("./clients/evolution-ranking").then((m) => ({
      default: m.EvolutionRanking,
    })),
  { ssr: false, loading: () => <AdminTableSkeleton rows={4} /> },
);

const ADMIN_NAV_HREF: Partial<Record<AdminNavKey, string>> = {
  dashboard: "/admin",
  agenda: "/admin/agenda",
  alunos: "/admin/clientes",
  karts: "/admin/karts",
  manutencao: "/admin/manutencao",
  configuracoes: "/admin/configuracoes",
};

const KPI_ICONS: Record<string, IconType> = {
  ativos: HiUsers,
  novos: HiArrowTrendingUp,
  retencao: HiArrowTrendingUp,
  ticket: HiCurrencyDollar,
  risco: HiExclamationTriangle,
  menores: HiUsers,
};

const DEFAULT_FILTERS: ClientsFilterState = {
  search: "",
  categoryId: "",
  levelId: "",
  status: "",
};

function matchesFilters(
  client: ClientListItem,
  filters: ClientsFilterState
): boolean {
  const q = filters.search.trim().toLowerCase();
  if (q) {
    const haystack = [
      client.name,
      client.activePlan,
      ...ClientsServiceMock.resolveCategoryNames(client.categoryIds),
      ClientsServiceMock.resolveLevelName(client.levelId),
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (
    filters.categoryId &&
    !client.categoryIds.includes(filters.categoryId)
  ) {
    return false;
  }
  if (filters.levelId && client.levelId !== filters.levelId) return false;
  if (filters.status && client.status !== filters.status) return false;
  return true;
}

function countActiveFilters(filters: ClientsFilterState): number {
  let count = 0;
  if (filters.search.trim()) count += 1;
  if (filters.categoryId) count += 1;
  if (filters.levelId) count += 1;
  if (filters.status) count += 1;
  return count;
}

export function ClientsPage() {
  const queryClient = useQueryClient();
  const {
    list: clientsList,
    kpis: clientsKpis,
    isPageLoading,
    isError: pageError,
    refetch: refetchPage,
  } = useClientsPageData();
  const isPageError = pageError;
  const { data: reference } = useClientsReference();
  const { canEdit, canDelete } = useModuleAccess("alunos");
  const kartCategories = useMemo(
    () => reference?.categories ?? [],
    [reference?.categories],
  );
  const skillLevels = useMemo(
    () => reference?.skillLevels ?? [],
    [reference?.skillLevels],
  );
  const router = useRouter();
  const [filters, setFilters] = useState<ClientsFilterState>(DEFAULT_FILTERS);
  const [profileClientId, setProfileClientId] = useState<string | null>(null);
  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [clientOverrides, setClientOverrides] = useState<
    Record<
      string,
      Partial<Pick<ClientListItem, "categoryIds" | "levelId" | "status">>
    >
  >({});
  const [lastRegisteredClientId, setLastRegisteredClientId] = useState<
    string | null
  >(null);

  const onNav = useCallback(
    (key: AdminNavKey) => {
      const href = ADMIN_NAV_HREF[key];
      if (href) router.push(href);
    },
    [router]
  );

  const resolvedClients = useMemo(() => {
    return clientsList.map((c) => {
      const patch = clientOverrides[c.id];
      return patch ? { ...c, ...patch } : c;
    });
  }, [clientsList, clientOverrides]);

  const filteredClients = useMemo(
    () => resolvedClients.filter((c) => matchesFilters(c, filters)),
    [filters, resolvedClients]
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedClients = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredClients.slice(start, start + pageSize);
  }, [filteredClients, page, pageSize]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const pendingDeleteClient =
    resolvedClients.find((c) => c.id === pendingDeleteId) ?? null;

  const handleDelete = async (id: string) => {
    const target = resolvedClients.find((c) => c.id === id);
    if (!target) return;
    setDeleting(true);
    try {
      await getAppServices().clients.removeClient(id);
      void queryClient.invalidateQueries({ queryKey: queryKeys.clients.list() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.clients.kpis() });
      if (profileClientId === id) setProfileClientId(null);
      if (editClientId === id) setEditClientId(null);
      setFeedback(`${target.name} foi excluído.`);
      window.setTimeout(() => setFeedback(null), 5000);
    } catch (e) {
      setFeedback(
        e instanceof Error ? e.message : "Não foi possível excluir o cliente.",
      );
      window.setTimeout(() => setFeedback(null), 5000);
    } finally {
      setDeleting(false);
      setPendingDeleteId(null);
    }
  };

  const handleExport = useCallback(() => {
    void exportClientsToExcel(filteredClients, kartCategories, skillLevels).then(
      () => {
        setFeedback(
          filteredClients.length > 0
            ? `Lista exportada (${filteredClients.length} cliente${filteredClients.length === 1 ? "" : "s"}).`
            : "Planilha gerada sem registros — ajuste os filtros ou cadastre clientes.",
        );
        window.setTimeout(() => setFeedback(null), 5000);
      },
    );
  }, [filteredClients, kartCategories, skillLevels]);

  return (
    <>
      <AdminShell
        activeNav="alunos"
        onNav={onNav}
        mobileTitle="Clientes"
        pageHeader={
          <ClientsHeader
            onNewClient={canEdit ? () => setNewClientOpen(true) : undefined}
            onExport={handleExport}
            onOpenFilters={() => setFiltersOpen(true)}
            activeFilterCount={countActiveFilters(filters)}
          />
        }
      >
        {feedback ? (
          <p
            role="status"
            className="rounded-xl border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900"
          >
            {feedback}
          </p>
        ) : null}

        {isPageError ? (
          <AdminErrorState
            onRetry={() => {
              void refetchPage();
            }}
          />
        ) : isPageLoading ? (
          <>
            <AdminKpiStripSkeleton count={5} />
            <AdminTableSkeleton rows={8} />
          </>
        ) : (
          <>
        <AdminResponsiveKpis
          kpis={clientsKpis}
          icons={KPI_ICONS}
          defaultIcon={HiUsers}
          desktopClassName="admin-page-grid grid grid-cols-2 min-[900px]:grid-cols-5"
        />

        <ResponsiveTableFilters
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          onClear={() => setFilters(DEFAULT_FILTERS)}
          resultCount={filteredClients.length}
          resultUnit="cliente"
          renderFilters={(layout) => (
            <ClientsFilters
              layout={layout}
              filters={filters}
              onChange={(patch) =>
                setFilters((prev) => ({ ...prev, ...patch }))
              }
              onClear={() => setFilters(DEFAULT_FILTERS)}
              kartCategories={kartCategories}
              skillLevels={skillLevels}
            />
          )}
        />

        <section className="hidden lg:block">
          <ClientTable
            clients={paginatedClients}
            kartCategories={kartCategories}
            skillLevels={skillLevels}
            page={page}
            pageSize={pageSize}
            totalItems={filteredClients.length}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            onViewProfile={setProfileClientId}
            onEdit={canEdit ? setEditClientId : undefined}
            onDelete={canDelete ? setPendingDeleteId : undefined}
          />
        </section>

        <ClientMobileList
          clients={filteredClients}
          kartCategories={kartCategories}
          skillLevels={skillLevels}
          onViewProfile={setProfileClientId}
        />

        <section className="hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-6 lg:block md:p-8">
          <EvolutionRanking />
        </section>
          </>
        )}
      </AdminShell>

      <NewClientDrawer
        open={newClientOpen}
        onClose={() => setNewClientOpen(false)}
        categories={kartCategories}
        skillLevels={skillLevels}
        onSuccess={async (payload) => {
          const client = await ClientsServiceMock.registerClient(payload);
          setLastRegisteredClientId(client.id);
          void queryClient.invalidateQueries({ queryKey: queryKeys.clients.list() });
          void queryClient.invalidateQueries({ queryKey: queryKeys.clients.kpis() });
          setFeedback(
            `${client.name} cadastrado. Use "Agendar aula" no perfil ou gere a cobrança.`,
          );
          window.setTimeout(() => setFeedback(null), 6000);
        }}
        onGenerateCharge={() => {
          if (!lastRegisteredClientId) return;
          router.push(`/admin/financeiro?clientId=${lastRegisteredClientId}`);
        }}
      />

      <ClientProfileDrawer
        clientId={profileClientId}
        onClose={() => setProfileClientId(null)}
        onScheduleClass={(clientId) => {
          setProfileClientId(null);
          router.push(`/admin/agenda?studentId=${clientId}`);
        }}
        onOpenRegistration={(clientId) => {
          setProfileClientId(null);
          router.push(`/admin/registro-aulas?studentId=${clientId}`);
        }}
        onGenerateCharge={(clientId) => {
          setProfileClientId(null);
          router.push(`/admin/financeiro?clientId=${clientId}`);
        }}
        onOpenTelemetry={(clientId) => {
          setProfileClientId(null);
          router.push(`/admin/telemetria?studentId=${clientId}`);
        }}
      />

      <ClientEditDrawer
        clientId={editClientId}
        categories={kartCategories}
        skillLevels={skillLevels}
        getClient={(id) => resolvedClients.find((c) => c.id === id) ?? null}
        onClose={() => setEditClientId(null)}
        onSave={(id, patch) => {
          setClientOverrides((prev) => ({ ...prev, [id]: patch }));
          setFeedback("Cliente atualizado (mock).");
          window.setTimeout(() => setFeedback(null), 5000);
          setEditClientId(null);
        }}
      />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Excluir cliente?"
        message={
          pendingDeleteClient
            ? `Tem certeza que deseja excluir ${pendingDeleteClient.name}? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmLabel={deleting ? "Excluindo…" : "Excluir"}
        cancelLabel="Cancelar"
        onConfirm={() => {
          if (pendingDeleteId) void handleDelete(pendingDeleteId);
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
