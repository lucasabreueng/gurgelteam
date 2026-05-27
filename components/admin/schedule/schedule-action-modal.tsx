"use client";

import { useEffect, type ReactNode } from "react";
import { HiXMark } from "react-icons/hi2";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidthClass?: string;
  /** Permite dropdowns e painéis absolutos sobrepor footer/conteúdo. */
  contentOverflow?: "auto" | "visible";
};

export function ScheduleActionModal({
  open,
  onClose,
  title,
  titleId = "schedule-action-modal-title",
  description,
  children,
  footer,
  maxWidthClass = "max-w-md",
  contentOverflow = "auto",
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const dialogOverflow =
    contentOverflow === "visible" ? "overflow-visible" : "overflow-hidden";
  const bodyOverflow =
    contentOverflow === "visible"
      ? "overflow-visible"
      : "min-h-0 flex-1 overflow-y-auto app-scrollbar";

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex w-full ${maxWidthClass} max-h-[min(90vh,720px)] flex-col ${dialogOverflow} rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[rgba(17,17,17,0.08)] px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-bold text-[#0d1f3c]">
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
        </header>

        <div className={`px-5 py-4 ${bodyOverflow}`}>
          {children}
        </div>

        {footer ? (
          <footer className="shrink-0 border-t border-[rgba(17,17,17,0.08)] px-5 py-4">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
