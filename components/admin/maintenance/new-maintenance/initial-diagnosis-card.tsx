"use client";

import { NewMaintenanceServiceMock } from "@/services/maintenance/newMaintenanceServiceMock";

import type { DiagnosisAreaKey, DiagnosisAreaState } from "@/lib/contracts/maintenance";


import { InspectionStatusButton } from "../checklist/inspection-status-button";
import { SeverityBadge } from "../new-inspection/severity-badge";

type Props = {
  areas: Record<DiagnosisAreaKey, DiagnosisAreaState>;
  onChange: (key: DiagnosisAreaKey, patch: Partial<DiagnosisAreaState>) => void;
};

export function InitialDiagnosisCard({ areas, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Diagnóstico inicial</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Avalie cada área técnica do kart
      </p>
      <ul className="mt-4 space-y-3">
        {NewMaintenanceServiceMock.getDiagnosisAreas().map((area) => {
          const state = areas[area.key];
          const setStatus = (next: "ok" | "warn" | "fail") => {
            onChange(area.key, {
              status: state.status === next ? null : next,
              severity: next === "fail" ? state.severity ?? "leve" : null,
            });
          };
          return (
            <li
              key={area.key}
              className="rounded-xl border border-[rgba(17,17,17,0.06)] bg-[#fafbfc] p-3"
            >
              <p className="text-sm font-bold text-[#0d1f3c]">{area.label}</p>
              <div className="mt-2 flex gap-2">
                <InspectionStatusButton
                  status="ok"
                  selected={state.status === "ok"}
                  onSelect={() => setStatus("ok")}
                />
                <InspectionStatusButton
                  status="warn"
                  selected={state.status === "warn"}
                  onSelect={() => setStatus("warn")}
                />
                <InspectionStatusButton
                  status="fail"
                  selected={state.status === "fail"}
                  onSelect={() => setStatus("fail")}
                />
              </div>
              {state.status === "fail" ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["leve", "moderada", "critica"] as const).map((s) => (
                    <SeverityBadge
                      key={s}
                      severity={s}
                      selected={state.severity === s}
                      onClick={() =>
                        onChange(area.key, {
                          severity: state.severity === s ? null : s,
                        })
                      }
                    />
                  ))}
                </div>
              ) : null}
              <input
                type="text"
                value={state.note}
                onChange={(e) => onChange(area.key, { note: e.target.value })}
                placeholder="Observação…"
                className="mt-2 w-full rounded-lg border border-[rgba(17,17,17,0.08)] bg-white px-3 py-2 text-xs"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
