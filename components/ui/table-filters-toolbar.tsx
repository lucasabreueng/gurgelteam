"use client";

import { TableFiltersButton } from "./table-filters-button";

type Props = {
  onOpen: () => void;
  activeFilterCount?: number;
};

/** Barra com botão Filtrar acima de tabelas (quando não há no page header). */
export function TableFiltersToolbar({ onOpen, activeFilterCount = 0 }: Props) {
  return (
    <div className="flex justify-end lg:hidden">
      <TableFiltersButton onClick={onOpen} activeFilterCount={activeFilterCount} />
    </div>
  );
}
