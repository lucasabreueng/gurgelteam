import {
  HiClipboardDocumentCheck,
  HiCube,
  HiPlus,
  HiWrench,
} from "react-icons/hi2";
import { AdminPageHeader } from "../admin-page-header";

import { TableFiltersButton } from "@/components/ui/table-filters-button";

type Props = {
  onOpenChecklist: () => void;
  onRegisterPart: () => void;
  onNewInspection: () => void;
  onNewMaintenance: () => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
};

export function MaintenanceHeader({
  onOpenChecklist,
  onRegisterPart,
  onNewInspection,
  onNewMaintenance,
  onOpenFilters,
  activeFilterCount = 0,
}: Props) {
  return (
    <AdminPageHeader
      title="Manutenção"
      subtitle="Gerencie ordens de serviço, preventivas, revisões e liberação técnica dos karts."
      actions={
        <>
          <TableFiltersButton
            onClick={() => onOpenFilters?.()}
            activeFilterCount={activeFilterCount}
          />
          <button type="button" onClick={onOpenChecklist} className="btn-outline-md hidden xl:inline-flex">
            <HiClipboardDocumentCheck className="h-4 w-4" aria-hidden />
            Abrir checklist
          </button>
          <button type="button" onClick={onRegisterPart} className="btn-outline-md hidden xl:inline-flex">
            <HiCube className="h-4 w-4" aria-hidden />
            Registrar peça
          </button>
          <button type="button" onClick={onNewInspection} className="btn-outline-md hidden xl:inline-flex">
            <HiWrench className="h-4 w-4" aria-hidden />
            Nova inspeção
          </button>
          <button type="button" onClick={onNewMaintenance} className="btn-primary-md">
            <HiPlus className="h-4 w-4" aria-hidden />
            Nova manutenção
          </button>
        </>
      }
    />
  );
}
