"use client";

import type {
  InspectionItemState,
  InspectionModuleItemDef,
} from "@/lib/contracts/maintenance";
import { HiCamera, HiPencilSquare } from "react-icons/hi2";
import { InspectionStatusButton } from "../checklist/inspection-status-button";
import { SeverityBadge } from "./severity-badge";
import { TireWearCard } from "../checklist/tire-wear-card";

type Props = {
  item: InspectionModuleItemDef;
  state: InspectionItemState;
  onChange: (patch: Partial<InspectionItemState>) => void;
};

export function InspectionItemRow({ item, state, onChange }: Props) {
  const setStatus = (next: "ok" | "warn" | "fail") => {
    onChange({
      status: state.status === next ? null : next,
      severity: next === "fail" ? state.severity ?? "leve" : null,
    });
  };

  const setSeverity = (s: "leve" | "moderada" | "critica") => {
    onChange({ severity: state.severity === s ? null : s });
  };

  return (
    <div className="rounded-xl border border-[rgba(17,17,17,0.06)] bg-white p-4 shadow-sm transition hover:border-accent/15">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#0d1f3c]">{item.label}</p>
          {item.critical ? (
            <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wide text-red-600">
              Item crítico
            </span>
          ) : null}
        </div>
        <div className="flex w-full gap-2 lg:max-w-md">
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
      </div>

      {item.tireWearPercent != null ? (
        <div className="mt-3">
          <TireWearCard percent={item.tireWearPercent} />
        </div>
      ) : null}

      {state.status === "fail" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="w-full text-[10px] font-bold uppercase text-neutral-500">
            Severidade
          </span>
          {(["leve", "moderada", "critica"] as const).map((s) => (
            <SeverityBadge
              key={s}
              severity={s}
              selected={state.severity === s}
              onClick={() => setSeverity(s)}
            />
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={state.note}
          onChange={(e) => onChange({ note: e.target.value })}
          placeholder="Observação técnica…"
          className="min-h-[44px] flex-1 rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-3 text-sm text-[#0d1f3c] outline-none transition focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="button"
          onClick={() => onChange({ note: state.note || "Foto mock registrada" })}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[rgba(17,17,17,0.1)] bg-white px-4 text-[10px] font-bold uppercase tracking-wide text-[#0d1f3c] transition hover:border-accent/30"
        >
          <HiCamera className="h-4 w-4 text-accent" aria-hidden />
          Foto
        </button>
        <button
          type="button"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-[#fafbfc] px-4 text-[10px] font-bold uppercase tracking-wide text-neutral-500"
        >
          <HiPencilSquare className="h-4 w-4" aria-hidden />
          Nota
        </button>
      </div>
    </div>
  );
}
