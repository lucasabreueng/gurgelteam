"use client";

import { HiPlus } from "react-icons/hi2";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";
import { TableFiltersButton } from "@/components/ui/table-filters-button";
import { AdminPageHeader } from "../admin-page-header";

type Props = {
  onNewKart?: () => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
};

export function KartsHeader({
  onNewKart,
  onOpenFilters,
  activeFilterCount = 0,
}: Props) {
  const { tabletLandscape } = useAdminPanelTabletLayout();

  return (
    <AdminPageHeader
      title="Karts"
      subtitle="Gerencie disponibilidade, manutenção, desempenho e histórico dos karts."
      actions={
        <>
          <TableFiltersButton
            onClick={() => onOpenFilters?.()}
            activeFilterCount={activeFilterCount}
            iconOnlyPortrait
          />
          {onNewKart ? (
            <button type="button" onClick={onNewKart} className="btn-primary-sm">
              <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
              {tabletLandscape ? "Novo" : "Novo kart"}
            </button>
          ) : null}
        </>
      }
      actionsClassName="admin-page-header-actions--tablet-compact"
    />
  );
}
