"use client";

import { HiMagnifyingGlass } from "react-icons/hi2";
import type { ClientStatus } from "@/lib/contracts/clients";
import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";
import type { KartCategory, SkillLevel } from "@/lib/contracts/settings";
import { FilterBox, filterFieldHeightClass, filtersActive } from "@/components/ui/filter-box";
import { adminCardClass, adminInputClass } from "@/lib/design";
import { SettingsDropdown } from "../settings/settings-dropdown";

export type ClientsFilterState = {
  search: string;
  categoryId: string;
  levelId: string;
  status: ClientStatus | "";
};

type Props = {
  filters: ClientsFilterState;
  onChange: (patch: Partial<ClientsFilterState>) => void;
  onClear?: () => void;
  kartCategories: KartCategory[];
  skillLevels: SkillLevel[];
  layout?: "inline" | "stacked";
};

export function ClientsFilters({
  filters,
  onChange,
  onClear,
  kartCategories,
  skillLevels,
  layout = "inline"}: Props) {
  const categoryOptions = [
    { value: "", label: "Categoria" },
    ...kartCategories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const levelOptions = [
    { value: "", label: "Nível" },
    ...skillLevels.map((l) => ({ value: l.id, label: l.name })),
  ];

  const statusOptions = [
    { value: "", label: "Status" },
    ...ClientsServiceMock.getFilterStatuses().map((s) => ({ value: s, label: s })),
  ];

  const isStacked = layout === "stacked";
  const fieldClass = isStacked ? "w-full" : "min-w-0 flex-1 lg:max-w-[200px]";
  const statusFieldClass = isStacked ? "w-full" : "min-w-0 flex-1 lg:max-w-[180px]";
  const active = filtersActive([
    filters.search,
    filters.categoryId,
    filters.levelId,
    filters.status,
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
          placeholder="Buscar por nome…"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
            className={`${adminInputClass} ${filterFieldHeightClass} w-full pl-10`}
          aria-label="Busca global"
        />
      </div>
      <div className={fieldClass}>
        <SettingsDropdown
          aria-label="Categoria"
          value={filters.categoryId}
          options={categoryOptions}
          onSelect={(categoryId) => onChange({ categoryId })}
        />
      </div>
      <div className={fieldClass}>
        <SettingsDropdown
          aria-label="Nível"
          value={filters.levelId}
          options={levelOptions}
          onSelect={(levelId) => onChange({ levelId })}
        />
      </div>
      <div className={statusFieldClass}>
        <SettingsDropdown
          aria-label="Status"
          value={filters.status}
          options={statusOptions}
          onSelect={(status) =>
            onChange({ status: status as ClientStatus | "" })
          }
        />
      </div>
    </>
  );

  if (isStacked) {
    return (
      <div className={`${adminCardClass} p-4`}>
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
