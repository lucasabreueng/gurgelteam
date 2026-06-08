"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";
import type { MaintenanceFleetKart } from "@/lib/contracts/maintenance/simple";
import type { MaintenanceDraftFromInspection } from "@/lib/contracts/maintenance/simple";
import type {
  ChecklistItemEvaluation,
  CompleteChecklistType,
} from "@/lib/contracts/maintenance/complete-checklist";
import {
  COMPLETE_CHECKLIST_TEMPLATE,
  COMPLETE_CHECKLIST_TYPE_LABELS,
  CHECKLIST_FINAL_STATUS_LABELS,
  computeChecklistFinalStatus,
  getAllChecklistTemplateItems,
  getFailedChecklistItems,
} from "@/lib/contracts/maintenance/complete-checklist";
import { FinancialBillingDrawerShell } from "@/components/admin/financial/billing/financial-billing-drawer-shell";
import { DrawerFooterActions } from "@/components/ui/drawer-footer";
import { BillingFormCard } from "@/components/admin/financial/billing/billing-summary-panel";
import { ConfirmDialog } from "@/components/admin/settings/confirm-dialog";
import { SettingsDatePicker } from "@/components/admin/settings/settings-date-picker";
import { SettingsDropdown } from "@/components/admin/settings/settings-dropdown";
import { SettingsField } from "@/components/admin/settings/settings-section";
import { ChecklistEvaluationAccordion } from "./checklist-evaluation-accordion";
import { ChecklistFinalStatusBadge } from "./checklist-final-status-badge";
import { ChecklistSummaryPanel } from "./checklist-summary-panel";
import { setKartStatusByNumber } from "@/lib/karts-runtime-store";

const CHECKLIST_STEP_LABELS = ["Informações", "Avaliação", "Resultado"] as const;

const TYPE_OPTIONS = (
  Object.entries(COMPLETE_CHECKLIST_TYPE_LABELS) as [CompleteChecklistType, string][]
).map(([value, label]) => ({ value, label }));

function buildDefaultEvaluations(): Record<string, ChecklistItemEvaluation> {
  const map: Record<string, ChecklistItemEvaluation> = {};
  for (const item of getAllChecklistTemplateItems()) {
    map[item.id] = { itemId: item.id };
  }
  return map;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

type Props = {
  open: boolean;
  karts: MaintenanceFleetKart[];
  responsibles: { id: string; name: string }[];
  initialKartId?: string;
  initialType?: CompleteChecklistType;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onRequestMaintenances: (drafts: MaintenanceDraftFromInspection[]) => void;
};

export function CompleteChecklistDrawer({
  open,
  karts,
  responsibles,
  initialKartId = "",
  initialType = "revisao_periodica",
  onClose,
  onSuccess,
  onRequestMaintenances,
}: Props) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [kartId, setKartId] = useState("");
  const [date, setDate] = useState(todayIsoDate);
  const [responsible, setResponsible] = useState("");
  const [checklistType, setChecklistType] =
    useState<CompleteChecklistType>("revisao_periodica");
  const [evaluations, setEvaluations] = useState(buildDefaultEvaluations);
  const [confirmMaintenance, setConfirmMaintenance] = useState(false);
  const [pendingDrafts, setPendingDrafts] = useState<
    MaintenanceDraftFromInspection[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = useCallback(() => {
    setStep(1);
    setKartId(initialKartId || karts[0]?.id || "");
    setDate(todayIsoDate());
    setResponsible(responsibles[0]?.id ?? "");
    setChecklistType(initialType);
    setEvaluations(buildDefaultEvaluations());
    setConfirmMaintenance(false);
    setPendingDrafts([]);
    setErrors({});
  }, [initialKartId, initialType, karts, responsibles]);

  useEffect(() => {
    if (!open) return;
    reset();
  }, [open, reset]);

  const evalList = useMemo(() => Object.values(evaluations), [evaluations]);

  const finalStatus = useMemo(
    () => computeChecklistFinalStatus(evalList),
    [evalList],
  );

  const failedItems = useMemo(
    () => getFailedChecklistItems(evalList),
    [evalList],
  );

  const attentionCount = evalList.filter((e) => e.rating === "atencao").length;
  const okCount = evalList.filter((e) => e.rating === "ok").length;

  const kart = karts.find((k) => k.id === kartId);
  const kartLabel = kart
    ? `Kart ${String(kart.number).padStart(2, "0")}`
    : "—";
  const validateStep = (s: number): boolean => {
    const next: Record<string, string> = {};
    if (s === 1) {
      if (!kartId) next.kartId = "Selecione o kart.";
      if (!responsible) next.responsible = "Selecione o responsável.";
      if (!checklistType) next.checklistType = "Selecione o tipo.";
      if (!date) next.date = "Informe a data do checklist.";
    }
    if (s === 2) {
      const pending = getAllChecklistTemplateItems().filter(
        (item) => !evaluations[item.id]?.rating,
      );
      if (pending.length > 0) {
        next.evaluations = "Avalie todos os itens antes de continuar.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleEvalChange = (
    itemId: string,
    patch: Partial<ChecklistItemEvaluation>,
  ) => {
    setEvaluations((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId]!, ...patch, itemId },
    }));
  };

  const finishChecklist = async (createMaintenances: boolean) => {
    const kart = karts.find((k) => k.id === kartId);
    const responsibleName =
      responsibles.find((r) => r.id === responsible)?.name ?? responsible;

    try {
      await getAppServices().inspection.createInspection({
        kartId,
        checklistType,
        payload: { date, responsible, evaluations, checklistType },
        overallStatus: finalStatus,
        signedBy: responsibleName,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.maintenance.all,
      });
    } catch {
      onSuccess("Erro ao salvar checklist.");
      return;
    }

    if (kart) {
      if (finalStatus === "reprovado") {
        setKartStatusByNumber(kart.number, "manutencao");
      } else {
        setKartStatusByNumber(kart.number, "disponivel");
      }
    }

    onSuccess(
      `Checklist completo do ${kartLabel} registrado — ${CHECKLIST_FINAL_STATUS_LABELS[finalStatus]}.`,
    );

    if (createMaintenances && pendingDrafts.length > 0) {
      onRequestMaintenances(pendingDrafts);
    }

    onClose();
  };

  const handleFinish = () => {
    if (failedItems.length > 0) {
      const drafts: MaintenanceDraftFromInspection[] = failedItems.map(
        (item) => ({
          kartId,
          category: item.maintenanceCategory,
          description: `Checklist: ${item.label} reprovado.`,
        }),
      );
      setPendingDrafts(drafts);
      setConfirmMaintenance(true);
      return;
    }
    void finishChecklist(false);
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

  const step1 = (
    <BillingFormCard>
      <SettingsField label="Kart *">
        <SettingsDropdown
          aria-label="Kart"
          options={kartOptions}
          value={kartId}
          onSelect={setKartId}
        />
        {errors.kartId ? (
          <p className="text-[12px] font-medium text-[#c41e3a]">{errors.kartId}</p>
        ) : null}
      </SettingsField>
      <SettingsField label="Data do checklist *">
        <SettingsDatePicker
          aria-label="Data do checklist"
          value={date}
          onChange={setDate}
        />
        {errors.date ? (
          <p className="text-[12px] font-medium text-[#c41e3a]">{errors.date}</p>
        ) : null}
      </SettingsField>
      <SettingsField label="Responsável *">
        <SettingsDropdown
          aria-label="Responsável"
          options={responsibleOptions}
          value={responsible}
          onSelect={setResponsible}
        />
        {errors.responsible ? (
          <p className="text-[12px] font-medium text-[#c41e3a]">
            {errors.responsible}
          </p>
        ) : null}
      </SettingsField>
      <SettingsField label="Tipo de checklist *">
        <SettingsDropdown
          aria-label="Tipo de checklist"
          options={TYPE_OPTIONS}
          value={checklistType}
          onSelect={(v) => setChecklistType(v as CompleteChecklistType)}
        />
      </SettingsField>
    </BillingFormCard>
  );

  const step2 = (
    <div className="space-y-3">
      {errors.evaluations ? (
        <p className="text-[12px] font-medium text-[#c41e3a]">{errors.evaluations}</p>
      ) : null}
      <ChecklistEvaluationAccordion
        groups={COMPLETE_CHECKLIST_TEMPLATE}
        evaluations={evaluations}
        onChange={handleEvalChange}
      />
    </div>
  );

  const step3 = (
    <div className="space-y-4">
      <BillingFormCard>
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Status final
        </p>
        <div className="mt-3">
          <ChecklistFinalStatusBadge status={finalStatus} />
        </div>
        <p className="mt-3 text-sm text-neutral-600">
          {finalStatus === "reprovado"
            ? "Há itens reprovados — o kart não está aprovado para uso sem correção."
            : finalStatus === "aprovado_ressalvas"
              ? "Itens em atenção — acompanhar na próxima inspeção ou manutenção."
              : "Todos os itens avaliados como OK."}
        </p>
      </BillingFormCard>
      <BillingFormCard>
        <dl className="grid gap-3 sm:grid-cols-3">
          <div>
            <dt className="text-[10px] font-bold uppercase text-neutral-500">OK</dt>
            <dd className="text-2xl font-bold text-emerald-700">{okCount}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase text-neutral-500">
              Atenção
            </dt>
            <dd className="text-2xl font-bold text-amber-700">{attentionCount}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase text-neutral-500">
              Reprovados
            </dt>
            <dd className="text-2xl font-bold text-red-700">{failedItems.length}</dd>
          </div>
        </dl>
      </BillingFormCard>
      {failedItems.length > 0 ? (
        <div className="rounded-2xl border border-red-200/60 bg-red-50/50 p-4">
          <p className="text-sm font-bold text-red-900">Itens reprovados</p>
          <ul className="mt-2 list-inside list-disc text-sm text-red-800">
            {failedItems.map((i) => (
              <li key={i.id}>{i.label}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );

  const footer = (
    <DrawerFooterActions columns={2}>
      <button type="button" onClick={onClose} className="btn-outline-sm bg-white">
        Cancelar
      </button>
      {step > 1 ? (
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="btn-outline-sm bg-white"
        >
          Voltar
        </button>
      ) : null}
      {step < 3 ? (
        <button
          type="button"
          onClick={() => {
            if (validateStep(step)) setStep((s) => s + 1);
          }}
          className="btn-primary-sm"
        >
          Continuar
        </button>
      ) : (
        <button type="button" onClick={handleFinish} className="btn-primary-sm">
          Concluir checklist
        </button>
      )}
    </DrawerFooterActions>
  );

  const mainContent =
    step === 1 ? step1 : step === 2 ? step2 : step3;

  return (
    <>
      <FinancialBillingDrawerShell
        open={open}
        onClose={onClose}
        title="Novo checklist completo"
        subtitle="Avaliação técnica detalhada para revisões, auditorias e pré-evento."
        currentStep={step}
        stepLabels={CHECKLIST_STEP_LABELS}
        fullWidthSteps
        summary={
          <ChecklistSummaryPanel
            kartLabel={kartLabel}
            typeLabel={COMPLETE_CHECKLIST_TYPE_LABELS[checklistType]}
            status={finalStatus}
          />
        }
        footer={footer}
      >
        {mainContent}
      </FinancialBillingDrawerShell>

      <ConfirmDialog
        open={confirmMaintenance}
        title="Gerar manutenções?"
        message={`Existem ${failedItems.length} item(ns) reprovado(s). Deseja criar manutenções pendentes para cada um?`}
        confirmLabel="Sim, gerar manutenções"
        cancelLabel="Não, só salvar checklist"
        onConfirm={() => {
          setConfirmMaintenance(false);
          void finishChecklist(true);
        }}
        onCancel={() => {
          setConfirmMaintenance(false);
          void finishChecklist(false);
        }}
      />
    </>
  );
}
