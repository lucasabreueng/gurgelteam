"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  InspectionItemKey,
  InspectionItemRating,
  MaintenanceDraftFromInspection,
} from "@/lib/contracts/maintenance/simple";
import { INSPECTION_ITEM_LABELS } from "@/lib/contracts/maintenance/simple";
import type { MaintenanceFleetKart } from "@/lib/contracts/maintenance/simple";
import { ScheduleDrawerShell } from "@/components/admin/schedule/schedule-drawer-shell";
import { DrawerFooterActions } from "@/components/ui/drawer-footer";
import { ConfirmDialog } from "@/components/admin/settings/confirm-dialog";
import { SettingsDatePicker } from "@/components/admin/settings/settings-date-picker";
import { SettingsDropdown } from "@/components/admin/settings/settings-dropdown";
import {
  SettingsField,
  settingsTextareaClass,
} from "@/components/admin/settings/settings-section";

const ITEM_KEYS: InspectionItemKey[] = [
  "pneus",
  "corrente",
  "freios",
  "motor",
  "chassi",
  "direcao",
];

const RATING_OPTIONS: { value: InspectionItemRating; label: string }[] = [
  { value: "bom", label: "Bom" },
  { value: "atencao", label: "Atenção" },
  { value: "necessita_manutencao", label: "Necessita manutenção" },
];

const defaultItems = (): Record<InspectionItemKey, InspectionItemRating> => ({
  pneus: "bom",
  corrente: "bom",
  freios: "bom",
  motor: "bom",
  chassi: "bom",
  direcao: "bom",
});

type Props = {
  open: boolean;
  karts: MaintenanceFleetKart[];
  responsibles: { id: string; name: string }[];
  initialKartId?: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onRequestMaintenance: (draft: MaintenanceDraftFromInspection) => void;
};

export function SimpleInspectionDrawer({
  open,
  karts,
  responsibles,
  initialKartId = "",
  onClose,
  onSuccess,
  onRequestMaintenance,
}: Props) {
  const [kartId, setKartId] = useState(initialKartId);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [responsible, setResponsible] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState(defaultItems);
  const [confirmMaintenance, setConfirmMaintenance] = useState(false);

  useEffect(() => {
    if (!open) return;
    setKartId(initialKartId || karts[0]?.id || "");
    setDate(new Date().toISOString().slice(0, 10));
    setResponsible(responsibles[0]?.id ?? "");
    setNotes("");
    setItems(defaultItems());
    setConfirmMaintenance(false);
  }, [open, initialKartId, karts, responsibles]);

  const failedItems = useMemo(
    () =>
      ITEM_KEYS.filter((k) => items[k] === "necessita_manutencao").map((k) => ({
        key: k,
        label: INSPECTION_ITEM_LABELS[k],
      })),
    [items],
  );

  const canSubmit = Boolean(kartId && date && responsible);

  const finishInspection = (openMaintenance: boolean) => {
    const kart = karts.find((k) => k.id === kartId);
    if (!kart) return;

    onSuccess(
      `Inspeção do Kart ${String(kart.number).padStart(2, "0")} registrada.`,
    );

    if (openMaintenance && failedItems.length > 0) {
      const first = failedItems[0]!;
      onRequestMaintenance({
        kartId,
        category: first.key,
        description: `Manutenção sugerida na inspeção: ${first.label}.${notes ? ` ${notes}` : ""}`,
      });
    }

    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (failedItems.length > 0) {
      setConfirmMaintenance(true);
      return;
    }
    finishInspection(false);
  };

  const kartOptions = [
    { value: "", label: "Selecione o kart…" },
    ...karts.map((k) => ({
      value: k.id,
      label: `Kart ${String(k.number).padStart(2, "0")}`,
    })),
  ];

  const responsibleOptions = [
    { value: "", label: "Selecione…" },
    ...responsibles.map((r) => ({ value: r.id, label: r.name })),
  ];

  return (
    <>
      <ScheduleDrawerShell
        open={open}
        onClose={onClose}
        title="Nova inspeção"
        titleId="simple-inspection-title"
        description="Checklist rápido — sem burocracia."
        zIndexClass="z-[228]"
        footer={
          <DrawerFooterActions columns={2}>
            <button type="button" onClick={onClose} className="btn-outline-sm bg-white">
              Cancelar
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="btn-primary-md"
            >
              Salvar inspeção
            </button>
          </DrawerFooterActions>
        }
      >
        <div className="space-y-4 p-4 md:p-5">
          <div className="space-y-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
            <SettingsField label="Kart">
              <SettingsDropdown
                aria-label="Kart"
                options={kartOptions}
                value={kartId}
                onSelect={setKartId}
              />
            </SettingsField>
            <SettingsField label="Data da inspeção">
              <SettingsDatePicker
                aria-label="Data da inspeção"
                value={date}
                onChange={setDate}
              />
            </SettingsField>
            <SettingsField label="Responsável">
              <SettingsDropdown
                aria-label="Responsável"
                options={responsibleOptions}
                value={responsible}
                onSelect={setResponsible}
              />
            </SettingsField>
            <SettingsField label="Observações gerais">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Opcional"
                className={settingsTextareaClass}
              />
            </SettingsField>
          </div>

          <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Itens de inspeção
            </p>
            <ul className="mt-3 space-y-3">
              {ITEM_KEYS.map((key) => (
                <li key={key}>
                  <p className="mb-1.5 text-sm font-semibold text-[#0d1f3c]">
                    {INSPECTION_ITEM_LABELS[key]}
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {RATING_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setItems((prev) => ({ ...prev, [key]: opt.value }))
                        }
                        className={`w-full rounded-lg px-1 py-2.5 text-[10px] font-bold uppercase tracking-wide transition ${
                          items[key] === opt.value
                            ? opt.value === "bom"
                              ? "bg-emerald-600 text-white"
                              : opt.value === "atencao"
                                ? "bg-amber-500 text-white"
                                : "bg-red-600 text-white"
                            : "bg-[#fafbfc] text-neutral-600 ring-1 ring-[rgba(17,17,17,0.08)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ScheduleDrawerShell>

      <ConfirmDialog
        open={confirmMaintenance}
        title="Gerar manutenção?"
        message="Algum item foi marcado como “Necessita manutenção”. Deseja abrir o registro de manutenção com esses dados?"
        confirmLabel="Sim, abrir manutenção"
        cancelLabel="Não, só salvar inspeção"
        onConfirm={() => {
          setConfirmMaintenance(false);
          finishInspection(true);
        }}
        onCancel={() => {
          setConfirmMaintenance(false);
          finishInspection(false);
        }}
      />
    </>
  );
}
