"use client";

import { HiPlus } from "react-icons/hi2";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";
import { TableFiltersButton } from "@/components/ui/table-filters-button";
import { AdminPageHeader } from "../admin-page-header";

type Props = {
  onNewUser?: () => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
};

export function TeamHeader({
  onNewUser,
  onOpenFilters,
  activeFilterCount = 0,
}: Props) {
  const { tabletLandscape } = useAdminPanelTabletLayout();

  return (
    <AdminPageHeader
      title="Equipe"
      subtitle="Gerencie contas internas, funções e acesso ao painel administrativo."
      actions={
        <>
          {onOpenFilters ? (
            <TableFiltersButton
              onClick={onOpenFilters}
              activeFilterCount={activeFilterCount}
              iconOnlyPortrait
            />
          ) : null}
          {onNewUser ? (
            <button type="button" onClick={onNewUser} className="btn-primary-sm">
              <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
              {tabletLandscape ? "Novo" : "Novo usuário"}
            </button>
          ) : null}
        </>
      }
      actionsClassName="admin-page-header-actions--tablet-compact"
    />
  );
}
