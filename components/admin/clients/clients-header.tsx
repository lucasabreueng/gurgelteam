import {
  HiArrowDownTray,
  HiFunnel,
  HiPlus,
} from "react-icons/hi2";
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
  return (
    <AdminPageHeader
      title="Clientes"
      subtitle="Gerencie pilotos, acompanhe evolução e mantenha o relacionamento com os alunos."
      actions={
        <>
          <button
            type="button"
            onClick={onOpenFilters}
            className="btn-outline-sm relative lg:hidden"
          >
            <HiFunnel className="h-4 w-4 shrink-0" aria-hidden />
            Filtrar
            {activeFilterCount > 0 ? (
              <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>

          <button type="button" onClick={onExport} className="btn-outline-sm lg:hidden">
            <HiArrowDownTray className="h-4 w-4 shrink-0" aria-hidden />
            Exportar
          </button>
          <button type="button" onClick={onExport} className="btn-outline-md hidden lg:inline-flex">
            <HiArrowDownTray className="h-4 w-4" aria-hidden />
            Exportar lista
          </button>

          <button type="button" onClick={onNewClient} className="btn-primary-sm lg:hidden">
            <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
            Novo cliente
          </button>
          <button type="button" onClick={onNewClient} className="btn-primary-md hidden lg:inline-flex">
            <HiPlus className="h-4 w-4" aria-hidden />
            Novo cliente
          </button>
        </>
      }
    />
  );
}
