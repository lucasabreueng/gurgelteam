"use client";

import { HiPlus } from "react-icons/hi2";
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
  return (
    <AdminPageHeader
      title="Central de Registro de Aulas"
      subtitle="Workflow operacional para registrar resultados das sessões realizadas."
      actions={
        <>
          <TableFiltersButton
            onClick={() => onOpenFilters?.()}
            activeFilterCount={activeFilterCount}
          />
          <button
            type="button"
            onClick={() => onNewClass?.()}
            className="btn-outline-md"
          >
            <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
            Nova aula
          </button>
        </>
      }
    />
  );
}
