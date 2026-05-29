import { ADMIN_PANEL_TABLET_LANDSCAPE_MQ } from "@/lib/admin-panel-tablet-layout";

/** Telefone — layout mobile da telemetria (<768px). */
export const TELEMETRY_PHONE_MQ = "(max-width: 767px)";

/** Tablet em retrato (≥768px de largura) — telemetria exige paisagem. */
export const TELEMETRY_PORTRAIT_MQ = "(orientation: portrait) and (min-width: 768px)";

/** Tablet em paisagem — telemetria (mesmo critério do painel admin). */
export const TELEMETRY_TABLET_LANDSCAPE_MQ = ADMIN_PANEL_TABLET_LANDSCAPE_MQ;

export { ADMIN_SIDEBAR_COLLAPSED_WIDTH } from "@/lib/admin-panel-tablet-layout";

export function isTelemetryPhone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(TELEMETRY_PHONE_MQ).matches;
}

export function isTelemetryPortraitBlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(TELEMETRY_PORTRAIT_MQ).matches;
}

export function isTelemetryTabletLandscape(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(TELEMETRY_TABLET_LANDSCAPE_MQ).matches;
}
