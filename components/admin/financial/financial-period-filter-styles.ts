export const FINANCIAL_PERIOD_FILTER_BAR_CLASS = "financial-period-filter-bar";

export const FINANCIAL_PERIOD_FILTER_CUSTOM_CLASS = "financial-period-filter-custom";

export function financialPeriodPresetButtonClass(active: boolean): string {
  return `rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
    active
      ? "bg-[#0d1f3c] text-white shadow-sm"
      : "bg-white text-neutral-600 ring-1 ring-[rgba(17,17,17,0.1)] hover:ring-accent/30"
  }`;
}

export function financialPeriodCustomButtonClass(active: boolean): string {
  return `${FINANCIAL_PERIOD_FILTER_CUSTOM_CLASS} inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
    active
      ? "bg-[#0d1f3c] text-white shadow-sm"
      : "bg-white text-neutral-600 ring-1 ring-[rgba(17,17,17,0.1)] hover:ring-accent/30"
  }`;
}
