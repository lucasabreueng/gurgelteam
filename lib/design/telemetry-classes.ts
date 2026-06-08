import {
  adminCardClass,
  adminFilterPillActiveClass,
  adminFilterPillClass,
  adminOutlineButtonClass,
} from "./classes";

/** Fundo do workspace de telemetria (comparação, setores, vazio). */
export const telemetryWorkspaceBgClass = "bg-[var(--ds-bg-page)]";

/** Toolbar superior da área de telemetria. */
export const telemetryToolbarClass =
  "relative shrink-0 border-b border-[var(--ds-border)] bg-[var(--ds-bg-card)]";

export const telemetryBtnBaseClass =
  "rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition";

export const telemetryBtnIdleClass =
  "border border-[var(--ds-border-field)] bg-[var(--ds-bg-card)] text-[var(--ds-text-secondary)] hover:border-accent/30 hover:bg-[var(--ds-bg-muted)]";

export const telemetryBtnActiveClass = "bg-accent text-white shadow-sm";

export const telemetryIconBtnClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition";

export const telemetryAsideClass =
  "flex min-h-0 flex-col border-r border-[var(--ds-border)] bg-[var(--ds-bg-card)]";

export const telemetryAsideRightClass =
  "flex min-h-0 flex-col border-l border-[var(--ds-border)] bg-[var(--ds-bg-card)]";

export const telemetryAsideHeaderClass =
  "shrink-0 border-b border-[var(--ds-border)] px-3 py-2";

export const telemetryCenterColumnClass =
  "flex min-h-0 min-w-0 flex-col bg-[var(--ds-bg-page)]";

export const telemetryStripHeaderClass =
  "flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-b border-[var(--ds-border)] bg-[var(--ds-bg-card)] px-3 py-2";

export const telemetryStripFooterClass =
  "shrink-0 border-t border-[var(--ds-border)] bg-[var(--ds-bg-card)] p-2";

export const telemetryChartCellClass =
  "flex min-h-0 flex-1 flex-col rounded-md border border-[var(--ds-border-subtle)] bg-[var(--ds-bg-card)] px-2 py-1 transition";

export const telemetryChartCellHeatClass =
  "border-accent/35 ring-1 ring-accent/20";

export const telemetryChartLabelClass =
  "shrink-0 text-[10px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]";

export const telemetryLapLegendClass =
  "inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--ds-text-secondary)]";

export const telemetryStatLabelClass =
  "text-[10px] uppercase tracking-wide text-[var(--ds-text-muted)]";

export const telemetryMapTitleClass =
  "min-w-0 truncate text-[12px] font-semibold text-[var(--ds-text-primary)]";

export const telemetryMapMetaClass =
  "shrink-0 font-mono text-[11px] tabular-nums text-[var(--ds-text-muted)]";

export const telemetryHeatLegendClass =
  "pointer-events-none absolute bottom-4 left-4 right-4 z-10 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-card)]/95 px-3 py-2 shadow-[var(--ds-shadow-card)] backdrop-blur-sm";

export const telemetryEmptyCardClass = `${adminCardClass} max-w-md px-8 py-10`;

export const telemetryLoadingTextClass =
  "text-sm font-medium text-[var(--ds-text-secondary)]";

export const telemetryBestBadgeClass =
  "rounded bg-[var(--ds-warning-bg)] px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--ds-warning-text)] ring-1 ring-[var(--ds-warning-border)]";

export const telemetryOutlineBtnClass = adminOutlineButtonClass;

export function telemetrySectorTabClass(active: boolean): string {
  return `w-full rounded-lg px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
    active ? adminFilterPillActiveClass : adminFilterPillClass
  }`;
}

export function telemetryLapButtonClass(opts: {
  selected: boolean;
  isBest: boolean;
}): string {
  const base =
    "flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition";
  if (opts.selected) {
    if (opts.isBest) {
      return `${base} border-[var(--ds-warning-border)] bg-[var(--ds-warning-bg)]`;
    }
    return `${base} border-[var(--ds-border-strong)] bg-[var(--ds-bg-muted)]`;
  }
  if (opts.isBest) {
    return `${base} border-[var(--ds-warning-border)]/50 bg-[var(--ds-warning-bg)]/50 hover:bg-[var(--ds-warning-bg)]`;
  }
  return `${base} border-transparent bg-transparent hover:bg-[var(--ds-bg-muted)]`;
}

export function telemetryLapTitleClass(isBest: boolean): string {
  return `text-[12px] font-semibold ${
    isBest ? "text-[var(--ds-warning-text)]" : "text-[var(--ds-text-primary)]"
  }`;
}
