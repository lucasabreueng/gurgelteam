"use client";

import { HiMagnifyingGlass } from "react-icons/hi2";
import type { LessonRegistrationStatusFilterDTO } from "@/lib/contracts/lessons/lesson.types";
import {
  FilterBox,
  countActiveFilters,
  filterFieldHeightClass,
  filtersActive,
} from "@/components/ui/filter-box";
import { SettingsDatePicker } from "../settings/settings-date-picker";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { settingsInputClass } from "../settings/settings-section";

const STATUS_OPTIONS: {
  value: LessonRegistrationStatusFilterDTO;
  label: string;
}[] = [
  { value: "", label: "Todos os status" },
  { value: "pendentes", label: "Pendentes" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluidas", label: "Concluídas" },
];

export type LessonRegistrationFilterState = {
  search: string;
  statusFilter: LessonRegistrationStatusFilterDTO;
  category: string;
  selectedDate: string;
};

type Props = {
  filters: LessonRegistrationFilterState;
  categories: string[];
  onChange: (patch: Partial<LessonRegistrationFilterState>) => void;
  onClear?: () => void;
  layout?: "inline" | "stacked";
};

export function LessonRegistrationFilters({
  filters,
  categories,
  onChange,
  onClear,
  layout = "inline",
}: Props) {
  const isStacked = layout === "stacked";
  const categoryOptions = [
    { value: "", label: "Todas categorias" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];
  const active = filtersActive([
    filters.search,
    filters.statusFilter,
    filters.category,
  ]);

  const fields = (
    <>
      <div className={isStacked ? "relative w-full" : "relative min-w-[200px] flex-[2] xl:min-w-[240px]"}>
        <HiMagnifyingGlass
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Buscar piloto…"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className={`${settingsInputClass} ${filterFieldHeightClass} w-full pl-10`}
          aria-label="Buscar piloto"
        />
      </div>
      <div className={isStacked ? "w-full" : "w-full min-w-[11.5rem] shrink-0 sm:w-auto sm:min-w-[12.5rem]"}>
        <SettingsDatePicker
          aria-label="Data de referência"
          value={filters.selectedDate}
          onChange={(selectedDate) => onChange({ selectedDate })}
          lowercaseLabel
        />
      </div>
      <div
        className={
          isStacked
            ? "w-full"
            : "w-full min-w-[11.5rem] shrink-0 sm:min-w-[12.5rem] sm:flex-1 sm:max-w-[14rem]"
        }
      >
        <SettingsDropdown
          aria-label="Status"
          options={STATUS_OPTIONS}
          value={filters.statusFilter}
          onSelect={(statusFilter) =>
            onChange({ statusFilter: statusFilter as LessonRegistrationStatusFilterDTO })
          }
        />
      </div>
      <div
        className={
          isStacked
            ? "w-full"
            : "w-full min-w-[11.5rem] shrink-0 sm:min-w-[12.5rem] sm:flex-1 sm:max-w-[15rem]"
        }
      >
        <SettingsDropdown
          aria-label="Categoria"
          options={categoryOptions}
          value={filters.category}
          onSelect={(category) => onChange({ category })}
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
      <div className="flex flex-col gap-3 xl:flex-row xl:items-stretch">{fields}</div>
    </FilterBox>
  );
}

export function countLessonRegistrationFilters(
  filters: Pick<LessonRegistrationFilterState, "search" | "statusFilter" | "category">,
): number {
  return countActiveFilters([
    filters.search,
    filters.statusFilter,
    filters.category,
  ]);
}
