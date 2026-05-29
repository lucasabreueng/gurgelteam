"use client";

import { ChecklistServiceMock } from "@/services/maintenance/checklistServiceMock";

import type { InspectionItemStatus, ChecklistTypeKey, ChecklistKartContext } from "@/lib/contracts/maintenance";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";

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
  onSuccess?: (message: string) => void;
};

export function ChecklistDrawer({
  open,
  onClose,
  kart = ChecklistServiceMock.getDefaultKart(),
  onSuccess,
}: Props) {
  useDrawerBodyLock(open);

  const [checklistType, setChecklistType] = useState<ChecklistTypeKey>("pre");
  const [items, setItems] = useState(ChecklistServiceMock.buildInitialItemState);
  const [notes, setNotes] = useState(kart.quickNote);

  useEffect(() => {
    if (!open) return;
    setItems(ChecklistServiceMock.buildInitialItemState());
    setNotes(kart.quickNote);
    setChecklistType("pre");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      };
  }, [open, onClose, kart.quickNote]);

  const summary = useMemo(() => ChecklistServiceMock.computeInspectionSummary(items), [items]);

  const setItem = useCallback((id: string, status: InspectionItemStatus) => {
    setItems((prev) => ({ ...prev, [id]: status }));
  }, []);

  const notify = (message: string) => {
    onSuccess?.(message);
    onClose();
  };

  const handleRelease = () => {
    if (summary.overall === "bloqueado") {
      onSuccess?.("Kart não liberado — itens críticos reprovados (mock).");
      return;
    }
    notify("Kart liberado para pista (mock).");
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
            {ChecklistServiceMock.getTypes().map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setChecklistType(t.key)}
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

            <KartDiagram />

            <div className="space-y-3">
              {ChecklistServiceMock.getSections().map((section, i) => (
                <ChecklistAccordion
                  key={section.id}
                  section={section}
                  items={items}
                  onItemChange={setItem}
                  defaultOpen={i < 2}
                />
              ))}
            </div>

            <MediaUploader />
            <InspectionNotes value={notes} onChange={setNotes} />
            <ChecklistHistoryTimeline />
          </div>
        </div>

        <ChecklistDrawerFooter
          {...summary}
          onRelease={handleRelease}
          onSendToMaintenance={() =>
            notify("OS aberta automaticamente — kart em manutenção (mock).")
          }
          onSave={() => notify("Checklist salvo (mock).")}
          onFinish={() => notify("Inspeção finalizada (mock).")}
        />
      </aside>
    </div>
  );
}
