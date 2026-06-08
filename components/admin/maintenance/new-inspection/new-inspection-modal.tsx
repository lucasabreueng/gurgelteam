"use client";

import type {
  InspectionTypeKey,
  GeneralCondition,
  InspectionItemState,
  InspectionModuleDef,
} from "@/lib/contracts/maintenance";
import type { MaintenanceFleetKart } from "@/lib/contracts/maintenance/simple";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";
import {
  buildInitialItemStates,
  computeInspectionResult,
} from "@/lib/maintenance/inspection-compute";
import {
  fleetKartToInspectionContext,
  mapInspectionFinalToOverall,
} from "@/lib/maintenance/inspection-ui-helpers";
import { useInspectionTemplate } from "@/lib/query/hooks/use-inspection-template";

import { SettingsDropdown } from "@/components/admin/settings/settings-dropdown";
import { InspectionHeader } from "./inspection-header";
import { InspectionFooterActions } from "./inspection-footer-actions";
import { InspectionTypeSelector } from "./inspection-type-selector";
import { KartTechnicalHero } from "./kart-technical-hero";
import { GeneralConditionCard } from "./general-condition-card";
import { InspectionModuleAccordion } from "./inspection-module-accordion";
import { MediaInspectionUploader, type InspectionMediaItem } from "./media-inspection-uploader";
import { KartDiagramInspection } from "./kart-diagram-inspection";
import { TechnicalDiagnosis } from "./technical-diagnosis";
import { AutoRecommendationCard } from "./auto-recommendation-card";
import { GenerateMaintenanceOrder } from "./generate-maintenance-order";
import { TechnicalTimeline } from "./technical-timeline";
import { SignatureSection } from "./signature-section";
import { FinalInspectionResult } from "./final-inspection-result";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  karts?: MaintenanceFleetKart[];
  initialKartId?: string;
};

const EMPTY_RESULT = {
  ok: 0,
  warn: 0,
  fail: 0,
  critical: 0,
  final: "liberado" as const,
  recommendation: "liberar" as const,
  recommendationText: "",
  score: 0,
};

export function NewInspectionModal({
  open,
  onClose,
  onSuccess,
  karts = [],
  initialKartId = "",
}: Props) {
  const queryClient = useQueryClient();
  const { data: template, isLoading: templateLoading } = useInspectionTemplate();

  const [kartId, setKartId] = useState(initialKartId);
  const [inspectionType, setInspectionType] =
    useState<InspectionTypeKey>("pre_treino");
  const [generalCondition, setGeneralCondition] =
    useState<GeneralCondition>("atencao");
  const [items, setItems] = useState<Record<string, InspectionItemState>>({});
  const [diagnosis, setDiagnosis] = useState("");
  const [media, setMedia] = useState<InspectionMediaItem[]>([]);
  const [saving, setSaving] = useState(false);

  const dateTimeLabel = useMemo(
    () =>
      new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  );

  useEffect(() => {
    if (!open || !template?.modules?.length) return;
    const modules = template.modules as InspectionModuleDef[];
    setKartId(initialKartId || karts[0]?.id || "");
    setInspectionType("pre_treino");
    setGeneralCondition("atencao");
    setItems(buildInitialItemStates(modules));
    setDiagnosis(String(template.mockDiagnosis ?? ""));
    setMedia([]);
  }, [open, template, initialKartId, karts]);

  useEffect(() => {
    if (!open) return;
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

  const result = useMemo(() => {
    const modules = (template?.modules ?? []) as InspectionModuleDef[];
    if (modules.length === 0) return EMPTY_RESULT;
    return computeInspectionResult(modules, items, generalCondition);
  }, [template?.modules, items, generalCondition]);

  const kart = useMemo(() => {
    const fleetKart = karts.find((k) => k.id === kartId);
    if (fleetKart) return fleetKartToInspectionContext(fleetKart);
    return getAppServices().inspection.getDefaultKart();
  }, [karts, kartId]);

  const handleItemChange = useCallback(
    (id: string, patch: Partial<InspectionItemState>) => {
      setItems((prev) => ({
        ...prev,
        [id]: { ...prev[id], ...patch },
      }));
    },
    [],
  );

  const persistInspection = useCallback(async () => {
    const targetKartId = kartId || kart.orderId;
    if (!targetKartId) {
      onSuccess?.("Selecione um kart.");
      return false;
    }
    try {
      await getAppServices().inspection.createInspection({
        kartId: targetKartId,
        checklistType: inspectionType,
        payload: { items, diagnosis, generalCondition, media },
        overallStatus: mapInspectionFinalToOverall(result.final),
        signedBy: kart.responsible,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.maintenance.all,
      });
      return true;
    } catch {
      onSuccess?.("Erro ao salvar inspeção.");
      return false;
    }
  }, [
    kart.orderId,
    kart.responsible,
    kartId,
    diagnosis,
    generalCondition,
    inspectionType,
    items,
    media,
    onSuccess,
    queryClient,
    result.final,
  ]);

  const notify = useCallback(
    async (message: string) => {
      setSaving(true);
      const ok = await persistInspection();
      setSaving(false);
      if (ok) {
        onSuccess?.(message);
        onClose();
      }
    },
    [onClose, onSuccess, persistInspection],
  );

  if (!open) return null;

  const summaryLine = `OK ${result.ok} · Atenção ${result.warn} · Reprov. ${result.fail} · ${result.final}`;
  const kartOptions = [
    { value: "", label: "Selecione o kart…" },
    ...karts.map((k) => ({
      value: k.id,
      label: `Kart ${String(k.number).padStart(2, "0")}`,
    })),
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-inspection-title"
      className="fixed inset-0 z-[230] flex flex-col bg-[#f3f5f9]"
    >
      <InspectionHeader
        kartNumber={kart.kartNumber}
        inspectionType={inspectionType}
        responsible={kart.responsible}
        dateTime={dateTimeLabel}
        onSaveDraft={() => void notify(`Rascunho — kart #${kart.kartNumber} salvo.`)}
        onFinish={() =>
          void notify(
            `Inspeção finalizada — kart #${kart.kartNumber}: ${result.final}.`,
          )
        }
        onOpenOs={() =>
          onSuccess?.(
            `OS vinculada à inspeção do kart #${kart.kartNumber}.`,
          )
        }
        onClose={onClose}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 md:px-8 md:py-8">
          {templateLoading || !template ? (
            <div className="mx-auto max-w-6xl space-y-4">
              <div className="h-48 animate-pulse rounded-2xl bg-white" />
              <div className="h-64 animate-pulse rounded-2xl bg-white" />
            </div>
          ) : (
            <div className="mx-auto max-w-6xl space-y-8">
              {karts.length > 0 ? (
                <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Kart inspecionado
                  </p>
                  <SettingsDropdown
                    aria-label="Kart"
                    options={kartOptions}
                    value={kartId}
                    onSelect={setKartId}
                  />
                </div>
              ) : null}

              <InspectionTypeSelector
                selected={inspectionType}
                onSelect={setInspectionType}
              />

              <KartTechnicalHero kart={kart} />

              <GeneralConditionCard
                value={generalCondition}
                score={result.score}
                onChange={setGeneralCondition}
              />

              <InspectionModuleAccordion
                items={items}
                onItemChange={handleItemChange}
              />

              <div className="grid gap-6 lg:grid-cols-2">
                <KartDiagramInspection />
                <MediaInspectionUploader value={media} onChange={setMedia} />
              </div>

              <TechnicalDiagnosis value={diagnosis} onChange={setDiagnosis} />

              <AutoRecommendationCard
                recommendation={result.recommendation}
                text={result.recommendationText}
                hasCritical={result.critical > 0 || generalCondition === "critica"}
              />

              <div className="grid gap-6 lg:grid-cols-2">
                <GenerateMaintenanceOrder
                  onGenerated={(os) =>
                    onSuccess?.(
                      `${os} criada — kart #${kart.kartNumber} em manutenção.`,
                    )
                  }
                />
                <TechnicalTimeline kartId={kartId || kart.orderId} />
              </div>

              <SignatureSection responsible={kart.responsible} />

              <FinalInspectionResult
                status={result.final}
                ok={result.ok}
                warn={result.warn}
                fail={result.fail}
                critical={result.critical}
              />
            </div>
          )}
        </div>

        <InspectionFooterActions
          compactSummary={summaryLine}
          onSaveDraft={() => void notify(`Rascunho — kart #${kart.kartNumber}.`)}
          onFinish={() =>
            void notify(
              `Inspeção finalizada — kart #${kart.kartNumber}: ${result.final}.`,
            )
          }
          onGenerateOs={() =>
            onSuccess?.(
              `OS gerada — kart #${kart.kartNumber} em manutenção.`,
            )
          }
          onRelease={() =>
            void notify(`Kart #${kart.kartNumber} liberado após inspeção.`)
          }
          onCancel={onClose}
          disabled={saving || templateLoading}
        />
      </div>
    </div>
  );
}
