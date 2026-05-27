"use client";

import type { NewKartFormData } from "@/lib/contracts/karts";

import { KartsServiceMock } from "@/services/karts/kartsServiceMock";

import { useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";

import { SettingsCheckbox } from "../settings/settings-checkbox";
import { SettingsDatePicker } from "../settings/settings-date-picker";
import { SettingsDropdown } from "../settings/settings-dropdown";
import {
  SettingsField,
  settingsInputClass,
} from "../settings/settings-section";
import { ClientSearchDropdown } from "./client-search-dropdown";

const EMPTY_FORM: NewKartFormData = {
  ownershipType: "",
  clientId: "",
  number: "",
  motor: "",
  engineHours: "",
  lastMaintenanceDate: "",
  lastMaintenanceUnknown: false,
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (data: NewKartFormData) => void;
};

export function NewKartDrawer({ open, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<NewKartFormData>(EMPTY_FORM);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const isClientKart = form.ownershipType === "client";
  const hasMaintenanceDate =
    form.lastMaintenanceUnknown || form.lastMaintenanceDate.length > 0;

  const canSubmit =
    form.ownershipType !== "" &&
    form.number.trim().length > 0 &&
    form.motor.length > 0 &&
    form.engineHours.trim().length > 0 &&
    hasMaintenanceDate &&
    (!isClientKart || form.clientId.length > 0);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSuccess?.({
      ...form,
      number: form.number.trim(),
      engineHours: form.engineHours.trim(),
    });
    onClose();
  };

  if (!open) return null;

  const ownershipOptions = KartsServiceMock.getOwnershipTypeOptions().map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const motorOptions = [
    { value: "", label: "Selecione o motor…" },
    ...KartsServiceMock.getRegisteredMotors().map((motor) => ({
      value: motor.id,
      label: motor.name,
    })),
  ];

  return (
    <div className="fixed inset-0 z-[228] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-kart-drawer-title"
        className="relative flex h-full w-full max-w-full flex-col bg-[#f3f5f9] shadow-2xl lg:max-w-[min(520px,92vw)]"
      >
        <header className="shrink-0 border-b border-[rgba(17,17,17,0.08)] bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1
                id="new-kart-drawer-title"
                className="text-xl font-bold text-[#0d1f3c]"
              >
                Novo kart
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                Cadastre um kart próprio ou de cliente na frota.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100"
              aria-label="Fechar"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="space-y-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
            <SettingsField label="Tipo de kart">
              <SettingsDropdown
                aria-label="Tipo de kart"
                options={ownershipOptions}
                value={form.ownershipType}
                onSelect={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    ownershipType: value as NewKartFormData["ownershipType"],
                    clientId: value === "client" ? prev.clientId : "",
                  }))
                }
              />
            </SettingsField>

            <SettingsField label="Cliente">
              <ClientSearchDropdown
                aria-label="Cliente"
                value={form.clientId}
                disabled={!isClientKart}
                onSelect={(value) =>
                  setForm((prev) => ({ ...prev, clientId: value }))
                }
              />
            </SettingsField>

            <SettingsField label="Número do kart">
              <input
                type="number"
                min={1}
                value={form.number}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, number: e.target.value }))
                }
                placeholder="Ex.: 24"
                className={settingsInputClass}
              />
            </SettingsField>

            <SettingsField label="Motor">
              <SettingsDropdown
                aria-label="Motor"
                options={motorOptions}
                value={form.motor}
                onSelect={(value) =>
                  setForm((prev) => ({ ...prev, motor: value }))
                }
              />
            </SettingsField>

            <SettingsField label="Horas de motor">
              <input
                type="number"
                min={0}
                step={0.1}
                value={form.engineHours}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, engineHours: e.target.value }))
                }
                placeholder="Ex.: 412"
                className={settingsInputClass}
              />
            </SettingsField>

            <SettingsField label="Data da última manutenção">
              <SettingsDatePicker
                aria-label="Data da última manutenção"
                value={form.lastMaintenanceDate}
                disabled={form.lastMaintenanceUnknown}
                onChange={(isoDate) =>
                  setForm((prev) => ({
                    ...prev,
                    lastMaintenanceDate: isoDate,
                  }))
                }
                disableFuture
              />
              <label className="mt-3 flex cursor-pointer items-center gap-2.5">
                <SettingsCheckbox
                  checked={form.lastMaintenanceUnknown}
                  onChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      lastMaintenanceUnknown: checked,
                      lastMaintenanceDate: checked ? "" : prev.lastMaintenanceDate,
                    }))
                  }
                  aria-label="Não sei a data da última manutenção"
                />
                <span className="text-sm font-medium text-neutral-600">
                  Não sei a data da última manutenção
                </span>
              </label>
            </SettingsField>
          </div>
        </div>

        <footer className="shrink-0 border-t border-[rgba(17,17,17,0.08)] bg-white px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border border-[rgba(13,31,60,0.2)] px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/40"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="inline-flex items-center justify-center rounded-xl bg-[#0d1f3c] px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-white shadow-md disabled:opacity-50"
            >
              Salvar kart
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
