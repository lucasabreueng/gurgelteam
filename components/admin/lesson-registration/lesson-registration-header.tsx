"use client";

import { HiPlus } from "react-icons/hi2";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";
import { TableFiltersButton } from "@/components/ui/table-filters-button";
import { AdminPageHeader } from "../admin-page-header";

type Props = {
  onOpenFilters?: () => void;
  activeFilterCount?: number;
  onNewClass?: () => void;
};

export function LessonRegistrationHeader({
  onOpenFilters,
  activeFilterCount = 0,
  onNewClass,
}: Props) {
  const { tabletLandscape } = useAdminPanelTabletLayout();

  return (
    <AdminPageHeader
      title="Central de Registro de Aulas"
      subtitle="Workflow operacional para registrar resultados das sessões realizadas."
      actions={
        <>
          <TableFiltersButton
            onClick={() => onOpenFilters?.()}
            activeFilterCount={activeFilterCount}
            iconOnlyPortrait
          />
          {onNewClass ? (
            <button
              type="button"
              onClick={() => onNewClass()}
              className="btn-outline-sm"
            >
              <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
              {tabletLandscape ? "Aula" : "Nova aula"}
            </button>
          ) : null}
        </>
      }
      actionsClassName="admin-page-header-actions--tablet-compact"
    />
  );
}
