"use client";

import { HiMagnifyingGlass } from "react-icons/hi2";
import { AdminPageHeader } from "../admin-page-header";
import { SettingsDatePicker } from "../settings/settings-date-picker";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { settingsInputClass } from "../settings/settings-section";
import {
  FilterBox,
  filterFieldHeightClass,
  filtersActive,
} from "@/components/ui/filter-box";
import type {
  LessonRegistrationStatusFilterDTO,
} from "@/lib/contracts/lessons/lesson.types";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: LessonRegistrationStatusFilterDTO;
  onStatusFilterChange: (s: LessonRegistrationStatusFilterDTO) => void;
  category: string;
  onCategoryChange: (c: string) => void;
  categories: string[];
  selectedDate: string;
  onDateChange: (d: string) => void;
  onClearFilters: () => void;
};

const STATUS_OPTIONS: {
  value: LessonRegistrationStatusFilterDTO;
  label: string;
}[] =
  [
    { value: "", label: "Todos os status" },
    { value: "pendentes", label: "Pendentes" },
    { value: "em_andamento", label: "Em andamento" },
    { value: "concluidas", label: "Concluídas" },
  ];

export function LessonRegistrationHeader({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  category,
  onCategoryChange,
  categories,
  selectedDate,
  onDateChange,
  onClearFilters,
}: Props) {
  const categoryOptions = [
    { value: "", label: "Todas categorias" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  const filtersAreActive = filtersActive([search, statusFilter, category]);

  return (
    <div className="space-y-0">
      <div className="pb-4">
        <AdminPageHeader
          title="Central de Registro de Aulas"
          subtitle="Workflow operacional para registrar resultados das sessões realizadas."
        />
      </div>

      <div
        className="-mx-4 border-b border-[rgba(17,17,17,0.08)] md:-mx-[var(--admin-gap)]"
        aria-hidden
      />

      <div className="pt-4">
      <FilterBox active={filtersAreActive} onClear={onClearFilters}>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-stretch">
          <div className="relative min-w-[200px] flex-[2] xl:min-w-[240px]">
            <HiMagnifyingGlass
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Buscar piloto…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`${settingsInputClass} ${filterFieldHeightClass} w-full pl-10`}
              aria-label="Buscar piloto"
            />
          </div>

          <div className="w-full min-w-[11.5rem] shrink-0 sm:w-auto sm:min-w-[12.5rem]">
            <SettingsDatePicker
              aria-label="Data de referência"
              value={selectedDate}
              onChange={onDateChange}
              lowercaseLabel
            />
          </div>

          <div className="w-full min-w-[11.5rem] shrink-0 sm:min-w-[12.5rem] sm:flex-1 sm:max-w-[14rem]">
            <SettingsDropdown
              aria-label="Status"
              options={STATUS_OPTIONS}
              value={statusFilter}
              onSelect={(v) =>
                onStatusFilterChange(v as LessonRegistrationStatusFilterDTO)
              }
            />
          </div>

          <div className="w-full min-w-[11.5rem] shrink-0 sm:min-w-[12.5rem] sm:flex-1 sm:max-w-[15rem]">
            <SettingsDropdown
              aria-label="Categoria"
              options={categoryOptions}
              value={category}
              onSelect={onCategoryChange}
            />
          </div>
        </div>
      </FilterBox>
      </div>
    </div>
  );
}
