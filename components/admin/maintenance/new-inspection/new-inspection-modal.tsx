"use client";

import { InspectionServiceMock } from "@/services/maintenance/inspectionServiceMock";

import type { InspectionTypeKey, GeneralCondition, InspectionItemState } from "@/lib/contracts/maintenance";

import { useCallback, useEffect, useMemo, useState } from "react";

import { InspectionHeader } from "./inspection-header";
import { InspectionFooterActions } from "./inspection-footer-actions";
import { InspectionTypeSelector } from "./inspection-type-selector";
import { KartTechnicalHero } from "./kart-technical-hero";
import { GeneralConditionCard } from "./general-condition-card";
import { InspectionModuleAccordion } from "./inspection-module-accordion";
import { MediaInspectionUploader } from "./media-inspection-uploader";
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
};

const NOW_LABEL = "21 mai 2026, 15:42";

export function NewInspectionModal({ open, onClose, onSuccess }: Props) {
  const [inspectionType, setInspectionType] =
    useState<InspectionTypeKey>("pre_treino");
  const [generalCondition, setGeneralCondition] =
    useState<GeneralCondition>("atencao");
  const [items, setItems] = useState(InspectionServiceMock.buildInitialItemStates);
  const [diagnosis, setDiagnosis] = useState(InspectionServiceMock.getMockDiagnosis());

  useEffect(() => {
    if (!open) return;
    setInspectionType("pre_treino");
    setGeneralCondition("atencao");
    setItems(InspectionServiceMock.buildInitialItemStates());
    setDiagnosis(InspectionServiceMock.getMockDiagnosis());
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

  const result = useMemo(
    () => InspectionServiceMock.computeInspectionResult(items, generalCondition),
    [items, generalCondition]
  );

  const handleItemChange = useCallback(
    (id: string, patch: Partial<InspectionItemState>) => {
      setItems((prev) => ({
        ...prev,
        [id]: { ...prev[id], ...patch },
      }));
    },
    []
  );

  const notify = useCallback(
    (message: string) => {
      onSuccess?.(message);
      onClose();
    },
    [onSuccess, onClose]
  );

  if (!open) return null;

  const kart = InspectionServiceMock.getDefaultKart();
  const summaryLine = `OK ${result.ok} · Atenção ${result.warn} · Reprov. ${result.fail} · ${result.final}`;

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
        dateTime={NOW_LABEL}
        onSaveDraft={() =>
          onSuccess?.(`Rascunho da inspeção — kart #${kart.kartNumber} salvo (mock).`)
        }
        onFinish={() =>
          notify(
            `Inspeção finalizada — kart #${kart.kartNumber}: ${result.final} (mock).`
          )
        }
        onOpenOs={() =>
          onSuccess?.(`OS vinculada à inspeção do kart #${kart.kartNumber} (mock).`)
        }
        onClose={onClose}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl space-y-8">
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
              <MediaInspectionUploader />
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
                    `${os} criada — kart #${kart.kartNumber} em manutenção (mock).`
                  )
                }
              />
              <TechnicalTimeline />
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
        </div>

        <InspectionFooterActions
          compactSummary={summaryLine}
          onSaveDraft={() =>
            onSuccess?.(`Rascunho — kart #${kart.kartNumber} (mock).`)
          }
          onFinish={() =>
            notify(
              `Inspeção finalizada — kart #${kart.kartNumber}: ${result.final} (mock).`
            )
          }
          onGenerateOs={() =>
            onSuccess?.(
              `OS gerada e vinculada — kart #${kart.kartNumber} em manutenção (mock).`
            )
          }
          onRelease={() =>
            notify(`Kart #${kart.kartNumber} liberado após inspeção (mock).`)
          }
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
