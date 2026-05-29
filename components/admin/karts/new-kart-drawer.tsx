"use client";

import type { NewKartFormData } from "@/lib/contracts/karts";

import { KartsServiceMock } from "@/services/karts/kartsServiceMock";

import { useEffect, useState } from "react";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { HiXMark } from "react-icons/hi2";

import { SettingsCheckbox } from "../settings/settings-checkbox";
import { SettingsDatePicker } from "../settings/settings-date-picker";
import { SettingsDropdown } from "../settings/settings-dropdown";
import {
  SettingsField,
  settingsInputClass,
} from "../settings/settings-section";
import {
  DRAWER_FOOTER_INNER_CLASS,
  DRAWER_FOOTER_SHELL_CLASS,
  DrawerFooterActions,
} from "@/components/ui/drawer-footer";
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
  /** Quando informado, abre em modo edição com dados do kart. */
  kartId?: string | null;
  onSuccess?: (data: NewKartFormData) => void;
};

function formFromKartId(kartId: string): NewKartFormData {
  const detail = KartsServiceMock.getDetail(kartId);
  if (!detail) return EMPTY_FORM;

  const kart = detail.list;
  const motor = KartsServiceMock.getRegisteredMotors().find(
    (m) => m.name === kart.motor,
  );

  return {
    ownershipType: kart.ownership,
    clientId: "",
    number: String(kart.number),
    motor: motor?.id ?? "",
    engineHours: String(kart.usageHours),
    lastMaintenanceDate: "",
    lastMaintenanceUnknown: true,
  };
}

export function NewKartDrawer({ open, onClose, kartId = null, onSuccess }: Props) {
  const isEdit = Boolean(kartId);
  const [form, setForm] = useState<NewKartFormData>(EMPTY_FORM);
  useDrawerBodyLock(open);

  useEffect(() => {
    if (!open) return;
    setForm(kartId ? formFromKartId(kartId) : EMPTY_FORM);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, kartId]);

  const isClientKart = form.ownershipType === "client";
  const hasMaintenanceDate =
    form.lastMaintenanceUnknown || form.lastMaintenanceDate.length > 0;

  const canSubmit =
    form.ownershipType !== "" &&
    form.number.trim().length > 0 &&
    form.motor.length > 0 &&
    form.engineHours.trim().length > 0 &&
    (isEdit || hasMaintenanceDate) &&
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
    <div className="fixed inset-0 z-[228] flex max-lg:justify-stretch lg:justify-end">
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
        className="app-drawer-panel relative flex h-full w-full max-w-full flex-col bg-[#f3f5f9] shadow-2xl lg:max-w-[min(520px,92vw)] lg:shrink-0"
      >
        <header className="shrink-0 border-b border-[rgba(17,17,17,0.08)] bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1
                id="new-kart-drawer-title"
                className="text-xl font-bold text-[#0d1f3c]"
              >
                {isEdit ? "Editar kart" : "Novo kart"}
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                {isEdit
                  ? "Atualize os dados do kart na frota."
                  : "Cadastre um kart próprio ou de cliente na frota."}
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

            {!isEdit ? (
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
                        lastMaintenanceDate: checked
                          ? ""
                          : prev.lastMaintenanceDate,
                      }))
                    }
                    aria-label="Não sei a data da última manutenção"
                  />
                  <span className="text-sm font-medium text-neutral-600">
                    Não sei a data da última manutenção
                  </span>
                </label>
              </SettingsField>
            ) : null}
          </div>
        </div>

        <footer className={DRAWER_FOOTER_SHELL_CLASS}>
          <div className={DRAWER_FOOTER_INNER_CLASS}>
            <DrawerFooterActions columns={2}>
              <button
                type="button"
                onClick={onClose}
                className="btn-outline-md bg-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="btn-primary-md disabled:opacity-50"
              >
                {isEdit ? "Salvar alterações" : "Salvar kart"}
              </button>
            </DrawerFooterActions>
          </div>
        </footer>
      </aside>
    </div>
  );
}
