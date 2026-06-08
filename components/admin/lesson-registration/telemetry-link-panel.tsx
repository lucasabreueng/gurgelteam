"use client";

import { useMemo } from "react";
import type { TelemetrySessionOptionDTO } from "@/lib/contracts/telemetry/telemetry.types";
import { getAppServices } from "@/lib/data-source/app-services";
import { lessonRegistrationSelectionClass } from "./lesson-registration-selection";

type Props = {
  pilotName: string;
  selectedId: string | null;
  onSelect: (session: TelemetrySessionOptionDTO) => void;
  readOnly?: boolean;
};

function matchesPilot(sessionPilot: string, target: string): boolean {
  return sessionPilot.trim().toLowerCase() === target.trim().toLowerCase();
}

export function TelemetryLinkPanel({
  pilotName,
  selectedId,
  onSelect,
  readOnly,
}: Props) {
  const options = useMemo(
    () =>
      getAppServices()
        .lessons.getTelemetrySessionOptions()
        .filter((t) => matchesPilot(t.pilotName, pilotName)),
    [pilotName],
  );

  return (
    <div className="space-y-4">
      {!readOnly ? (
        <p className="text-sm text-neutral-600">
          Sessões de telemetria importadas de{" "}
          <span className="font-semibold text-[#0d1f3c]">{pilotName}</span>.
        </p>
      ) : null}

      <ul className="space-y-2 overflow-visible p-0.5">
        {options.length === 0 ? (
          <li className="rounded-xl border border-dashed border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500">
            Nenhuma telemetria importada para este piloto.
          </li>
        ) : (
          options.map((opt) => {
            const active = selectedId === opt.id;
            if (readOnly && !active) return null;
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => onSelect(opt)}
                  className={`flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-4 text-left transition ${lessonRegistrationSelectionClass(active)} disabled:cursor-default`}
                >
                  <div>
                    <p className="font-bold text-[#0d1f3c]">{opt.date}</p>
                    <p className="text-xs text-neutral-600">
                      {opt.device} · {opt.lapCount} voltas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-bold tabular-nums text-accent">
                      {opt.bestLap}s
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {opt.consistency}% consist.
                    </p>
                  </div>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
