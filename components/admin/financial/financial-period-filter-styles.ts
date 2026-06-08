import {
  adminFilterPillActiveClass,
  adminFilterPillClass,
  adminIconButtonClass,
} from "@/lib/design";

export const FINANCIAL_PERIOD_FILTER_BAR_CLASS = "financial-period-filter-bar";

export const FINANCIAL_PERIOD_FILTER_CUSTOM_CLASS = "financial-period-filter-custom";

export function financialPeriodPresetButtonClass(active: boolean): string {
  return active ? adminFilterPillActiveClass : adminFilterPillClass;
}

export function financialPeriodCustomButtonClass(active: boolean): string {
  return `${FINANCIAL_PERIOD_FILTER_CUSTOM_CLASS} ${adminIconButtonClass} ${
    active ? "!border-accent !bg-accent !text-white" : ""
  }`;
}
