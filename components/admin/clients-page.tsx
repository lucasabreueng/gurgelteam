"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { IconType } from "react-icons/lib";
import {
  HiArrowTrendingUp,
  HiBanknotes,
  HiExclamationTriangle,
  HiUsers,
} from "react-icons/hi2";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { ClientListItem } from "@/lib/contracts/clients";
import { useClientsKpis, useClientsList } from "@/lib/query/hooks/use-clients";
import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";
import { exportClientsToExcel } from "@/lib/export-clients-excel";
import { AdminShell } from "./admin-shell";
import { ClientProfileDrawer } from "./clients/client-profile-drawer";
import { NewClientDrawer } from "./clients/new-client-drawer";
import { ClientTable } from "./clients/client-table";
import { ClientMobileList } from "./clients/client-mobile-card";
import {
  ClientsFilters,
  type ClientsFilterState,
} from "./clients/clients-filters";
import { ClientsFiltersSheet } from "./clients/clients-filters-sheet";
import { ClientsHeader } from "./clients/clients-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { EvolutionRanking } from "./clients/evolution-ranking";

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
  ticket: HiBanknotes,
  risco: HiExclamationTriangle,
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
  const { data: clientsList = [] } = useClientsList();
  const { data: clientsKpis = [] } = useClientsKpis();
  const kartCategories = ClientsServiceMock.getKartCategories();
  const skillLevels = ClientsServiceMock.getSkillLevels();
  const router = useRouter();
  const [filters, setFilters] = useState<ClientsFilterState>(DEFAULT_FILTERS);
  const [profileClientId, setProfileClientId] = useState<string | null>(null);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const onNav = useCallback(
    (key: AdminNavKey) => {
      const href = ADMIN_NAV_HREF[key];
      if (href) router.push(href);
    },
    [router]
  );

  const filteredClients = useMemo(
    () => clientsList.filter((c) => matchesFilters(c, filters)),
    [filters, clientsList]
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

  const handleExport = useCallback(() => {
    exportClientsToExcel(
      filteredClients,
      ClientsServiceMock.getKartCategories(),
      ClientsServiceMock.getSkillLevels()
    );
    setFeedback(
      filteredClients.length > 0
        ? `Lista exportada (${filteredClients.length} cliente${filteredClients.length === 1 ? "" : "s"}).`
        : "Planilha gerada sem registros — ajuste os filtros ou cadastre clientes."
    );
    window.setTimeout(() => setFeedback(null), 5000);
  }, [filteredClients]);

  return (
    <>
      <AdminShell
        activeNav="alunos"
        onNav={onNav}
        mobileTitle="Clientes"
        pageHeader={
          <ClientsHeader
            onNewClient={() => setNewClientOpen(true)}
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

        <section className="hidden lg:block">
          <ul className="admin-page-grid grid grid-cols-2 min-[900px]:grid-cols-5">
            {clientsKpis.map((kpi) => (
              <li key={kpi.id} className="min-w-0">
                <KpiCard
                  label={kpi.label}
                  value={kpi.value}
                  delta={kpi.delta}
                  deltaPositive={kpi.deltaPositive}
                  Icon={KPI_ICONS[kpi.id] ?? HiUsers}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="hidden lg:block">
          <ClientsFilters
            filters={filters}
            onChange={(patch) =>
              setFilters((prev) => ({ ...prev, ...patch }))
            }
            onClear={() => setFilters(DEFAULT_FILTERS)}
            kartCategories={kartCategories}
            skillLevels={skillLevels}
          />
        </section>

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
      </AdminShell>

      <NewClientDrawer
        open={newClientOpen}
        onClose={() => setNewClientOpen(false)}
        categories={kartCategories}
        skillLevels={skillLevels}
      />

      <ClientProfileDrawer
        clientId={profileClientId}
        onClose={() => setProfileClientId(null)}
      />

      <ClientsFiltersSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        onClear={() => setFilters(DEFAULT_FILTERS)}
        resultCount={filteredClients.length}
        kartCategories={kartCategories}
        skillLevels={skillLevels}
      />
    </>
  );
}
