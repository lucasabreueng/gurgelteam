"use client";

import {
  HiArrowDownTray,
  HiPlus,
} from "react-icons/hi2";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";
import { TableFiltersButton } from "@/components/ui/table-filters-button";
import { AdminPageHeader } from "../admin-page-header";

type Props = {
  onNewClient?: () => void;
  onExport?: () => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
};

export function ClientsHeader({
  onNewClient,
  onExport,
  onOpenFilters,
  activeFilterCount = 0,
}: Props) {
  const { tabletLandscape } = useAdminPanelTabletLayout();

  return (
    <AdminPageHeader
      title="Clientes"
      subtitle="Gerencie pilotos, acompanhe evolução e mantenha o relacionamento com os alunos."
      actions={
        <>
          {onOpenFilters ? (
            <TableFiltersButton
              onClick={onOpenFilters}
              activeFilterCount={activeFilterCount}
              iconOnlyPortrait
            />
          ) : null}
          <button type="button" onClick={onExport} className="btn-outline-sm">
            <HiArrowDownTray className="h-4 w-4 shrink-0" aria-hidden />
            {tabletLandscape ? "Exportar" : "Exportar lista"}
          </button>
          {onNewClient ? (
            <button type="button" onClick={onNewClient} className="btn-primary-sm">
              <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
              {tabletLandscape ? "Novo" : "Novo cliente"}
            </button>
          ) : null}
        </>
      }
      actionsClassName="admin-page-header-actions--tablet-compact"
    />
  );
}
