"use client";

import type { ReactNode } from "react";
import { HiXMark } from "react-icons/hi2";

import { adminCardClass } from "@/lib/design";

type Props = {
  active?: boolean;
  onClear?: () => void;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

/** Altura padrão dos campos de filtro (inputs e dropdowns). */
export const filterFieldHeightClass = "h-12 min-h-12";

const clearButtonClass = `flex ${filterFieldHeightClass} w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-border-field)] bg-[var(--ds-bg-muted)] text-[var(--ds-text-muted)] transition hover:border-accent/30 hover:bg-[var(--ds-bg-elevated)] hover:text-[var(--ds-text-primary)]`;

/** Container padrão de filtros com botão de limpar quando há filtros ativos. */
export function FilterBox({
  active,
  onClear,
  children,
  className,
  contentClassName = "p-4 md:px-5 md:py-4",
}: Props) {
  return (
    <div
      data-admin-filter-box
      className={[adminCardClass, contentClassName, className].filter(Boolean).join(" ")}
    >
      <div className="admin-filter-box-inner flex items-stretch gap-4">
        <div className="admin-filter-fields min-w-0 flex-1">{children}</div>
        {active && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className={clearButtonClass}
            aria-label="Limpar filtros"
          >
            <HiXMark className="h-5 w-5" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Retorna quantos filtros estão ativos (valor não vazio). */
export function countActiveFilters(values: readonly unknown[]): number {
  return values.filter((v) => v !== "" && v != null && v !== undefined).length;
}

/** Indica se há pelo menos um filtro ativo. */
export function filtersActive(values: readonly unknown[]): boolean {
  return countActiveFilters(values) > 0;
}
