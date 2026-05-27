"use client";

import type { ReactNode } from "react";
import { HiXMark } from "react-icons/hi2";

type Props = {
  active?: boolean;
  onClear?: () => void;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const boxClass =
  "rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)]";

/** Altura padrão dos campos de filtro (inputs e dropdowns). */
export const filterFieldHeightClass = "h-12 min-h-12";

const clearButtonClass = `flex ${filterFieldHeightClass} w-12 shrink-0 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] text-neutral-500 transition hover:border-accent/30 hover:bg-white hover:text-[#0d1f3c]`;

/** Container padrão de filtros com botão de limpar quando há filtros ativos. */
export function FilterBox({
  active,
  onClear,
  children,
  className,
  contentClassName = "p-4 md:px-5 md:py-4",
}: Props) {
  return (
    <div className={[boxClass, contentClassName, className].filter(Boolean).join(" ")}>
      <div className="flex items-stretch gap-4">
        <div className="min-w-0 flex-1">{children}</div>
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

export function filtersActive(values: Array<string | number | boolean | null | undefined>): boolean {
  return values.some((v) => {
    if (typeof v === "string") return v.trim().length > 0;
    if (typeof v === "number") return true;
    if (typeof v === "boolean") return v;
    return false;
  });
}
