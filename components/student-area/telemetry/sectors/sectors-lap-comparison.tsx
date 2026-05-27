"use client";

import type { SectorsLapRecord } from "@/lib/contracts/telemetry/sectors";
import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";
import { SECTION_LABEL, SECTOR_SECTION, STAT_BOX } from "./sectors-styles";

type Props = {
  lapA: SectorsLapRecord | null;
  lapB: SectorsLapRecord | null;
};

export function SectorsLapComparison({ lapA, lapB }: Props) {
  if (!lapA || !lapB) {
    return (
      <article
        className={`${SECTOR_SECTION} border-dashed border-[rgba(17,17,17,0.14)] bg-neutral-50/50`}
      >
        <p className={SECTION_LABEL}>Comparação de voltas</p>
        <p className="mt-2 text-[13px] text-neutral-600">
          Selecione <strong className="text-[#0d1f3c]">duas voltas</strong> na
          tabela para comparar setor a setor.
        </p>
      </article>
    );
  }

  const cmp = TelemetryServiceMock.compareLaps(lapA, lapB);

  return (
    <article className={SECTOR_SECTION}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={SECTION_LABEL}>Comparação de voltas</p>
        <p className="font-mono text-[13px] font-bold text-[#0d1f3c]">
          V{lapA.lap} vs V{lapB.lap}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {cmp.sectors.map((s) => {
          const field = s.id.toLowerCase() as "s1" | "s2" | "s3";
          return (
            <div
              key={s.id}
              className={`${STAT_BOX} bg-white`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                {s.id}
              </p>
              <p className="mt-2 font-mono text-[11px] text-neutral-600">
                V{lapA.lap}: {TelemetryServiceMock.formatSectorTime(lapA[field])}s
              </p>
              <p className="font-mono text-[11px] text-neutral-600">
                V{lapB.lap}: {TelemetryServiceMock.formatSectorTime(lapB[field])}s
              </p>
              <p
                className={`mt-2 font-mono text-sm font-bold ${
                  s.faster === "a"
                    ? "text-emerald-600"
                    : s.faster === "b"
                      ? "text-red-600"
                      : "text-neutral-500"
                }`}
              >
                {s.faster === "a"
                  ? `V${lapA.lap} mais rápido`
                  : s.faster === "b"
                    ? `V${lapB.lap} mais rápido`
                    : "Empate"}
                {" · "}
                {TelemetryServiceMock.formatDelta(s.delta)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/80">
          Diferença total
        </p>
        <p
          className={`mt-1 font-mono text-xl font-bold ${
            cmp.totalDelta <= 0 ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {TelemetryServiceMock.formatDelta(cmp.totalDelta)}
        </p>
      </div>
    </article>
  );
}
