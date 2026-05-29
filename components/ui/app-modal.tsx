"use client";

import { useEffect, useId, type ReactNode } from "react";
import { HiXMark } from "react-icons/hi2";

type MaxWidth = "md" | "lg" | "2xl";

const MAX_WIDTH_CLASS: Record<MaxWidth, string> = {
  md: "max-w-md",
  lg: "max-w-lg",
  "2xl": "max-w-2xl",
};

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: MaxWidth;
  /** Impede fechar por Escape, backdrop ou botão X */
  preventClose?: boolean;
};

export function AppModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "lg",
  preventClose = false,
}: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !preventClose) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, preventClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0d1f3c]/50 backdrop-blur-[2px]"
        aria-label="Fechar"
        disabled={preventClose}
        onClick={() => {
          if (!preventClose) onClose();
        }}
      />
      <div
        className={`relative flex max-h-[min(85vh,720px)] w-full ${MAX_WIDTH_CLASS[maxWidth]} flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_24px_64px_rgba(13,31,60,0.2)]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[rgba(17,17,17,0.06)] px-6 py-5">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-lg font-bold text-[#0d1f3c]"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-[13px] leading-relaxed text-neutral-600">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={preventClose}
            className="shrink-0 rounded-lg p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-[#0d1f3c] disabled:opacity-40"
            aria-label="Fechar"
          >
            <HiXMark className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto app-modal-scroll px-6 py-5">{children}</div>
        {footer ? (
          <div className="border-t border-[rgba(17,17,17,0.06)] px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
