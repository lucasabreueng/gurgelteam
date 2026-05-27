"use client";

import { useMemo } from "react";
import { SearchableSelectDropdown } from "./searchable-select-dropdown";
import { useInventoryParts } from "./use-inventory-parts";

type Props = {
  value: string;
  onSelect: (partId: string) => void;
  disabled?: boolean;
};

export function PartSearchDropdown({ value, onSelect, disabled }: Props) {
  const parts = useInventoryParts();

  const options = useMemo(
    () =>
      parts.map((p) => ({
        value: p.id,
        label: `${p.name} (${p.code})`,
      })),
    [parts],
  );

  return (
    <SearchableSelectDropdown
      value={value}
      onSelect={onSelect}
      options={options}
      emptyLabel="Peça"
      searchPlaceholder="Buscar peça…"
      disabled={disabled || options.length === 0}
      aria-label="Peça"
    />
  );
}
