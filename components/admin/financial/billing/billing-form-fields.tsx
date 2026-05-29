"use client";

import { SettingsField } from "../../settings/settings-section";
import { settingsInputClass } from "../../settings/settings-section";
import { formatBrazilDateInput } from "@/lib/brazil-date-input";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
};

export function BillingDateInput({
  label,
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  error,
}: Props) {
  return (
    <SettingsField label={label}>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(formatBrazilDateInput(e.target.value))}
        placeholder={placeholder}
        maxLength={10}
        className={settingsInputClass}
        aria-label={label}
      />
      {error ? <p className="text-[12px] font-medium text-[#c41e3a]">{error}</p> : null}
    </SettingsField>
  );
}

export function BillingAttachmentField() {
  return (
    <SettingsField label="Anexo">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-6 text-center transition hover:border-accent/30">
        <span className="text-[11px] font-bold uppercase text-neutral-500">
          Nota fiscal, recibo ou comprovante
        </span>
        <span className="mt-1 text-xs text-neutral-400">PNG, JPG ou PDF (mock)</span>
        <input type="file" className="sr-only" accept="image/*,.pdf" multiple />
      </label>
    </SettingsField>
  );
}
