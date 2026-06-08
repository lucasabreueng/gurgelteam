"use client";

import type { NewKartFormData, RegisteredMotor } from "@/lib/contracts/karts";

import { getAppServices } from "@/lib/data-source/app-services";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { useKartDetail } from "@/lib/query/hooks/use-karts";
import { useKartCategories } from "@/lib/query/hooks/use-kart-categories";
import { useKartTerms } from "@/lib/query/hooks/use-kart-terms";
import { resolveCategoryId } from "@/lib/reference-data/resolve-reference-ids";
import { queryKeys } from "@/lib/query/keys";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import {
  adminDrawerHeaderSimpleClass,
  adminDrawerPanelFormClass,
  adminDrawerSectionCardClass,
  adminDrawerTitleClass,
} from "@/lib/design";
import { KartPhotoField } from "./kart-photo-field";

const EMPTY_FORM: NewKartFormData = {
  ownershipType: "",
  clientId: "",
  number: "",
  categoryId: "",
  photo: "",
  motor: "",
  chassis: "",
  engineHours: "",
  lastMaintenanceDate: "",
  lastMaintenanceUnknown: false,
};

type Props = {
  open: boolean;
  onClose: () => void;
  /** Quando informado, abre em modo edição com dados do kart. */
  kartId?: string | null;
  onSuccess?: (data: NewKartFormData, mode: "create" | "edit") => void;
  onError?: (message: string) => void;
};

function buildFormFromDetail(
  detail: NonNullable<ReturnType<typeof useKartDetail>["data"]>,
  registeredMotors: RegisteredMotor[],
  registeredChassis: { id: string; name: string }[],
): NewKartFormData {
  const kart = detail.list;
  const motor = registeredMotors.find(
    (m) => m.name === kart.motor || m.id === kart.motor,
  );
  const chassis = registeredChassis.find(
    (c) => c.name === kart.chassis || c.id === kart.chassis,
  );

  return {
    ownershipType: kart.ownership,
    clientId: kart.clientId ?? "",
    number: String(kart.number),
    categoryId: resolveCategoryId(kart.categoryId),
    photo: kart.photo.startsWith("/images/gallery-1.jpg") ? "" : kart.photo,
    motor: motor?.id ?? "",
    chassis: chassis?.id ?? "",
    engineHours: String(kart.usageHours),
    lastMaintenanceDate: "",
    lastMaintenanceUnknown: true,
  };
}

export function NewKartDrawer({ open, onClose, kartId = null, onSuccess, onError }: Props) {
  const isEdit = Boolean(kartId);
  const queryClient = useQueryClient();
  const { data: detail } = useKartDetail(open && kartId ? kartId : null);
  const { data: kartTerms } = useKartTerms();
  const { data: kartCategories = [] } = useKartCategories();
  const kartsService = getAppServices().karts;
  const registeredMotors = useMemo(
    () =>
      kartTerms?.motors ??
      (getDataSourceMode() !== "http" ? kartsService.getRegisteredMotors() : []),
    [kartTerms?.motors, kartsService],
  );
  const registeredChassis = useMemo(
    () => kartTerms?.chassis ?? [],
    [kartTerms?.chassis],
  );
  const [form, setForm] = useState<NewKartFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  useDrawerBodyLock(open);

  useEffect(() => {
    if (!open) return;
    setSaveError(null);
    if (kartId && detail) {
      setForm(
        buildFormFromDetail(detail, registeredMotors, registeredChassis),
      );
    } else if (!kartId) {
      setForm(EMPTY_FORM);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, kartId, detail, registeredMotors, registeredChassis]);

  const isClientKart = form.ownershipType === "client";
  const hasMaintenanceDate =
    form.lastMaintenanceUnknown || form.lastMaintenanceDate.length > 0;

  const canSubmit =
    form.ownershipType !== "" &&
    form.number.trim().length > 0 &&
    form.categoryId.length > 0 &&
    form.motor.length > 0 &&
    form.chassis.length > 0 &&
    form.engineHours.trim().length > 0 &&
    (isEdit || hasMaintenanceDate) &&
    (!isClientKart || form.clientId.length > 0);

  const handleSubmit = () => {
    if (!canSubmit || saving) return;
    setSaveError(null);
    const payload = {
      ...form,
      number: form.number.trim(),
      engineHours: form.engineHours.trim(),
      photo: form.photo.startsWith("data:") ? "" : form.photo.trim(),
    };

    if (getDataSourceMode() !== "http") {
      onSuccess?.(payload, isEdit ? "edit" : "create");
      onClose();
      return;
    }

    setSaving(true);
    void (isEdit && kartId
      ? kartsService.updateKart(kartId, payload)
      : kartsService.createKart(payload)
    )
      .then(async () => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.karts.all });
        onClose();
        onSuccess?.(payload, isEdit ? "edit" : "create");
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível salvar o kart.";
        setSaveError(message);
        onError?.(message);
      })
      .finally(() => setSaving(false));
  };

  if (!open) return null;

  const ownershipOptions = kartsService.getOwnershipTypeOptions().map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const motorOptions = [
    { value: "", label: "Selecione o motor…" },
    ...registeredMotors.map((motor) => ({
      value: motor.id,
      label: motor.name,
    })),
  ];

  const chassisOptions = [
    { value: "", label: "Selecione o chassi…" },
    ...registeredChassis.map((chassis) => ({
      value: chassis.id,
      label: chassis.name,
    })),
  ];

  const categoryOptions = [
    { value: "", label: "Selecione a categoria…" },
    ...kartCategories.map((category) => ({
      value: category.id,
      label: category.name,
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
        className={adminDrawerPanelFormClass}
      >
        <header className={adminDrawerHeaderSimpleClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 id="new-kart-drawer-title" className={adminDrawerTitleClass}>
                {isEdit ? "Editar kart" : "Novo kart"}
              </h1>
              <p className="mt-1 text-sm text-[var(--ds-text-secondary)]">
                {isEdit
                  ? "Atualize os dados do kart na frota."
                  : "Cadastre um kart próprio ou de cliente na frota."}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-[var(--ds-text-muted)] hover:bg-[var(--ds-bg-muted)]"
              aria-label="Fechar"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className={`space-y-4 ${adminDrawerSectionCardClass}`}>
            <KartPhotoField
              value={form.photo}
              onChange={(photo) => setForm((prev) => ({ ...prev, photo }))}
            />

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

            <SettingsField label="Categoria">
              <SettingsDropdown
                aria-label="Categoria"
                options={categoryOptions}
                value={form.categoryId}
                onSelect={(value) =>
                  setForm((prev) => ({ ...prev, categoryId: value }))
                }
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

            <SettingsField label="Chassi">
              <SettingsDropdown
                aria-label="Chassi"
                options={chassisOptions}
                value={form.chassis}
                onSelect={(value) =>
                  setForm((prev) => ({ ...prev, chassis: value }))
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
            {saveError ? (
              <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {saveError}
              </p>
            ) : null}
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
                disabled={!canSubmit || saving}
                className="btn-primary-md disabled:opacity-50"
              >
                {saving
                  ? "Salvando…"
                  : isEdit
                    ? "Salvar alterações"
                    : "Salvar kart"}
              </button>
            </DrawerFooterActions>
          </div>
        </footer>
      </aside>
    </div>
  );
}
