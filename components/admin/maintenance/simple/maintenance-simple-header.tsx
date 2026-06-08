"use client";

import {
  HiClipboardDocumentCheck,
  HiClipboardDocumentList,
  HiPlus,
} from "react-icons/hi2";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";
import { AdminPageHeader } from "../../admin-page-header";
import { TableFiltersButton } from "@/components/ui/table-filters-button";

type Props = {
  onNewInspection?: () => void;
  onAdvancedInspection?: () => void;
  onNewMaintenance?: () => void;
  onNewCompleteChecklist?: () => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
};

export function MaintenanceSimpleHeader({
  onNewInspection,
  onAdvancedInspection,
  onNewMaintenance,
  onNewCompleteChecklist,
  onOpenFilters,
  activeFilterCount = 0,
}: Props) {
  const { tabletLandscape } = useAdminPanelTabletLayout();

  const inspectionLabel = tabletLandscape ? "Inspeção" : "Nova inspeção";
  const checklistLabel = tabletLandscape ? "Checklist" : "Checklist completo";
  const maintenanceLabel = tabletLandscape ? "Manutenção" : "Nova manutenção";

  return (
    <AdminPageHeader
      title="Manutenção"
      subtitle="Inspeções rápidas, manutenções e checklists completos."
      actions={
        <>
          <TableFiltersButton
            onClick={() => onOpenFilters?.()}
            activeFilterCount={activeFilterCount}
            iconOnlyPortrait
          />
          {onNewInspection ? (
            <button
              type="button"
              onClick={onNewInspection}
              className="btn-outline-sm"
            >
              <HiClipboardDocumentCheck className="h-4 w-4 shrink-0" aria-hidden />
              {inspectionLabel}
            </button>
          ) : null}
          {onAdvancedInspection ? (
            <button
              type="button"
              onClick={onAdvancedInspection}
              className="btn-outline-sm hidden lg:inline-flex"
              title="Inspeção técnica completa (módulos e diagrama)"
            >
              Inspeção técnica
            </button>
          ) : null}
          {onNewCompleteChecklist ? (
            <button
              type="button"
              onClick={onNewCompleteChecklist}
              className="btn-outline-sm"
            >
              <HiClipboardDocumentList className="h-4 w-4 shrink-0" aria-hidden />
              {checklistLabel}
            </button>
          ) : null}
          {onNewMaintenance ? (
            <button
              type="button"
              onClick={onNewMaintenance}
              className="btn-primary-sm"
            >
              <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
              {maintenanceLabel}
            </button>
          ) : null}
        </>
      }
      actionsClassName="admin-page-header-actions--tablet-compact"
    />
  );
}
