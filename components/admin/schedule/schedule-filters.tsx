"use client";

import { HiMagnifyingGlass } from "react-icons/hi2";
import { useScheduleMeta } from "@/lib/query/hooks/use-schedule";
import { FilterBox, filtersActive } from "@/components/ui/filter-box";
import { settingsInputClass } from "../settings/settings-section";

export type ScheduleFilterState = {
  search: string;
  instructorId: string;
  kart: string;
  type: string;
  status: string;
  category: string;
  timeSlot: string;
};

type Props = {
  filters: ScheduleFilterState;
  onChange: (patch: Partial<ScheduleFilterState>) => void;
  onClear?: () => void;
};

const selectClass = `${settingsInputClass} min-h-[40px] w-full text-sm`;

export function ScheduleFilters({ filters, onChange, onClear }: Props) {
  const { data: meta } = useScheduleMeta();
  const active = filtersActive([
    filters.search,
    filters.instructorId,
    filters.kart,
    filters.type,
    filters.status,
    filters.category,
    filters.timeSlot,
  ]);

  return (
    <FilterBox active={active} onClear={onClear} contentClassName="p-4 md:p-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="relative md:col-span-2 xl:col-span-2">
          <span className="sr-only">Busca global</span>
          <HiMagnifyingGlass
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
            aria-hidden
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Buscar aluno, kart, horário…"
            className={`${settingsInputClass} min-h-[44px] w-full pl-10`}
          />
        </label>
        <select
          value={filters.kart}
          onChange={(e) => onChange({ kart: e.target.value })}
          className={selectClass}
          aria-label="Kart"
        >
          <option value="">Todos karts</option>
          {[5, 7, 12, 18, 3, 6].map((n) => (
            <option key={n} value={String(n)}>
              Kart {n}
            </option>
          ))}
        </select>
        <select
          value={filters.type}
          onChange={(e) => onChange({ type: e.target.value })}
          className={selectClass}
          aria-label="Tipo"
        >
          {(meta?.eventTypeOptions ?? []).map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          className={selectClass}
          aria-label="Status"
        >
          {(meta?.eventStatusOptions ?? []).map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className={selectClass}
          aria-label="Categoria"
        >
          {(meta?.categoryFilterOptions ?? []).map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={filters.timeSlot}
          onChange={(e) => onChange({ timeSlot: e.target.value })}
          className={selectClass}
          aria-label="Horário"
        >
          <option value="">Todos horários</option>
          {(meta?.timeSlots ?? []).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </FilterBox>
  );
}
