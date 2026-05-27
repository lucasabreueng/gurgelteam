"use client";

import { settingsInputClass } from "./settings-section";

function formatTimeInput(raw: string): string {
  const cleaned = raw.replace(/[^\d:]/g, "");
  if (cleaned.includes(":")) {
    const [h, m = ""] = cleaned.split(":");
    return `${h.slice(0, 2)}:${m.slice(0, 2)}`;
  }
  const digits = cleaned.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function isValidTime(value: string): boolean {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return false;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
};

/** Horário HH:mm com o mesmo visual dos demais campos de configurações. */
export function SettingsTimeInput({
  value,
  onChange,
  disabled,
  id,
  "aria-label": ariaLabel,
}: Props) {
  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${settingsInputClass} tabular-nums`}
      placeholder="08:00"
      maxLength={5}
      value={value}
      onChange={(e) => onChange(formatTimeInput(e.target.value))}
      onBlur={(e) => {
        const next = e.target.value.trim();
        if (!next) return;
        if (!isValidTime(next)) {
          onChange(isValidTime(value) ? value : "08:00");
        }
      }}
    />
  );
}
