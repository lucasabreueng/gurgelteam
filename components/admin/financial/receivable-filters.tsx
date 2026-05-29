"use client";

import { HiMagnifyingGlass } from "react-icons/hi2";
import type { ReceivableStatus } from "@/lib/contracts/finance/finance.types";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";
import {
  FilterBox,
  countActiveFilters,
  filterFieldHeightClass,
  filtersActive,
} from "@/components/ui/filter-box";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { settingsInputClass } from "../settings/settings-section";

export type ReceivableFilterState = {
  query: string;
  status: ReceivableStatus | "";
  method: string;
  service: string;
};

type Props = {
  filters: ReceivableFilterState;
  onChange: (patch: Partial<ReceivableFilterState>) => void;
  onClear?: () => void;
  layout?: "inline" | "stacked";
};

export function ReceivableFilters({
  filters,
  onChange,
  onClear,
  layout = "inline",
}: Props) {
  const isStacked = layout === "stacked";
  const fieldWrap = isStacked ? "w-full" : "w-full min-w-[11rem] lg:max-w-[12rem] lg:flex-1";
  const active = filtersActive([
    filters.query,
    filters.status,
    filters.method,
    filters.service,
  ]);

  const methodOptions = [
    { value: "", label: "Pagamento" },
    ...FinancialServiceMock.getReceivablePaymentMethods().map((m) => ({
      value: m,
      label: m,
    })),
    { value: "Boleto", label: "Boleto" },
  ];

  const serviceOptions = [
    { value: "", label: "Serviço" },
    ...FinancialServiceMock.getReceivableServices().map((s) => ({
      value: s,
      label: s,
    })),
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
          placeholder="Buscar cliente, serviço…"
          value={filters.query}
          onChange={(e) => onChange({ query: e.target.value })}
          className={`${settingsInputClass} ${filterFieldHeightClass} w-full pl-10`}
          aria-label="Buscar título"
        />
      </div>
      <div className={fieldWrap}>
        <SettingsDropdown
          aria-label="Status"
          options={FinancialServiceMock.getReceivableFilterOptions().map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          value={filters.status}
          onSelect={(status) => onChange({ status: status as ReceivableStatus | "" })}
        />
      </div>
      <div className={fieldWrap}>
        <SettingsDropdown
          aria-label="Forma de pagamento"
          options={methodOptions}
          value={filters.method}
          onSelect={(method) => onChange({ method })}
        />
      </div>
      <div className={fieldWrap}>
        <SettingsDropdown
          aria-label="Serviço"
          options={serviceOptions}
          value={filters.service}
          onSelect={(service) => onChange({ service })}
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

export function countReceivableFilters(filters: ReceivableFilterState): number {
  return countActiveFilters([
    filters.query,
    filters.status,
    filters.method,
    filters.service,
  ]);
}
