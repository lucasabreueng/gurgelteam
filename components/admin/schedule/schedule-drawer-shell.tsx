"use client";

import { HiXMark } from "react-icons/hi2";
import type { ReactNode } from "react";

/** Largura padrão dos drawers da agenda admin. */
export const SCHEDULE_DRAWER_PANEL_CLASS =
  "relative flex h-full w-full max-w-full flex-col bg-[#f3f5f9] shadow-2xl lg:w-[min(100%,480px)] lg:max-w-[480px] lg:shrink-0";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  ariaLabel?: string;
  zIndexClass?: string;
};

export function ScheduleDrawerShell({
  open,
  onClose,
  title,
  titleId,
  description,
  children,
  footer,
  ariaLabel,
  zIndexClass = "z-[225]",
}: Props) {
  if (!open) return null;

  const headingId = titleId ?? "schedule-drawer-title";

  return (
    <div className={`fixed inset-0 ${zIndexClass} flex justify-end`}>
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        aria-labelledby={headingId}
        className={SCHEDULE_DRAWER_PANEL_CLASS}
      >
        <header className="shrink-0 border-b border-[rgba(17,17,17,0.08)] bg-white px-4 py-4 md:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2
                id={headingId}
                className="text-xl font-bold text-[#0d1f3c]"
              >
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-sm text-neutral-600">{description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
              aria-label="Fechar"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer ? (
          <footer className="shrink-0 border-t border-[rgba(17,17,17,0.08)] bg-white">
            {footer}
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
