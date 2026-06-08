"use client";

import { HiCheck } from "react-icons/hi2";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
};

/** Checkbox no padrão visual da aplicação (caixa customizada, sem input nativo). */
export function SettingsCheckbox({
  checked,
  onChange,
  disabled,
  id,
  "aria-label": ariaLabel,
}: Props) {
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition focus-visible:outline-none focus-visible:border-accent ${
        checked
          ? "border-accent bg-accent text-white"
          : "border-[var(--ds-border-field)] bg-[var(--ds-bg-input)] hover:border-accent/30"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {checked ? <HiCheck className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : null}
    </button>
  );
}
