"use client";

import type { ReactNode } from "react";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";
import { TableFiltersSheet } from "./table-filters-sheet";

export type TableFilterLayout = "inline" | "stacked";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClear?: () => void;
  resultCount?: number;
  /** Singular: "cliente", "kart", "título" */
  resultUnit?: string;
  renderFilters: (layout: TableFilterLayout) => ReactNode;
};

function applyLabel(count: number, unit: string): string {
  const plural = count === 1 ? unit : `${unit}s`;
  return `Ver ${count} ${plural}`;
}

/** Filtros inline no desktop e tablet paisagem; sheet acionado por botão no mobile. */
export function ResponsiveTableFilters({
  open,
  onOpenChange,
  onClear,
  resultCount,
  resultUnit = "resultado",
  renderFilters,
}: Props) {
  const { tabletLandscape } = useAdminPanelTabletLayout();

  return (
    <>
      <div className={tabletLandscape ? "block" : "hidden lg:block"}>
        {renderFilters("inline")}
      </div>
      <TableFiltersSheet
        open={open}
        onClose={() => onOpenChange(false)}
        onClear={onClear}
        applyLabel={
          resultCount != null ? applyLabel(resultCount, resultUnit) : undefined
        }
      >
        {renderFilters("stacked")}
      </TableFiltersSheet>
    </>
  );
}
