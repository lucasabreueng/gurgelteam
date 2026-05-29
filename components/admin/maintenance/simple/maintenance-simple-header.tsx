import {
  HiClipboardDocumentCheck,
  HiClipboardDocumentList,
  HiPlus,
} from "react-icons/hi2";
import { AdminPageHeader } from "../../admin-page-header";
import { TableFiltersButton } from "@/components/ui/table-filters-button";

type Props = {
  onNewInspection: () => void;
  onNewMaintenance: () => void;
  onNewCompleteChecklist: () => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
};

export function MaintenanceSimpleHeader({
  onNewInspection,
  onNewMaintenance,
  onNewCompleteChecklist,
  onOpenFilters,
  activeFilterCount = 0,
}: Props) {
  return (
    <AdminPageHeader
      title="Manutenção"
      subtitle="Inspeções rápidas, manutenções e checklists completos."
      actions={
        <>
          <TableFiltersButton
            onClick={() => onOpenFilters?.()}
            activeFilterCount={activeFilterCount}
          />
          <button
            type="button"
            onClick={onNewInspection}
            className="btn-outline-sm lg:btn-outline-md"
          >
            <HiClipboardDocumentCheck className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">Nova inspeção</span>
            <span className="lg:hidden">Inspeção</span>
          </button>
          <button
            type="button"
            onClick={onNewCompleteChecklist}
            className="btn-outline-sm lg:btn-outline-md"
          >
            <HiClipboardDocumentList className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">Checklist completo</span>
            <span className="lg:hidden">Checklist</span>
          </button>
          <button
            type="button"
            onClick={onNewMaintenance}
            className="btn-primary-sm lg:btn-primary-md"
          >
            <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">Nova manutenção</span>
            <span className="lg:hidden">Manutenção</span>
          </button>
        </>
      }
      actionsClassName="admin-page-header-actions--tablet-compact"
    />
  );
}
