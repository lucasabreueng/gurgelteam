import { adminCardClass } from "@/lib/design";

export const PROFILE_COLUMN_WIDTH_CLASS = "xl:w-[320px]";

export const PROFILE_PANEL_SHELL_CLASS = adminCardClass;

export const PROFILE_PANEL_CLASS = `${PROFILE_PANEL_SHELL_CLASS} flex h-full min-h-0 flex-col overflow-hidden`;

export const PROFILE_PANEL_SCROLL_CLASS =
  "app-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-y-contain";

export const PROFILE_GRID_CLASS =
  "admin-page-grid grid min-h-0 flex-1 xl:grid-cols-[320px_minmax(0,1fr)_320px] xl:items-stretch";
