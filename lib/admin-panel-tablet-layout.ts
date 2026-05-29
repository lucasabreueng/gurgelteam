/** Tablet em paisagem — layout sem header + sidebar rail (768–1366px). */
export const ADMIN_PANEL_TABLET_LANDSCAPE_MQ =
  "(orientation: landscape) and (min-width: 768px) and (max-width: 1366px)";

export const ADMIN_SIDEBAR_COLLAPSED_WIDTH = 72;

export function isAdminPanelTabletLandscape(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(ADMIN_PANEL_TABLET_LANDSCAPE_MQ).matches;
}
