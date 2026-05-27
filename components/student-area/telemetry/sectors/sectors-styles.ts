import type { SectorPerformance } from "@/lib/contracts/telemetry/sectors";

/** Card padrão da área do piloto (light). */
export const SECTOR_CARD =
  "rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)]";

export const SECTOR_SECTION =
  `${SECTOR_CARD} p-5 md:p-6`;

/** @deprecated use SECTOR_SECTION */
export const PREMIUM_CARD = SECTOR_CARD;

export const SECTION_TITLE = "text-lg font-bold text-[#0d1f3c]";

export const SECTION_LABEL =
  "text-[11px] font-bold uppercase tracking-wider text-neutral-500";

export const INNER_TABLE =
  "overflow-x-auto rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fdfdfd] shadow-inner";

export const TABLE_HEAD =
  "border-b border-[rgba(17,17,17,0.08)] bg-neutral-100/80 text-[10px] font-bold uppercase tracking-wider text-neutral-600";

export const BTN_FILTER_ACTIVE =
  "rounded-xl bg-[#0d1f3c] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm";

export const BTN_FILTER_IDLE =
  "rounded-xl border border-[rgba(17,17,17,0.12)] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600 transition hover:border-accent/30 hover:bg-neutral-50";

export const BTN_OUTLINE =
  "inline-flex shrink-0 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.12)] bg-white px-4 py-2 text-sm font-semibold text-accent shadow-sm transition hover:border-accent/30 hover:bg-neutral-50";

export const STAT_BOX =
  "rounded-xl border border-[rgba(17,17,17,0.08)] bg-neutral-50/80 px-3 py-2.5";

export const SECTOR_STATUS_STYLES: Record<
  SectorPerformance,
  { dot: string; border: string; text: string; bar: string; bg: string }
> = {
  gain: {
    dot: "bg-emerald-500",
    border: "border-emerald-200",
    text: "text-emerald-700",
    bar: "from-emerald-500 to-emerald-400",
    bg: "bg-emerald-50/80",
  },
  loss: {
    dot: "bg-red-500",
    border: "border-red-200",
    text: "text-red-700",
    bar: "from-red-500 to-red-400",
    bg: "bg-red-50/80",
  },
  personal_best: {
    dot: "bg-violet-500",
    border: "border-violet-200",
    text: "text-violet-700",
    bar: "from-violet-500 to-violet-400",
    bg: "bg-violet-50/80",
  },
  neutral: {
    dot: "bg-amber-500",
    border: "border-amber-200",
    text: "text-amber-800",
    bar: "from-amber-400 to-amber-300",
    bg: "bg-amber-50/80",
  },
};

export const CHART_LIGHT = {
  axisLine: { lineStyle: { color: "#cbd5e1" } },
  axisLabel: { color: "#64748b", fontSize: 10 },
  splitLine: { lineStyle: { color: "#e2e8f0" } },
  tooltip: {
    backgroundColor: "#ffffff",
    borderColor: "rgba(17,17,17,0.1)",
    textStyle: { color: "#0d1f3c", fontSize: 11 },
  },
} as const;
