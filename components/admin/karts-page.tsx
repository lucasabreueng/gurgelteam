"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { IconType } from "react-icons/lib";
import {
  HiClock,
  HiExclamationTriangle,
  HiTruck,
  HiUserGroup,
  HiWrench,
} from "react-icons/hi2";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { FleetKartListItem, NewKartFormData } from "@/lib/contracts/karts";
import { useKartsFleet, useKartsKpis } from "@/lib/query/hooks/use-karts";
import { KartsServiceMock } from "@/services/karts/kartsServiceMock";
import { AdminShell } from "./admin-shell";
import { KartDetailDrawer } from "./karts/kart-detail-drawer";
import { KartsFleetTable } from "./karts/karts-fleet-table";
import {
  KartsFilters,
  type KartsFilterState,
} from "./karts/karts-filters";
import { KartsHeader } from "./karts/karts-header";
import { NewKartDrawer } from "./karts/new-kart-drawer";
import { KpiCard } from "@/components/ui/kpi-card";

const ADMIN_NAV_HREF: Partial<Record<AdminNavKey, string>> = {
  dashboard: "/admin",
  agenda: "/admin/agenda",
  alunos: "/admin/clientes",
  karts: "/admin/karts",
  manutencao: "/admin/manutencao",
  configuracoes: "/admin/configuracoes",
};

const KPI_ICONS: Record<string, IconType> = {
  total: HiTruck,
  disp: HiTruck,
  manut: HiWrench,
  prop: HiUserGroup,
  cli: HiUserGroup,
  pend: HiExclamationTriangle,
};

const DEFAULT_FILTERS: KartsFilterState = {
  search: "",
  ownership: "",
  categoryId: "",
  status: "",
  maintenance: "",
};

type DetailState = {
  kartId: string;
  focusHistory?: boolean;
};

function matchesFilters(
  kart: FleetKartListItem,
  filters: KartsFilterState
): boolean {
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    const hay =
      `${kart.number} ${kart.categoryName} ${kart.ownerName ?? ""} ${kart.motor}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (filters.ownership && kart.ownership !== filters.ownership) return false;
  if (filters.categoryId && kart.categoryId !== filters.categoryId) return false;
  if (filters.status && kart.status !== filters.status) return false;
  if (filters.maintenance === "overdue" && kart.nextMaintenanceDays >= 0) {
    return false;
  }
  if (
    filters.maintenance === "7" &&
    (kart.nextMaintenanceDays < 0 || kart.nextMaintenanceDays > 7)
  ) {
    return false;
  }
  if (
    filters.maintenance === "30" &&
    (kart.nextMaintenanceDays < 0 || kart.nextMaintenanceDays > 30)
  ) {
    return false;
  }
  return true;
}

export function KartsPage() {
  const { data: fleetKarts = [] } = useKartsFleet();
  const { data: kartsKpis = [] } = useKartsKpis();
  const registeredMotors = KartsServiceMock.getRegisteredMotors();
  const router = useRouter();
  const [filters, setFilters] = useState<KartsFilterState>(DEFAULT_FILTERS);
  const [detailState, setDetailState] = useState<DetailState | null>(null);
  const [newKartOpen, setNewKartOpen] = useState(false);
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

  const filteredKarts = useMemo(
    () => fleetKarts.filter((k) => matchesFilters(k, filters)),
    [filters, fleetKarts]
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredKarts.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedKarts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredKarts.slice(start, start + pageSize);
  }, [filteredKarts, page, pageSize]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleNewKartSuccess = useCallback((data: NewKartFormData) => {
    const motorName =
      registeredMotors.find((motor) => motor.id === data.motor)?.name ??
      data.motor;
    setFeedback(`Kart ${data.number} (${motorName}) cadastrado com sucesso (mock).`);
    window.setTimeout(() => setFeedback(null), 4000);
  }, [registeredMotors]);

  return (
    <>
      <AdminShell
        activeNav="karts"
        onNav={onNav}
        mobileTitle="Karts"
        pageHeader={<KartsHeader onNewKart={() => setNewKartOpen(true)} />}
      >
        {feedback ? (
          <p
            role="status"
            className="rounded-xl border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900"
          >
            {feedback}
          </p>
        ) : null}

        <section>
          <ul className="admin-page-grid grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {kartsKpis.map((kpi) => (
              <li key={kpi.id} className="min-w-0">
                <KpiCard
                  {...kpi}
                  Icon={KPI_ICONS[kpi.id] ?? HiClock}
                />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <KartsFilters
            filters={filters}
            onChange={(patch: Partial<KartsFilterState>) =>
              setFilters((p) => ({ ...p, ...patch }))
            }
            onClear={() => setFilters(DEFAULT_FILTERS)}
          />
        </section>

        <section>
          <KartsFleetTable
            karts={paginatedKarts}
            page={page}
            pageSize={pageSize}
            totalItems={filteredKarts.length}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            onViewDetails={(id) =>
              setDetailState({ kartId: id, focusHistory: false })
            }
            onViewHistory={(id) =>
              setDetailState({ kartId: id, focusHistory: true })
            }
          />
        </section>

      </AdminShell>

      <NewKartDrawer
        open={newKartOpen}
        onClose={() => setNewKartOpen(false)}
        onSuccess={handleNewKartSuccess}
      />

      <KartDetailDrawer
        kartId={detailState?.kartId ?? null}
        focusHistory={detailState?.focusHistory}
        onClose={() => setDetailState(null)}
      />
    </>
  );
}
