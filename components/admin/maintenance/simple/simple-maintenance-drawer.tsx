"use client";

import { useEffect, useState } from "react";
import type {
  MaintenanceCategory,
  MaintenanceDraftFromInspection,
  MaintenanceFleetKart,
  MaintenancePartLine,
  SimpleMaintenanceStatus,
  SimpleMaintenanceType,
} from "@/lib/contracts/maintenance/simple";
import { INSPECTION_ITEM_LABELS } from "@/lib/contracts/maintenance/simple";
import { ScheduleDrawerShell } from "@/components/admin/schedule/schedule-drawer-shell";
import { DrawerFooterActions } from "@/components/ui/drawer-footer";
import { setKartStatusByNumber } from "@/lib/karts-runtime-store";
import { ConfirmDialog } from "@/components/admin/settings/confirm-dialog";
import { SettingsDatePicker } from "@/components/admin/settings/settings-date-picker";
import { SettingsDropdown } from "@/components/admin/settings/settings-dropdown";
import {
  SettingsField,
  settingsInputClass,
  settingsTextareaClass,
} from "@/components/admin/settings/settings-section";
import { HiPlus, HiTrash } from "react-icons/hi2";

const CATEGORY_OPTIONS: { value: MaintenanceCategory; label: string }[] = [
  { value: "pneus", label: "Pneus" },
  { value: "corrente", label: "Corrente" },
  { value: "freios", label: "Freios" },
  { value: "motor", label: "Motor" },
  { value: "chassi", label: "Chassi" },
  { value: "direcao", label: "Direção" },
  { value: "outros", label: "Outros" },
];

const TYPE_OPTIONS = [
  { value: "preventiva", label: "Preventiva" },
  { value: "corretiva", label: "Corretiva" },
];

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
];

const emptyPart = (): MaintenancePartLine => ({
  name: "",
  quantity: 1,
  unitValueCents: 0,
});

type Props = {
  open: boolean;
  karts: MaintenanceFleetKart[];
  initialKartId?: string;
  draftFromInspection?: MaintenanceDraftFromInspection | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

export function SimpleMaintenanceDrawer({
  open,
  karts,
  initialKartId = "",
  draftFromInspection = null,
  onClose,
  onSuccess,
}: Props) {
  const [kartId, setKartId] = useState("");
  const [type, setType] = useState<SimpleMaintenanceType>("corretiva");
  const [category, setCategory] = useState<MaintenanceCategory>("outros");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<SimpleMaintenanceStatus>("pendente");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [cost, setCost] = useState("");
  const [parts, setParts] = useState<MaintenancePartLine[]>([]);
  const [confirmFinance, setConfirmFinance] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    setKartId(
      draftFromInspection?.kartId || initialKartId || karts[0]?.id || "",
    );
    setType("corretiva");
    setCategory(draftFromInspection?.category ?? "outros");
    setDescription(draftFromInspection?.description ?? "");
    setStatus(draftFromInspection ? "pendente" : "pendente");
    setDate(new Date().toISOString().slice(0, 10));
    setCost("");
    setParts([]);
    setConfirmFinance(false);
  }, [open, initialKartId, draftFromInspection, karts]);

  const costCents = Math.round(parseFloat(cost.replace(",", ".") || "0") * 100);

  const canSubmit =
    Boolean(kartId && description.trim() && date) &&
    !Number.isNaN(costCents);

  const completeSave = (createExpense: boolean) => {
    const kart = karts.find((k) => k.id === kartId);
    const label = kart
      ? `Kart ${String(kart.number).padStart(2, "0")}`
      : "Kart";

    if (kart) {
      if (status === "concluida") {
        setKartStatusByNumber(kart.number, "disponivel");
      } else {
        setKartStatusByNumber(kart.number, "manutencao");
      }
    }

    let msg = `Manutenção registrada para ${label}.`;
    if (createExpense && costCents > 0) {
      msg += ` Despesa de ${(costCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} criada no financeiro (mock).`;
    }

    onSuccess(msg);
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (status === "concluida" && costCents > 0) {
      const kart = karts.find((k) => k.id === kartId);
      setPendingMessage(
        `Manutenção em ${kart ? `Kart ${kart.number}` : "kart"} concluída.`,
      );
      setConfirmFinance(true);
      return;
    }
    completeSave(false);
  };

  const kartOptions = [
    { value: "", label: "Selecione o kart…" },
    ...karts.map((k) => ({
      value: k.id,
      label: `Kart ${String(k.number).padStart(2, "0")}`,
    })),
  ];

  return (
    <>
      <ScheduleDrawerShell
        open={open}
        onClose={onClose}
        title="Nova manutenção"
        titleId="simple-maintenance-title"
        description={
          draftFromInspection
            ? `Origem: inspeção — ${
                draftFromInspection.category in INSPECTION_ITEM_LABELS
                  ? INSPECTION_ITEM_LABELS[
                      draftFromInspection.category as keyof typeof INSPECTION_ITEM_LABELS
                    ]
                  : "Outros"
              }`
            : "Registro rápido para o box."
        }
        zIndexClass="z-[229]"
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
              Salvar manutenção
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
            <SettingsField label="Tipo de manutenção">
              <SettingsDropdown
                aria-label="Tipo"
                options={TYPE_OPTIONS}
                value={type}
                onSelect={(v) => setType(v as SimpleMaintenanceType)}
              />
            </SettingsField>
            <SettingsField label="Categoria">
              <SettingsDropdown
                aria-label="Categoria"
                options={CATEGORY_OPTIONS}
                value={category}
                onSelect={(v) => setCategory(v as MaintenanceCategory)}
              />
            </SettingsField>
            <SettingsField label="Descrição">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={settingsTextareaClass}
                placeholder="Ex.: Troca de corrente, revisão de freios…"
              />
            </SettingsField>
            <div className="grid gap-4 sm:grid-cols-2">
              <SettingsField label="Status">
                <SettingsDropdown
                  aria-label="Status"
                  options={STATUS_OPTIONS}
                  value={status}
                  onSelect={(v) => setStatus(v as SimpleMaintenanceStatus)}
                />
              </SettingsField>
              <SettingsField label="Data">
                <SettingsDatePicker
                  aria-label="Data da manutenção"
                  value={date}
                  onChange={setDate}
                />
              </SettingsField>
            </div>
            <SettingsField label="Custo (R$)">
              <input
                type="number"
                min={0}
                step={0.01}
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0,00"
                className={settingsInputClass}
              />
            </SettingsField>
          </div>

          <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-[#0d1f3c]">
                Peças utilizadas{" "}
                <span className="font-normal text-neutral-500">(opcional)</span>
              </p>
              <button
                type="button"
                onClick={() => setParts((p) => [...p, emptyPart()])}
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-accent"
              >
                <HiPlus className="h-3.5 w-3.5" />
                Adicionar
              </button>
            </div>
            {parts.length === 0 ? (
              <p className="mt-2 text-xs text-neutral-500">
                Nenhuma peça adicionada.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {parts.map((part, idx) => (
                  <li
                    key={idx}
                    className="grid gap-2 rounded-xl bg-[#fafbfc] p-3 ring-1 ring-[rgba(17,17,17,0.06)] sm:grid-cols-[1fr_4rem_5rem_auto]"
                  >
                    <input
                      placeholder="Nome da peça"
                      value={part.name}
                      onChange={(e) =>
                        setParts((prev) =>
                          prev.map((p, i) =>
                            i === idx ? { ...p, name: e.target.value } : p,
                          ),
                        )
                      }
                      className={settingsInputClass}
                    />
                    <input
                      type="number"
                      min={1}
                      placeholder="Qtd"
                      value={part.quantity}
                      onChange={(e) =>
                        setParts((prev) =>
                          prev.map((p, i) =>
                            i === idx
                              ? { ...p, quantity: Number(e.target.value) || 1 }
                              : p,
                          ),
                        )
                      }
                      className={settingsInputClass}
                    />
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="R$"
                      value={
                        part.unitValueCents
                          ? (part.unitValueCents / 100).toString()
                          : ""
                      }
                      onChange={(e) =>
                        setParts((prev) =>
                          prev.map((p, i) =>
                            i === idx
                              ? {
                                  ...p,
                                  unitValueCents: Math.round(
                                    parseFloat(e.target.value || "0") * 100,
                                  ),
                                }
                              : p,
                          ),
                        )
                      }
                      className={settingsInputClass}
                    />
                    <button
                      type="button"
                      aria-label="Remover peça"
                      onClick={() =>
                        setParts((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="flex h-12 items-center justify-center text-red-600"
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </ScheduleDrawerShell>

      <ConfirmDialog
        open={confirmFinance}
        title="Gerar despesa no financeiro?"
        message={`${pendingMessage} Deseja lançar o custo como despesa (categoria Manutenção, centro Karts)?`}
        confirmLabel="Sim, gerar despesa"
        cancelLabel="Não"
        onConfirm={() => {
          setConfirmFinance(false);
          completeSave(true);
        }}
        onCancel={() => {
          setConfirmFinance(false);
          completeSave(false);
        }}
      />
    </>
  );
}
