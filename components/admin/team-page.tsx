"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type { IconType } from "react-icons/lib";
import { HiShieldCheck, HiUserGroup, HiUsers } from "react-icons/hi2";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { TeamMemberListItem } from "@/lib/contracts/team";
import { useTeamKpis, useTeamList } from "@/lib/query/hooks/use-team";
import { useModuleAccess } from "@/lib/query/hooks/use-module-access";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";
import { AdminShell } from "./admin-shell";
import { TeamHeader } from "./team/team-header";
import { TeamFilters, type TeamFilterState } from "./team/team-filters";
import { TeamTable } from "./team/team-table";
import { TeamMobileList } from "./team/team-mobile-list";
import { NewTeamDrawer, type NewTeamFormData } from "./team/new-team-drawer";
import { EditTeamDrawer } from "./team/edit-team-drawer";
import { ConfirmDialog } from "./settings/confirm-dialog";
import { resolveMemberPermissionProfileId } from "@/lib/team/staff-roles";
import { canRemoveTeamMember } from "@/lib/team/team-rules";
import { ResponsiveTableFilters } from "@/components/ui/responsive-table-filters";
import { AdminResponsiveKpis } from "./admin-responsive-kpis";
import {
  AdminKpiStripSkeleton,
  AdminTableSkeleton,
} from "./admin-page-skeletons";
import { AdminErrorState } from "./admin-error-state";

const ADMIN_NAV_HREF: Partial<Record<AdminNavKey, string>> = {
  dashboard: "/admin",
  agenda: "/admin/agenda",
  alunos: "/admin/clientes",
  equipe: "/admin/equipe",
  karts: "/admin/karts",
  manutencao: "/admin/manutencao",
  configuracoes: "/admin/configuracoes",
};

const KPI_ICONS: Record<string, IconType> = {
  total: HiUserGroup,
  ativos: HiUsers,
  admin: HiShieldCheck,
  operacao: HiUsers,
};

const DEFAULT_FILTERS: TeamFilterState = {
  search: "",
  permissionProfileId: "",
  status: "",
};

function matchesFilters(
  member: TeamMemberListItem,
  filters: TeamFilterState,
): boolean {
  const q = filters.search.trim().toLowerCase();
  if (q) {
    const haystack = [member.name, member.email, member.username, member.roleLabel]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (
    filters.permissionProfileId &&
    resolveMemberPermissionProfileId(member) !== filters.permissionProfileId
  ) {
    return false;
  }
  if (filters.status === "ativo" && !member.active) return false;
  if (filters.status === "inativo" && member.active) return false;
  return true;
}

function countActiveFilters(filters: TeamFilterState): number {
  let count = 0;
  if (filters.search.trim()) count += 1;
  if (filters.permissionProfileId) count += 1;
  if (filters.status) count += 1;
  return count;
}

export function TeamPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: members = [], isPending: listLoading, isError: listError, refetch } =
    useTeamList();
  const { data: kpis = [], isPending: kpisLoading, isError: kpisError, refetch: refetchKpis } =
    useTeamKpis();
  const isPageLoading = listLoading || kpisLoading;
  const isPageError = listError || kpisError;
  const { canEdit, canDelete } = useModuleAccess("equipe");

  const [filters, setFilters] = useState<TeamFilterState>(DEFAULT_FILTERS);
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [drawer, setDrawer] = useState<{
    id: string;
    mode: "view" | "edit";
  } | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  const onNav = useCallback(
    (key: AdminNavKey) => {
      const href = ADMIN_NAV_HREF[key];
      if (href) router.push(href);
    },
    [router],
  );

  const filtered = useMemo(
    () => members.filter((m) => matchesFilters(m, filters)),
    [members, filters],
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const drawerMember =
    members.find((m) => m.id === drawer?.id) ?? null;
  const pendingRemoveMember =
    members.find((m) => m.id === pendingRemoveId) ?? null;

  const handleRemove = async (id: string) => {
    const target = members.find((m) => m.id === id);
    if (!target || !canRemoveTeamMember(target)) return;
    setRemoving(true);
    try {
      await getAppServices().team.removeMember(id);
      invalidate();
      if (drawer?.id === id) setDrawer(null);
      setFeedback(`${target.name} foi removido da equipe.`);
      window.setTimeout(() => setFeedback(null), 5000);
    } finally {
      setRemoving(false);
      setPendingRemoveId(null);
    }
  };

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.team.list() });
    void queryClient.invalidateQueries({ queryKey: queryKeys.team.kpis() });
  };

  return (
    <>
      <AdminShell
        activeNav="equipe"
        onNav={onNav}
        mobileTitle="Equipe"
        pageHeader={
          <TeamHeader
            onNewUser={canEdit ? () => setNewUserOpen(true) : undefined}
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
              void refetch();
              void refetchKpis();
            }}
          />
        ) : isPageLoading ? (
          <>
            <AdminKpiStripSkeleton count={4} />
            <AdminTableSkeleton rows={6} />
          </>
        ) : (
          <>
            <AdminResponsiveKpis
              kpis={kpis}
              icons={KPI_ICONS}
              defaultIcon={HiUserGroup}
              desktopClassName="admin-page-grid grid grid-cols-2 min-[900px]:grid-cols-4"
              showDeltaBadge={false}
            />

            <ResponsiveTableFilters
              open={filtersOpen}
              onOpenChange={setFiltersOpen}
              onClear={() => setFilters(DEFAULT_FILTERS)}
              resultCount={filtered.length}
              resultUnit="usuário"
              renderFilters={(layout) => (
                <TeamFilters
                  layout={layout}
                  filters={filters}
                  onChange={(patch) =>
                    setFilters((prev) => ({ ...prev, ...patch }))
                  }
                  onClear={() => setFilters(DEFAULT_FILTERS)}
                />
              )}
            />

            <section className="hidden lg:block">
              <TeamTable
                members={paginated}
                page={page}
                pageSize={pageSize}
                totalItems={filtered.length}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
                onView={(id) => setDrawer({ id, mode: "view" })}
                onEdit={canEdit ? (id) => setDrawer({ id, mode: "edit" }) : undefined}
                onRemove={canDelete ? setPendingRemoveId : undefined}
              />
            </section>

            <TeamMobileList
              members={filtered}
              onView={(id) => setDrawer({ id, mode: "view" })}
            />
          </>
        )}
      </AdminShell>

      <NewTeamDrawer
        open={newUserOpen}
        onClose={() => setNewUserOpen(false)}
        onSuccess={async (data: NewTeamFormData) => {
          const created = await getAppServices().team.createMember(data);
          invalidate();
          setFeedback(
            `${created.name} foi adicionado à equipe. Um e-mail com link para definir a senha foi enviado.`,
          );
          window.setTimeout(() => setFeedback(null), 5000);
        }}
      />

      <EditTeamDrawer
        member={drawerMember}
        mode={drawer?.mode ?? "view"}
        onClose={() => setDrawer(null)}
        onSave={async (id, data) => {
          const updated = await getAppServices().team.updateMember(id, data);
          if (!updated) throw new Error("Usuário não encontrado.");
          invalidate();
          setFeedback(`${updated.name} atualizado.`);
          window.setTimeout(() => setFeedback(null), 5000);
        }}
      />

      <ConfirmDialog
        open={pendingRemoveId !== null}
        title="Remover usuário?"
        message={
          pendingRemoveMember
            ? `Tem certeza que deseja remover ${pendingRemoveMember.name} da equipe? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmLabel={removing ? "Removendo…" : "Remover"}
        cancelLabel="Cancelar"
        onConfirm={() => {
          if (pendingRemoveId) void handleRemove(pendingRemoveId);
        }}
        onCancel={() => setPendingRemoveId(null)}
      />
    </>
  );
}
