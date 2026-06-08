"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  hideCancel?: boolean;
  secondaryConfirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onSecondaryConfirm?: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
  hideCancel = false,
  secondaryConfirmLabel,
  onConfirm,
  onCancel,
  onSecondaryConfirm,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black/55 p-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="w-full max-w-md rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-bold text-[#0d1f3c]"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-desc"
          className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600"
        >
          {message}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          {!hideCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-[rgba(13,31,60,0.2)] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:bg-[#fafbfc]"
            >
              {cancelLabel}
            </button>
          ) : null}
          {secondaryConfirmLabel && onSecondaryConfirm ? (
            <button
              type="button"
              onClick={onSecondaryConfirm}
              className="rounded-xl border border-[rgba(13,31,60,0.2)] bg-[#fafbfc] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:bg-white"
            >
              {secondaryConfirmLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onConfirm}
            className={
              hideCancel
                ? "w-full rounded-xl bg-[#0d1f3c] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 sm:w-auto"
                : "rounded-xl bg-[#c41e3a] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
