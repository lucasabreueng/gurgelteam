"use client";

import type { MaintenanceStatus, MaintenancePriority, MaintenanceType } from "@/lib/contracts/maintenance";

import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";

import { HiMagnifyingGlass } from "react-icons/hi2";

import { FilterBox, filterFieldHeightClass, filtersActive } from "@/components/ui/filter-box";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { settingsInputClass } from "../settings/settings-section";

export type MaintenanceFilterState = {
  search: string;
  priority: MaintenancePriority | "";
  status: MaintenanceStatus | "";
  type: MaintenanceType | "";
  mechanicId: string;
  categoryId: string;
};

type Props = {
  filters: MaintenanceFilterState;
  onChange: (patch: Partial<MaintenanceFilterState>) => void;
  onClear?: () => void;
  layout?: "inline" | "stacked";
};

export function MaintenanceFilters({
  filters,
  onChange,
  onClear,
  layout = "inline",
}: Props) {
  const priorityOptions = [
    { value: "", label: "Prioridade" },
    ...MaintenanceServiceMock.getFilterPriorities().map((p) => ({
      value: p.value,
      label: p.label,
    })),
  ];
  const statusOptions = [
    { value: "", label: "Status" },
    ...MaintenanceServiceMock.getFilterStatuses().map((s) => ({
      value: s.value,
      label: s.label,
    })),
  ];
  const typeOptions = [
    { value: "", label: "Tipo" },
    ...MaintenanceServiceMock.getFilterTypes().map((t) => ({
      value: t.value,
      label: t.label,
    })),
  ];
  const mechanicOptions = [
    { value: "", label: "Responsável" },
    ...MaintenanceServiceMock.getMechanics().map((m) => ({
      value: m.id,
      label: m.name,
    })),
  ];
  const categoryOptions = [
    { value: "", label: "Categoria" },
    ...MaintenanceServiceMock.getKartCategories().map((c) => ({
      value: c.id,
      label: c.name,
    })),
  ];

  const isStacked = layout === "stacked";
  const cell = isStacked ? "w-full" : "min-w-0 flex-1";
  const active = filtersActive([
    filters.search,
    filters.priority,
    filters.status,
    filters.type,
    filters.mechanicId,
    filters.categoryId,
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
            placeholder="Kart, OS, peça ou mecânico…"
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
              : "admin-page-grid grid min-w-0 flex-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
          }
        >
          <div className={cell}>
            <SettingsDropdown
              aria-label="Prioridade"
              value={filters.priority}
              options={priorityOptions}
              onSelect={(v) =>
                onChange({ priority: v as MaintenancePriority | "" })
              }
            />
          </div>
          <div className={cell}>
            <SettingsDropdown
              aria-label="Status"
              value={filters.status}
              options={statusOptions}
              onSelect={(v) =>
                onChange({ status: v as MaintenanceStatus | "" })
              }
            />
          </div>
          <div className={cell}>
            <SettingsDropdown
              aria-label="Tipo de manutenção"
              value={filters.type}
              options={typeOptions}
              onSelect={(v) => onChange({ type: v as MaintenanceType | "" })}
            />
          </div>
          <div className={cell}>
            <SettingsDropdown
              aria-label="Responsável"
              value={filters.mechanicId}
              options={mechanicOptions}
              onSelect={(mechanicId) => onChange({ mechanicId })}
            />
          </div>
          <div className={cell}>
            <SettingsDropdown
              aria-label="Categoria do kart"
              value={filters.categoryId}
              options={categoryOptions}
              onSelect={(categoryId) => onChange({ categoryId })}
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
