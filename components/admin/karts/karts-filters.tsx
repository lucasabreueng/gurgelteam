"use client";

import type { KartOwnership } from "@/lib/contracts/karts";
import type { KartFleetFilterStatus } from "@/lib/admin-karts-mocks";

import { KartsServiceMock } from "@/services/karts/kartsServiceMock";

import { HiMagnifyingGlass } from "react-icons/hi2";

import { FilterBox, filterFieldHeightClass, filtersActive } from "@/components/ui/filter-box";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { settingsInputClass } from "../settings/settings-section";

export type KartsFilterState = {
  search: string;
  ownership: KartOwnership | "";
  categoryId: string;
  status: KartFleetFilterStatus;
  maintenance: string;
};

type Props = {
  filters: KartsFilterState;
  onChange: (patch: Partial<KartsFilterState>) => void;
  onClear?: () => void;
  layout?: "inline" | "stacked";
};

export function KartsFilters({
  filters,
  onChange,
  onClear,
  layout = "inline",
}: Props) {
  const typeOptions = [
    { value: "", label: "Tipo" },
    { value: "rental", label: "Próprio" },
    { value: "client", label: "Cliente" },
  ];
  const categoryOptions = [
    { value: "", label: "Categoria" },
    ...KartsServiceMock.getFilterCategories().map((c) => ({ value: c.id, label: c.name })),
  ];
  const statusOptions = [
    { value: "", label: "Status" },
    ...KartsServiceMock.getFilterStatuses().map((s) => ({ value: s.value, label: s.label })),
  ];
  const maintOptions = KartsServiceMock.getMaintenanceWindows().map((m) => ({
    value: m.value,
    label: m.label,
  }));

  const isStacked = layout === "stacked";
  const dropdownCell = isStacked ? "w-full" : "min-w-0 flex-1";
  const active = filtersActive([
    filters.search,
    filters.ownership,
    filters.categoryId,
    filters.status,
    filters.maintenance,
  ]);

  const fields = (
    <>
        <div className={isStacked ? "relative w-full" : "relative min-w-[200px] flex-[2]"}>
          <HiMagnifyingGlass
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Número, motor, chassi ou proprietário…"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className={`${settingsInputClass} ${filterFieldHeightClass} h-full w-full pl-10`}
            aria-label="Busca"
          />
        </div>
        <div
          className={
            isStacked
              ? "flex flex-col gap-4"
              : "admin-page-grid grid min-w-0 flex-1 grid-cols-2 sm:grid-cols-4"
          }
        >
          <div className={dropdownCell}>
            <SettingsDropdown
              aria-label="Tipo"
              value={filters.ownership}
              options={typeOptions}
              onSelect={(v) => onChange({ ownership: v as KartOwnership | "" })}
            />
          </div>
          <div className={dropdownCell}>
            <SettingsDropdown
              aria-label="Categoria"
              value={filters.categoryId}
              options={categoryOptions}
              onSelect={(categoryId) => onChange({ categoryId })}
            />
          </div>
          <div className={dropdownCell}>
            <SettingsDropdown
              aria-label="Status"
              value={filters.status}
              options={statusOptions}
              onSelect={(v) => onChange({ status: v as KartFleetFilterStatus })}
            />
          </div>
          <div className={dropdownCell}>
            <SettingsDropdown
              aria-label="Manutenção preventiva"
              value={filters.maintenance}
              options={maintOptions}
              onSelect={(maintenance) => onChange({ maintenance })}
            />
          </div>
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">{fields}</div>
    </FilterBox>
  );
}

export function hasActiveKartsFilters(filters: KartsFilterState): boolean {
  return filtersActive([
    filters.search,
    filters.ownership,
    filters.categoryId,
    filters.status,
    filters.maintenance,
  ]);
}
