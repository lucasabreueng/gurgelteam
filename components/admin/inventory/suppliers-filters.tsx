"use client";

import { HiMagnifyingGlass } from "react-icons/hi2";
import type { SupplierStatus } from "@/lib/contracts/inventory";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";
import {
  FilterBox,
  countActiveFilters,
  filterFieldHeightClass,
  filtersActive,
} from "@/components/ui/filter-box";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { settingsInputClass } from "../settings/settings-section";

const STATUS_OPTIONS = [
  { value: "", label: "Status" },
  ...(
    Object.entries(InventoryServiceMock.getSupplierStatusLabels()) as [
      SupplierStatus,
      string,
    ][]
  ).map(([value, label]) => ({ value, label })),
];

export type SuppliersFilterState = {
  query: string;
  status: SupplierStatus | "";
};

type Props = {
  filters: SuppliersFilterState;
  onChange: (patch: Partial<SuppliersFilterState>) => void;
  onClear?: () => void;
  layout?: "inline" | "stacked";
};

export function SuppliersFilters({
  filters,
  onChange,
  onClear,
  layout = "inline",
}: Props) {
  const isStacked = layout === "stacked";
  const fieldWrap = isStacked ? "w-full" : "w-full min-w-[11rem] lg:max-w-[12rem] lg:flex-1";
  const active = filtersActive([filters.query, filters.status]);

  const fields = (
    <>
      <div className={isStacked ? "relative w-full" : "relative min-w-[200px] flex-[2] lg:min-w-[240px]"}>
        <HiMagnifyingGlass
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Buscar fornecedor, código…"
          value={filters.query}
          onChange={(e) => onChange({ query: e.target.value })}
          className={`${settingsInputClass} ${filterFieldHeightClass} w-full pl-10`}
          aria-label="Buscar fornecedor"
        />
      </div>
      <div className={fieldWrap}>
        <SettingsDropdown
          aria-label="Status"
          options={STATUS_OPTIONS}
          value={filters.status}
          onSelect={(status) => onChange({ status: status as SupplierStatus | "" })}
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

export function countSuppliersFilters(filters: SuppliersFilterState): number {
  return countActiveFilters([filters.query, filters.status]);
}
