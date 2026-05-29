"use client";

import { HiFunnel } from "react-icons/hi2";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";

type Props = {
  onClick: () => void;
  activeFilterCount?: number;
  className?: string;
  /** Retrato mobile/tablet: só ícone, sem rótulo "Filtrar". */
  iconOnlyPortrait?: boolean;
};

/** Botão padrão para abrir filtros em mobile/tablet (< lg); oculto em tablet paisagem (filtros inline). */
export function TableFiltersButton({
  onClick,
  activeFilterCount = 0,
  className = "",
  iconOnlyPortrait = false,
}: Props) {
  const { tabletLandscape } = useAdminPanelTabletLayout();
  const visibilityClass = tabletLandscape ? "hidden" : "lg:hidden";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Filtrar"
      className={`btn-outline-sm relative ${visibilityClass} ${
        iconOnlyPortrait ? "table-filters-button--portrait-icon" : ""
      } ${className}`.trim()}
    >
      <HiFunnel className="h-4 w-4 shrink-0" aria-hidden />
      <span className="table-filters-button-label">Filtrar</span>
      {activeFilterCount > 0 ? (
        <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">
          {activeFilterCount}
        </span>
      ) : null}
    </button>
  );
}
