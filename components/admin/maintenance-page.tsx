"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { IconType } from "react-icons/lib";
import {
  HiBanknotes,
  HiCube,
  HiExclamationTriangle,
  HiTruck,
  HiWrench,
} from "react-icons/hi2";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { MaintenanceOrderListItem } from "@/lib/contracts/maintenance";
import {
  useMaintenanceKpis,
  useMaintenanceOrders,
} from "@/lib/query/hooks/use-maintenance";
import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";
import { AdminShell } from "./admin-shell";
import { MaintenanceDetailsDrawer } from "./maintenance/maintenance-details-drawer";
import {
  MaintenanceFilters,
  type MaintenanceFilterState,
} from "./maintenance/maintenance-filters";
import { ChecklistDrawer } from "./maintenance/checklist/checklist-drawer";
import { RegisterPartDrawer } from "./maintenance/register-part/register-part-drawer";
import { NewInspectionModal } from "./maintenance/new-inspection/new-inspection-modal";
import { NewMaintenanceModal } from "./maintenance/new-maintenance/new-maintenance-modal";
import { MaintenanceHeader } from "./maintenance/maintenance-header";
import { MaintenanceMetrics } from "./maintenance/maintenance-metrics";
import { MaintenanceOrderTable } from "./maintenance/maintenance-order-table";
import { KpiCard } from "@/components/ui/kpi-card";
import { SmartAlerts } from "./maintenance/smart-alerts";

const ADMIN_NAV_HREF: Partial<Record<AdminNavKey, string>> = {
  dashboard: "/admin",
  agenda: "/admin/agenda",
  alunos: "/admin/clientes",
  karts: "/admin/karts",
  manutencao: "/admin/manutencao",
  configuracoes: "/admin/configuracoes",
};

const KPI_ICONS: Record<string, IconType> = {
  abertas: HiWrench,
  parados: HiTruck,
  preventivas: HiExclamationTriangle,
  em_manut: HiWrench,
  custo: HiBanknotes,
  pecas: HiCube,
};

const DEFAULT_FILTERS: MaintenanceFilterState = {
  search: "",
  priority: "",
  status: "",
  type: "",
  mechanicId: "",
  categoryId: "",
};

function matchesFilters(
  order: MaintenanceOrderListItem,
  filters: MaintenanceFilterState
): boolean {
  const q = filters.search.trim().toLowerCase();
  if (q) {
    const hay = [
      order.osNumber,
      String(order.kartNumber),
      order.problem,
      order.mechanicName,
      ...order.partsNeeded,
      order.ownerName ?? "",
    ]
      .join(" ")
      .toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (filters.priority && order.priority !== filters.priority) return false;
  if (filters.status && order.status !== filters.status) return false;
  if (filters.type && order.type !== filters.type) return false;
  if (filters.mechanicId && order.mechanicId !== filters.mechanicId) return false;
  if (filters.categoryId && order.categoryId !== filters.categoryId) return false;
  return true;
}

export function MaintenancePage() {
  const { data: maintenanceOrders = [] } = useMaintenanceOrders();
  const { data: maintenanceKpis = [] } = useMaintenanceKpis();
  const maintenanceAlerts = MaintenanceServiceMock.getAlerts();
  const maintenanceMetrics = MaintenanceServiceMock.getPageMetrics();
  const router = useRouter();
  const [filters, setFilters] = useState<MaintenanceFilterState>(DEFAULT_FILTERS);
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [registerPartOpen, setRegisterPartOpen] = useState(false);
  const [newInspectionOpen, setNewInspectionOpen] = useState(false);
  const [newMaintenanceOpen, setNewMaintenanceOpen] = useState(false);
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

  const filteredOrders = useMemo(
    () => maintenanceOrders.filter((o) => matchesFilters(o, filters)),
    [filters, maintenanceOrders]
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page, pageSize]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleActionSuccess = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 4000);
  }, []);

  return (
    <>
      <AdminShell
        activeNav="manutencao"
        onNav={onNav}
        mobileTitle="Manutenção"
        pageHeader={
          <MaintenanceHeader
            onOpenChecklist={() => setChecklistOpen(true)}
            onRegisterPart={() => setRegisterPartOpen(true)}
            onNewInspection={() => setNewInspectionOpen(true)}
            onNewMaintenance={() => setNewMaintenanceOpen(true)}
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

        <section>
          <ul className="admin-page-grid grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {maintenanceKpis.map((kpi) => (
              <li key={kpi.id} className="min-w-0">
                <KpiCard
                  label={kpi.label}
                  value={kpi.value}
                  delta={kpi.delta}
                  deltaPositive={kpi.deltaPositive}
                  Icon={KPI_ICONS[kpi.id] ?? HiWrench}
                />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <MaintenanceFilters
            filters={filters}
            onChange={(patch) => setFilters((p) => ({ ...p, ...patch }))}
            onClear={() => setFilters(DEFAULT_FILTERS)}
          />
        </section>

        <section>
          <MaintenanceOrderTable
            orders={paginatedOrders}
            page={page}
            pageSize={pageSize}
            totalItems={filteredOrders.length}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            onViewDetails={setDetailOrderId}
          />
        </section>

        <section>
          <SmartAlerts alerts={maintenanceAlerts} />
        </section>

        <section>
          <MaintenanceMetrics metrics={maintenanceMetrics} />
        </section>
      </AdminShell>

      <MaintenanceDetailsDrawer
        orderId={detailOrderId}
        onClose={() => setDetailOrderId(null)}
      />

      <ChecklistDrawer
        open={checklistOpen}
        onClose={() => setChecklistOpen(false)}
        onSuccess={handleActionSuccess}
      />

      <RegisterPartDrawer
        open={registerPartOpen}
        onClose={() => setRegisterPartOpen(false)}
        onSuccess={handleActionSuccess}
      />

      <NewInspectionModal
        open={newInspectionOpen}
        onClose={() => setNewInspectionOpen(false)}
        onSuccess={handleActionSuccess}
      />

      <NewMaintenanceModal
        open={newMaintenanceOpen}
        onClose={() => setNewMaintenanceOpen(false)}
        onSuccess={handleActionSuccess}
      />
    </>
  );
}
