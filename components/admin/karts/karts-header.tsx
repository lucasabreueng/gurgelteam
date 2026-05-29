import { HiPlus } from "react-icons/hi2";
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
  return (
    <AdminPageHeader
      title="Karts"
      subtitle="Gerencie disponibilidade, manutenção, desempenho e histórico dos karts."
      actions={
        <>
          <TableFiltersButton
            onClick={() => onOpenFilters?.()}
            activeFilterCount={activeFilterCount}
          />
          <button type="button" onClick={onNewKart} className="btn-primary-sm lg:hidden">
            <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
            Novo kart
          </button>
          <button type="button" onClick={onNewKart} className="btn-primary-md hidden lg:inline-flex">
            <HiPlus className="h-4 w-4" aria-hidden />
            Novo kart
          </button>
        </>
      }
    />
  );
}
