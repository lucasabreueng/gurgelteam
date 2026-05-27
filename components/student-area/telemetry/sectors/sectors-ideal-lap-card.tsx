"use client";

import type { IdealLapData } from "@/lib/contracts/telemetry/sectors";
import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";
import { SECTION_LABEL, SECTOR_SECTION, STAT_BOX } from "./sectors-styles";

type Props = {
  data: IdealLapData;
};

export function SectorsIdealLapCard({ data }: Props) {
  return (
    <article className={`${SECTOR_SECTION} lg:col-span-2`}>
      <p className={SECTION_LABEL}>Volta ideal</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Melhor volta real
          </p>
          <p className="mt-1 font-mono text-3xl font-bold tabular-nums text-[#0d1f3c] md:text-4xl">
            {TelemetryServiceMock.formatSectorTime(data.bestReal)}
            <span className="text-lg text-neutral-400">s</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Volta ideal teórica
          </p>
          <p className="mt-1 font-mono text-3xl font-bold tabular-nums text-accent md:text-4xl">
            {TelemetryServiceMock.formatSectorTime(data.ideal)}
            <span className="text-lg text-accent/50">s</span>
          </p>
        </div>
        <div className={`${STAT_BOX} border-emerald-200 bg-emerald-50/60`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/80">
            Potencial de ganho
          </p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-emerald-700">
            {TelemetryServiceMock.formatDelta(data.potential)}
          </p>
          <p className="mt-1 text-[11px] text-neutral-600">
            Soma dos melhores setores da sessão
          </p>
        </div>
      </div>
    </article>
  );
}
