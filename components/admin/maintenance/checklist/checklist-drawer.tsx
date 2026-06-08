"use client";

import type {
  InspectionItemStatus,
  ChecklistTypeKey,
  ChecklistKartContext,
  InspectionSectionDef,
  ChecklistMediaPreview,
} from "@/lib/contracts/maintenance";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";
import {
  useChecklistTemplate,
  useOrderChecklist,
} from "@/lib/query/hooks/use-maintenance-checklist";

import { ChecklistAccordion } from "./checklist-accordion";
import { ChecklistDrawerFooter } from "./checklist-drawer-footer";
import { ChecklistHeader } from "./checklist-header";
import { ChecklistHistoryTimeline } from "./checklist-history-timeline";
import { ChecklistSmartAlerts } from "./checklist-smart-alerts";
import { InspectionNotes } from "./inspection-notes";
import { KartDiagram } from "./kart-diagram";
import { KartInspectionHero } from "./kart-inspection-hero";
import { MediaUploader } from "./media-uploader";

type Props = {
  open: boolean;
  onClose: () => void;
  kart?: ChecklistKartContext;
  kartId?: string;
  orderId?: string | null;
  onSuccess?: (message: string) => void;
};

function buildItemsFromSections(sections: InspectionSectionDef[]) {
  const checklist = getAppServices().checklist;
  const base = checklist.buildInitialItemState();
  for (const section of sections) {
    for (const item of section.items) {
      if (!(item.id in base)) {
        base[item.id] = null;
      }
    }
  }
  return base;
}

export function ChecklistDrawer({
  open,
  onClose,
  kart: kartProp,
  kartId: kartIdProp,
  orderId = null,
  onSuccess,
}: Props) {
  useDrawerBodyLock(open);
  const queryClient = useQueryClient();
  const checklist = getAppServices().checklist;
  const { data: template } = useChecklistTemplate();
  const { data: orderChecklist } = useOrderChecklist(orderId);

  const kart: ChecklistKartContext =
    kartProp ??
    (orderChecklist
      ? {
          ...checklist.getDefaultKart(),
          kartNumber: orderChecklist.kartNumber,
          orderId: orderChecklist.orderId,
        }
      : checklist.getDefaultKart());

  const [checklistType, setChecklistType] = useState<ChecklistTypeKey>("pre");
  const [items, setItems] = useState<Record<string, InspectionItemStatus>>({});
  const [notes, setNotes] = useState(kart.quickNote);
  const [media, setMedia] = useState<ChecklistMediaPreview[]>([]);
  const [saving, setSaving] = useState(false);

  const sections = useMemo(
    () => (template?.sections ?? []) as InspectionSectionDef[],
    [template?.sections],
  );
  const types = template?.types ?? [{ key: "pre" as const, label: "Pré-pista" }];

  useEffect(() => {
    if (!open) return;
    const initial = buildItemsFromSections(sections);
    const saved = orderChecklist?.checklistData as
      | {
          items?: Record<string, InspectionItemStatus>;
          notes?: string;
          type?: ChecklistTypeKey;
          media?: ChecklistMediaPreview[];
        }
      | null
      | undefined;
    if (saved?.items) {
      Object.assign(initial, saved.items);
    }
    setItems(initial);
    setNotes(saved?.notes ?? kart.quickNote);
    setMedia(saved?.media ?? []);
    setChecklistType(saved?.type ?? "pre");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, kart.quickNote, orderChecklist, sections]);

  const summary = useMemo(
    () => checklist.computeInspectionSummary(items),
    [checklist, items],
  );

  const setItem = useCallback((id: string, status: InspectionItemStatus) => {
    setItems((prev) => ({ ...prev, [id]: status }));
  }, []);

  const persistChecklist = async () => {
    const payload = { type: checklistType, items, notes, media };
    if (orderId) {
      await checklist.saveOrderChecklist(orderId, payload);
      return;
    }
    const targetKartId = orderChecklist?.kartId ?? kartIdProp;
    if (targetKartId) {
      await getAppServices().inspection.createInspection({
        kartId: targetKartId,
        maintenanceOrderId: orderId ?? undefined,
        checklistType,
        payload,
        overallStatus: summary.overall,
      });
    }
  };

  const notify = async (message: string) => {
    setSaving(true);
    try {
      await persistChecklist();
      await queryClient.invalidateQueries({
        queryKey: queryKeys.maintenance.all,
      });
      onSuccess?.(message);
      onClose();
    } catch {
      onSuccess?.("Erro ao salvar checklist.");
    } finally {
      setSaving(false);
    }
  };

  const handleRelease = () => {
    if (summary.overall === "bloqueado") {
      onSuccess?.("Kart não liberado — itens críticos reprovados.");
      return;
    }
    void notify("Kart liberado para pista.");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[220] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        aria-label="Fechar checklist"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Checklist de inspeção"
        className="app-drawer-panel relative flex h-full w-full max-w-full flex-col bg-[#f3f5f9] shadow-2xl transition-transform duration-300 ease-out lg:max-w-[min(48vw,720px)]"
      >
        <ChecklistHeader kart={kart} onClose={onClose} />

        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
          <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-1">
            {types.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setChecklistType(t.key as ChecklistTypeKey)}
                className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition ${
                  checklistType === t.key
                    ? "bg-[#0d1f3c] text-white"
                    : "text-neutral-600 hover:bg-[#fafbfc]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <KartInspectionHero
              heroLabel={summary.heroLabel}
              heroTone={summary.heroTone}
              kart={kart}
              reliabilityScore={kart.reliabilityScore}
            />

            <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-500">
                Alertas inteligentes
              </h3>
              <ChecklistSmartAlerts />
            </section>

            <KartDiagram
              views={template?.diagramViews ?? []}
              zones={template?.diagramZones ?? { frente: [], lateral: [], traseira: [] }}
              loading={!template}
            />

            <div className="space-y-3">
              {sections.map((section, i) => (
                <ChecklistAccordion
                  key={section.id}
                  section={section}
                  items={items}
                  onItemChange={setItem}
                  defaultOpen={i < 2}
                />
              ))}
            </div>

            <MediaUploader value={media} onChange={setMedia} />
            <InspectionNotes value={notes} onChange={setNotes} />
            <ChecklistHistoryTimeline />
          </div>
        </div>

        <ChecklistDrawerFooter
          {...summary}
          overallStatusLabels={template?.overallStatusLabels}
          saving={saving}
          onRelease={handleRelease}
          onSendToMaintenance={() =>
            void notify("OS aberta — kart em manutenção.")
          }
          onSave={() => void notify("Checklist salvo.")}
          onFinish={() => void notify("Inspeção finalizada.")}
        />
      </aside>
    </div>
  );
}
