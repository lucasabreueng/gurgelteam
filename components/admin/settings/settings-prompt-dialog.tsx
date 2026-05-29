"use client";

import { useEffect, useState } from "react";

import { SettingsField, settingsInputClass } from "./settings-section";

type Props = {
  open: boolean;
  title: string;
  label: string;
  initialValue: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
};

export function SettingsPromptDialog({
  open,
  title,
  label,
  initialValue,
  confirmLabel = "Salvar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: Props) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

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
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-prompt-title"
        className="w-full max-w-md rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="settings-prompt-title"
          className="text-lg font-bold text-[#0d1f3c]"
        >
          {title}
        </h2>
        <div className="mt-4">
          <SettingsField label={label}>
            <input
              className={settingsInputClass}
              value={value}
              autoFocus
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && value.trim()) {
                  onConfirm(value.trim());
                }
              }}
            />
          </SettingsField>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[rgba(13,31,60,0.2)] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:bg-[#fafbfc]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={!value.trim()}
            onClick={() => onConfirm(value.trim())}
            className="rounded-xl bg-[#0d1f3c] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
