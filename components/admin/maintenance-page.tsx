"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { IconType } from "react-icons/lib";
import {
  HiBanknotes,
  HiCalendarDays,
  HiCheckCircle,
  HiClipboardDocumentList,
  HiExclamationTriangle,
  HiWrench,
} from "react-icons/hi2";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type {
  ChecklistListFilterState,
  InspectionListFilterState,
  MaintenanceListFilterState,
  MaintenancePageTabKey,
} from "@/lib/contracts/maintenance/complete-checklist";
import type {
  MaintenanceDraftFromInspection,
  MaintenanceSimpleFilterState,
} from "@/lib/contracts/maintenance/simple";
import { useMaintenanceSimplePage } from "@/lib/query/hooks/use-maintenance";
import { useModuleAccess } from "@/lib/query/hooks/use-module-access";
import { getAppServices } from "@/lib/data-source/app-services";
import { AdminShell } from "./admin-shell";
import { AdminResponsiveKpis } from "./admin-responsive-kpis";
import { ResponsiveTableFilters } from "@/components/ui/responsive-table-filters";
import { countActiveFilters } from "@/components/ui/filter-box";
import { MaintenanceSimpleHeader } from "./maintenance/simple/maintenance-simple-header";
import { MaintenanceSimpleFilters } from "./maintenance/simple/maintenance-simple-filters";
import { MaintenanceKartFleet } from "./maintenance/simple/maintenance-kart-fleet";
import { MaintenanceSectionTabs } from "./maintenance/simple/maintenance-section-tabs";
import { MaintenanceInspectionsTable } from "./maintenance/simple/maintenance-inspections-table";
import { MaintenanceMaintenancesTable } from "./maintenance/simple/maintenance-maintenances-table";
import { MaintenanceChecklistsTable } from "./maintenance/simple/maintenance-checklists-table";
import {
  ChecklistListFilters,
  InspectionListFilters,
  MaintenanceListFilters,
} from "./maintenance/simple/maintenance-tab-filters";
import { AdminMaintenancePageSkeleton } from "./admin-page-skeletons";

const KPI_ICONS: Record<string, IconType> = {
  disponiveis: HiCheckCircle,
  atencao: HiExclamationTriangle,
  manutencao: HiWrench,
  inspecoes: HiClipboardDocumentList,
  custo: HiBanknotes,
  checklists_mes: HiClipboardDocumentList,
  checklists_pendentes: HiExclamationTriangle,
  ultimo_checklist: HiCalendarDays,
};

const SimpleInspectionDrawer = dynamic(
  () =>
    import("./maintenance/simple/simple-inspection-drawer").then((m) => ({
      default: m.SimpleInspectionDrawer,
    })),
  { ssr: false },
);

const SimpleMaintenanceDrawer = dynamic(
  () =>
    import("./maintenance/simple/simple-maintenance-drawer").then((m) => ({
      default: m.SimpleMaintenanceDrawer,
    })),
  { ssr: false },
);

const CompleteChecklistDrawer = dynamic(
  () =>
    import("./maintenance/simple/complete-checklist-drawer").then((m) => ({
      default: m.CompleteChecklistDrawer,
    })),
  { ssr: false },
);

const KartDetailDrawer = dynamic(
  () =>
    import("./karts/kart-detail-drawer").then((m) => ({
      default: m.KartDetailDrawer,
    })),
  { ssr: false },
);

const ChecklistDetailDrawer = dynamic(
  () =>
    import("./maintenance/simple/checklist-detail-drawer").then((m) => ({
      default: m.ChecklistDetailDrawer,
    })),
  { ssr: false },
);

const NewInspectionModal = dynamic(
  () =>
    import("./maintenance/new-inspection/new-inspection-modal").then((m) => ({
      default: m.NewInspectionModal,
    })),
  { ssr: false },
);

const MaintenanceDetailsDrawer = dynamic(
  () =>
    import("./maintenance/maintenance-details-drawer").then((m) => ({
      default: m.MaintenanceDetailsDrawer,
    })),
  { ssr: false },
);

const ADMIN_NAV_HREF: Partial<Record<AdminNavKey, string>> = {
  dashboard: "/admin",
  agenda: "/admin/agenda",
  alunos: "/admin/clientes",
  karts: "/admin/karts",
  manutencao: "/admin/manutencao",
  configuracoes: "/admin/configuracoes",
};

const DEFAULT_KART_FILTERS: MaintenanceSimpleFilterState = {
  kartStatus: "",
  maintenanceType: "",
  period: "",
  kartId: "",
};

const DEFAULT_INSPECTION_FILTERS: InspectionListFilterState = {
  kartId: "",
  period: "",
  attention: "",
};

const DEFAULT_MAINTENANCE_LIST_FILTERS: MaintenanceListFilterState = {
  kartId: "",
  type: "",
  status: "",
  period: "",
};

const DEFAULT_CHECKLIST_FILTERS: ChecklistListFilterState = {
  kartId: "",
  type: "",
  finalStatus: "",
  period: "",
};

function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function MaintenancePage() {
  const { data, isPending: isPageLoading } = useMaintenanceSimplePage();
  const { canEdit } = useModuleAccess("manutencao");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MaintenancePageTabKey>("karts");
  const [kartFilters, setKartFilters] =
    useState<MaintenanceSimpleFilterState>(DEFAULT_KART_FILTERS);
  const [inspectionFilters, setInspectionFilters] =
    useState<InspectionListFilterState>(DEFAULT_INSPECTION_FILTERS);
  const [maintenanceListFilters, setMaintenanceListFilters] =
    useState<MaintenanceListFilterState>(DEFAULT_MAINTENANCE_LIST_FILTERS);
  const [checklistFilters, setChecklistFilters] =
    useState<ChecklistListFilterState>(DEFAULT_CHECKLIST_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [kartsPage, setKartsPage] = useState(1);
  const [inspectionsPage, setInspectionsPage] = useState(1);
  const [maintenancesPage, setMaintenancesPage] = useState(1);
  const [checklistsPage, setChecklistsPage] = useState(1);

  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [advancedInspectionOpen, setAdvancedInspectionOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [historyKartId, setHistoryKartId] = useState<string | null>(null);
  const [checklistDetailId, setChecklistDetailId] = useState<string | null>(null);
  const [orderDetailId, setOrderDetailId] = useState<string | null>(null);

  const [inspectionKartId, setInspectionKartId] = useState("");
  const [maintenanceKartId, setMaintenanceKartId] = useState("");
  const [checklistKartId, setChecklistKartId] = useState("");
  const [maintenanceDraft, setMaintenanceDraft] =
    useState<MaintenanceDraftFromInspection | null>(null);
  const [pendingMaintenanceQueue, setPendingMaintenanceQueue] = useState<
    MaintenanceDraftFromInspection[]
  >([]);

  const onNav = useCallback(
    (key: AdminNavKey) => {
      const href = ADMIN_NAV_HREF[key];
      if (href) router.push(href);
    },
    [router],
  );

  const fleet = useMemo(() => data?.fleet ?? [], [data?.fleet]);
  const kpis = useMemo(() => data?.kpis ?? [], [data?.kpis]);
  const responsibles = useMemo(() => data?.responsibles ?? [], [data?.responsibles]);
  const filterOptions = data?.filterOptions;
  const inspections = useMemo(() => data?.inspections ?? [], [data?.inspections]);
  const maintenances = useMemo(() => data?.maintenances ?? [], [data?.maintenances]);
  const checklistHistory = useMemo(
    () => data?.checklistHistory ?? [],
    [data?.checklistHistory],
  );

  const kpisDisplay = useMemo(
    () => kpis.map((k) => ({ ...k, sub: null, delta: null })),
    [kpis],
  );

  const kartFilterOptions = useMemo(
    () => [
      { value: "", label: "Todos os karts" },
      ...fleet.map((k) => ({
        value: k.id,
        label: `Kart ${String(k.number).padStart(2, "0")}`,
      })),
    ],
    [fleet],
  );

  const filteredFleet = useMemo(
    () => getAppServices().maintenance.filterFleet(fleet, kartFilters),
    [fleet, kartFilters],
  );

  const filteredInspections = useMemo(
    () =>
      getAppServices().maintenance.filterInspectionsList(inspections, inspectionFilters),
    [inspections, inspectionFilters],
  );

  const filteredMaintenances = useMemo(
    () =>
      getAppServices().maintenance.filterMaintenancesList(
        maintenances,
        maintenanceListFilters,
      ),
    [maintenances, maintenanceListFilters],
  );

  const filteredChecklists = useMemo(
    () =>
      getAppServices().maintenance.filterChecklistsList(
        checklistHistory,
        checklistFilters,
      ),
    [checklistHistory, checklistFilters],
  );

  const paginatedFleet = useMemo(
    () => paginate(filteredFleet, kartsPage, pageSize),
    [filteredFleet, kartsPage, pageSize],
  );

  const paginatedInspections = useMemo(
    () => paginate(filteredInspections, inspectionsPage, pageSize),
    [filteredInspections, inspectionsPage, pageSize],
  );

  const paginatedMaintenances = useMemo(
    () => paginate(filteredMaintenances, maintenancesPage, pageSize),
    [filteredMaintenances, maintenancesPage, pageSize],
  );

  const paginatedChecklists = useMemo(
    () => paginate(filteredChecklists, checklistsPage, pageSize),
    [filteredChecklists, checklistsPage, pageSize],
  );

  useEffect(() => {
    setKartsPage(1);
  }, [kartFilters]);

  useEffect(() => {
    setInspectionsPage(1);
  }, [inspectionFilters]);

  useEffect(() => {
    setMaintenancesPage(1);
  }, [maintenanceListFilters]);

  useEffect(() => {
    setChecklistsPage(1);
  }, [checklistFilters]);

  useEffect(() => {
    setKartsPage(1);
    setInspectionsPage(1);
    setMaintenancesPage(1);
    setChecklistsPage(1);
  }, [pageSize]);

  const checklistDetailRow = useMemo(
    () => checklistHistory.find((r) => r.id === checklistDetailId) ?? null,
    [checklistHistory, checklistDetailId],
  );

  const handleSuccess = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 4500);
  }, []);

  const openInspection = (kartId = "") => {
    setInspectionKartId(kartId);
    setInspectionOpen(true);
  };

  const openMaintenance = (
    kartId = "",
    draft: MaintenanceDraftFromInspection | null = null,
  ) => {
    setMaintenanceKartId(kartId);
    setMaintenanceDraft(draft);
    setMaintenanceOpen(true);
  };

  const openCompleteChecklist = (kartId = "") => {
    setChecklistKartId(kartId);
    setChecklistOpen(true);
  };

  const processMaintenanceQueue = useCallback(
    (drafts: MaintenanceDraftFromInspection[]) => {
      if (drafts.length === 0) return;
      const [first, ...rest] = drafts;
      setPendingMaintenanceQueue(rest);
      openMaintenance(first.kartId, first);
      if (rest.length > 0) {
        handleSuccess(
          `${drafts.length} manutenções pendentes criadas. Abrindo a primeira — ${rest.length} restante(s) na fila (mock).`,
        );
      }
    },
    [handleSuccess],
  );

  const handleMaintenanceClose = () => {
    setMaintenanceOpen(false);
    setMaintenanceDraft(null);
    if (pendingMaintenanceQueue.length > 0) {
      const [next, ...rest] = pendingMaintenanceQueue;
      setPendingMaintenanceQueue(rest);
      window.setTimeout(() => openMaintenance(next.kartId, next), 300);
    }
  };

  const activeFilterCount = useMemo(() => {
    switch (activeTab) {
      case "karts":
        return countActiveFilters([
          kartFilters.kartStatus,
          kartFilters.maintenanceType,
          kartFilters.period,
          kartFilters.kartId,
        ]);
      case "inspecoes":
        return countActiveFilters([
          inspectionFilters.kartId,
          inspectionFilters.period,
          inspectionFilters.attention,
        ]);
      case "manutencoes":
        return countActiveFilters([
          maintenanceListFilters.kartId,
          maintenanceListFilters.type,
          maintenanceListFilters.status,
          maintenanceListFilters.period,
        ]);
      case "checklists":
        return countActiveFilters([
          checklistFilters.kartId,
          checklistFilters.type,
          checklistFilters.finalStatus,
          checklistFilters.period,
        ]);
      default:
        return 0;
    }
  }, [
    activeTab,
    kartFilters,
    inspectionFilters,
    maintenanceListFilters,
    checklistFilters,
  ]);

  const filterResultCount = useMemo(() => {
    switch (activeTab) {
      case "karts":
        return filteredFleet.length;
      case "inspecoes":
        return filteredInspections.length;
      case "manutencoes":
        return filteredMaintenances.length;
      case "checklists":
        return filteredChecklists.length;
      default:
        return 0;
    }
  }, [
    activeTab,
    filteredFleet.length,
    filteredInspections.length,
    filteredMaintenances.length,
    filteredChecklists.length,
  ]);

  const filterResultUnit = useMemo(() => {
    switch (activeTab) {
      case "karts":
        return "kart";
      case "inspecoes":
        return "inspeção";
      case "manutencoes":
        return "manutenção";
      case "checklists":
        return "checklist";
      default:
        return "resultado";
    }
  }, [activeTab]);

  const clearActiveFilters = () => {
    switch (activeTab) {
      case "karts":
        setKartFilters(DEFAULT_KART_FILTERS);
        break;
      case "inspecoes":
        setInspectionFilters(DEFAULT_INSPECTION_FILTERS);
        break;
      case "manutencoes":
        setMaintenanceListFilters(DEFAULT_MAINTENANCE_LIST_FILTERS);
        break;
      case "checklists":
        setChecklistFilters(DEFAULT_CHECKLIST_FILTERS);
        break;
    }
  };

  return (
    <>
      <AdminShell
        activeNav="manutencao"
        onNav={onNav}
        mobileTitle="Manutenção"
        pageHeader={
          <MaintenanceSimpleHeader
            onNewInspection={canEdit ? () => openInspection() : undefined}
            onAdvancedInspection={
              canEdit
                ? () => {
                    setInspectionKartId("");
                    setAdvancedInspectionOpen(true);
                  }
                : undefined
            }
            onNewMaintenance={canEdit ? () => openMaintenance() : undefined}
            onNewCompleteChecklist={canEdit ? () => openCompleteChecklist() : undefined}
            onOpenFilters={() => setFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
          />
        }
        fixedSubHeader={
          <MaintenanceSectionTabs active={activeTab} onChange={setActiveTab} />
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

        {isPageLoading ? (
          <AdminMaintenancePageSkeleton />
        ) : (
          <>
        {activeTab === "karts" ? (
          <AdminResponsiveKpis
            kpis={kpisDisplay}
            icons={KPI_ICONS}
            defaultIcon={HiWrench}
            desktopClassName="admin-page-grid grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8"
          />
        ) : null}

        <div
          role="tabpanel"
          id={`maintenance-panel-${activeTab}`}
          aria-labelledby={`maintenance-tab-${activeTab}`}
          className="admin-page-stack pb-10 lg:pb-12"
        >
          <ResponsiveTableFilters
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            onClear={clearActiveFilters}
            resultCount={filterResultCount}
            resultUnit={filterResultUnit}
            renderFilters={(layout) => {
              if (activeTab === "karts" && filterOptions) {
                return (
                  <MaintenanceSimpleFilters
                    layout={layout}
                    filters={kartFilters}
                    options={{
                      ...filterOptions,
                      karts: kartFilterOptions,
                    }}
                    onChange={(patch) =>
                      setKartFilters((p) => ({ ...p, ...patch }))
                    }
                    onClear={() => setKartFilters(DEFAULT_KART_FILTERS)}
                  />
                );
              }
              if (activeTab === "inspecoes") {
                return (
                  <InspectionListFilters
                    layout={layout}
                    karts={kartFilterOptions}
                    filters={inspectionFilters}
                    onChange={(patch) =>
                      setInspectionFilters((p) => ({ ...p, ...patch }))
                    }
                    onClear={() => setInspectionFilters(DEFAULT_INSPECTION_FILTERS)}
                  />
                );
              }
              if (activeTab === "manutencoes") {
                return (
                  <MaintenanceListFilters
                    layout={layout}
                    karts={kartFilterOptions}
                    filters={maintenanceListFilters}
                    onChange={(patch) =>
                      setMaintenanceListFilters((p) => ({ ...p, ...patch }))
                    }
                    onClear={() =>
                      setMaintenanceListFilters(DEFAULT_MAINTENANCE_LIST_FILTERS)
                    }
                  />
                );
              }
              if (activeTab === "checklists") {
                return (
                  <ChecklistListFilters
                    layout={layout}
                    karts={kartFilterOptions}
                    filters={checklistFilters}
                    onChange={(patch) =>
                      setChecklistFilters((p) => ({ ...p, ...patch }))
                    }
                    onClear={() => setChecklistFilters(DEFAULT_CHECKLIST_FILTERS)}
                  />
                );
              }
              return null;
            }}
          />

          {activeTab === "karts" ? (
            <MaintenanceKartFleet
              karts={paginatedFleet}
              mobileKarts={filteredFleet}
              page={kartsPage}
              pageSize={pageSize}
              totalItems={filteredFleet.length}
              onPageChange={setKartsPage}
              onPageSizeChange={setPageSize}
              onViewHistory={setHistoryKartId}
              onNewInspection={openInspection}
              onNewMaintenance={(id) => openMaintenance(id, null)}
            />
          ) : null}

          {activeTab === "inspecoes" ? (
            <MaintenanceInspectionsTable
              rows={paginatedInspections}
              mobileRows={filteredInspections}
              page={inspectionsPage}
              pageSize={pageSize}
              totalItems={filteredInspections.length}
              onPageChange={setInspectionsPage}
              onPageSizeChange={setPageSize}
              onNewInspection={openInspection}
            />
          ) : null}

          {activeTab === "manutencoes" ? (
            <MaintenanceMaintenancesTable
              rows={paginatedMaintenances}
              mobileRows={filteredMaintenances}
              page={maintenancesPage}
              pageSize={pageSize}
              totalItems={filteredMaintenances.length}
              onPageChange={setMaintenancesPage}
              onPageSizeChange={setPageSize}
              onViewDetails={setOrderDetailId}
            />
          ) : null}

          {activeTab === "checklists" ? (
            <MaintenanceChecklistsTable
              rows={paginatedChecklists}
              mobileRows={filteredChecklists}
              page={checklistsPage}
              pageSize={pageSize}
              totalItems={filteredChecklists.length}
              onPageChange={setChecklistsPage}
              onPageSizeChange={setPageSize}
              onView={setChecklistDetailId}
              onDuplicate={(id) => {
                const row = checklistHistory.find((r) => r.id === id);
                if (row) {
                  openCompleteChecklist(row.kartId);
                  handleSuccess(
                    `Checklist duplicado como rascunho para Kart ${String(row.kartNumber).padStart(2, "0")} (mock).`,
                  );
                }
              }}
              onExportPdf={(id) => {
                handleSuccess(`PDF do checklist ${id} gerado (mock).`);
              }}
            />
          ) : null}
        </div>
          </>
        )}
      </AdminShell>

      <SimpleInspectionDrawer
        open={inspectionOpen}
        karts={fleet}
        responsibles={responsibles}
        initialKartId={inspectionKartId}
        onClose={() => setInspectionOpen(false)}
        onSuccess={handleSuccess}
        onRequestMaintenance={(draft) => {
          setInspectionOpen(false);
          openMaintenance(draft.kartId, draft);
        }}
      />

      <NewInspectionModal
        open={advancedInspectionOpen}
        karts={fleet}
        initialKartId={inspectionKartId}
        onClose={() => setAdvancedInspectionOpen(false)}
        onSuccess={handleSuccess}
      />

      <SimpleMaintenanceDrawer
        open={maintenanceOpen}
        karts={fleet}
        initialKartId={maintenanceKartId}
        draftFromInspection={maintenanceDraft}
        onClose={handleMaintenanceClose}
        onSuccess={handleSuccess}
      />

      <CompleteChecklistDrawer
        open={checklistOpen}
        karts={fleet}
        responsibles={responsibles}
        initialKartId={checklistKartId}
        onClose={() => setChecklistOpen(false)}
        onSuccess={handleSuccess}
        onRequestMaintenances={processMaintenanceQueue}
      />

      <KartDetailDrawer
        kartId={historyKartId}
        focusHistory
        onClose={() => setHistoryKartId(null)}
      />

      <ChecklistDetailDrawer
        row={checklistDetailRow}
        onClose={() => setChecklistDetailId(null)}
        onDuplicate={(id) => {
          const row = checklistHistory.find((r) => r.id === id);
          setChecklistDetailId(null);
          if (row) openCompleteChecklist(row.kartId);
        }}
        onExportPdf={(id) => handleSuccess(`PDF do checklist ${id} gerado (mock).`)}
      />

      <MaintenanceDetailsDrawer
        orderId={orderDetailId}
        onClose={() => setOrderDetailId(null)}
      />
    </>
  );
}
