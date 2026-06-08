import type { SectorPerformance } from "@/lib/contracts/telemetry/sectors";
import {
  adminCardClass,
  adminFilterPillActiveClass,
  adminFilterPillClass,
  adminOutlineButtonClass,
  adminTableHeadRowClass,
} from "@/lib/design";

export const SECTOR_CARD = adminCardClass;

export const SECTOR_SECTION = `${SECTOR_CARD} p-5 md:p-6`;

/** @deprecated use SECTOR_SECTION */
export const PREMIUM_CARD = SECTOR_CARD;

export const SECTION_TITLE =
  "text-lg font-bold text-[var(--ds-text-primary)]";

export const SECTION_LABEL =
  "text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]";

export const INNER_TABLE =
  "overflow-x-auto rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-muted)] shadow-inner";

export const TABLE_HEAD = adminTableHeadRowClass;

export const BTN_FILTER_ACTIVE = adminFilterPillActiveClass;

export const BTN_FILTER_IDLE = adminFilterPillClass;

export const BTN_OUTLINE = adminOutlineButtonClass;

export const STAT_BOX =
  "rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-muted)] px-3 py-2.5";

export const SECTOR_STATUS_STYLES: Record<
  SectorPerformance,
  { dot: string; border: string; text: string; bar: string; bg: string }
> = {
  gain: {
    dot: "bg-[var(--ds-success-text)]",
    border: "border-[var(--ds-success-border)]",
    text: "text-[var(--ds-success-text)]",
    bar: "from-[var(--ds-success-text)] to-emerald-400",
    bg: "bg-[var(--ds-success-bg)]",
  },
  loss: {
    dot: "bg-[var(--ds-error-text)]",
    border: "border-[var(--ds-error-border)]",
    text: "text-[var(--ds-error-text)]",
    bar: "from-[var(--ds-error-text)] to-red-400",
    bg: "bg-[var(--ds-error-bg)]",
  },
  personal_best: {
    dot: "bg-violet-400",
    border: "border-violet-400/40",
    text: "text-violet-300",
    bar: "from-violet-500 to-violet-400",
    bg: "bg-violet-500/10",
  },
  neutral: {
    dot: "bg-[var(--ds-warning-text)]",
    border: "border-[var(--ds-warning-border)]",
    text: "text-[var(--ds-warning-text)]",
    bar: "from-[var(--ds-warning-text)] to-amber-300",
    bg: "bg-[var(--ds-warning-bg)]",
  },
};

/** @deprecated use useChartTheme() nos gráficos de setores */
export const CHART_LIGHT = {
  axisLine: { lineStyle: { color: "var(--ds-chart-grid)" } },
  axisLabel: { color: "var(--ds-chart-axis)", fontSize: 10 },
  splitLine: { lineStyle: { color: "var(--ds-chart-grid)" } },
  tooltip: {
    backgroundColor: "var(--ds-chart-tooltip-bg)",
    borderColor: "var(--ds-border)",
    textStyle: { color: "var(--ds-chart-tooltip-text)", fontSize: 11 },
  },
} as const;
