"use client";

import { HiMagnifyingGlass } from "react-icons/hi2";
import type { StockLevel } from "@/lib/contracts/parts";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";
import {
  FilterBox,
  countActiveFilters,
  filterFieldHeightClass,
  filtersActive,
} from "@/components/ui/filter-box";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { settingsInputClass } from "../settings/settings-section";

export type PartsFilterState = {
  query: string;
  category: string;
  supplier: string;
  health: StockLevel | "";
};

type Props = {
  filters: PartsFilterState;
  onChange: (patch: Partial<PartsFilterState>) => void;
  onClear?: () => void;
  layout?: "inline" | "stacked";
};

export function PartsFilters({
  filters,
  onChange,
  onClear,
  layout = "inline",
}: Props) {
  const isStacked = layout === "stacked";
  const fieldWrap = isStacked ? "w-full" : "w-full min-w-[11rem] lg:max-w-[12rem] lg:flex-1";
  const active = filtersActive([
    filters.query,
    filters.category,
    filters.supplier,
    filters.health,
  ]);

  const categoryOptions = [
    { value: "", label: "Categoria" },
    ...InventoryServiceMock.getCategories().map((c) => ({ value: c, label: c })),
  ];

  const supplierOptions = [
    { value: "", label: "Fornecedor" },
    ...InventoryServiceMock.getSupplierNames().map((s) => ({ value: s, label: s })),
  ];

  const fields = (
    <>
      <div className={isStacked ? "relative w-full" : "relative min-w-[200px] flex-[2] lg:min-w-[240px]"}>
        <HiMagnifyingGlass
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Buscar peça, código…"
          value={filters.query}
          onChange={(e) => onChange({ query: e.target.value })}
          className={`${settingsInputClass} ${filterFieldHeightClass} w-full pl-10`}
          aria-label="Buscar peça"
        />
      </div>
      <div className={fieldWrap}>
        <SettingsDropdown
          aria-label="Categoria"
          options={categoryOptions}
          value={filters.category}
          onSelect={(category) => onChange({ category })}
        />
      </div>
      <div className={fieldWrap}>
        <SettingsDropdown
          aria-label="Saúde do estoque"
          options={InventoryServiceMock.getStockHealthFilterOptions().map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          value={filters.health}
          onSelect={(health) => onChange({ health: health as StockLevel | "" })}
        />
      </div>
      <div className={fieldWrap}>
        <SettingsDropdown
          aria-label="Fornecedor"
          options={supplierOptions}
          value={filters.supplier}
          onSelect={(supplier) => onChange({ supplier })}
        />
      </div>
    </>
  );

  if (isStacked) {
    return (
      <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
        <div className="flex flex-col gap-4">{fields}</div>
      </div>
    );
  }

  return (
    <FilterBox active={active} onClear={onClear}>
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-stretch">
        {fields}
      </div>
    </FilterBox>
  );
}

export function countPartsFilters(filters: PartsFilterState): number {
  return countActiveFilters([
    filters.query,
    filters.category,
    filters.supplier,
    filters.health,
  ]);
}
