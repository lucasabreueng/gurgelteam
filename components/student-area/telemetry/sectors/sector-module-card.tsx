"use client";

import type { SectorModuleData } from "@/lib/contracts/telemetry/sectors";
import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";
import { SECTOR_SECTION, SECTOR_STATUS_STYLES } from "./sectors-styles";

type Props = {
  sector: SectorModuleData;
};

const STATUS_LABEL = {
  gain: "Ganho",
  loss: "Perda",
  personal_best: "Melhor pessoal",
  neutral: "Neutro",
} as const;

export function SectorModuleCard({ sector }: Props) {
  const style = SECTOR_STATUS_STYLES[sector.status];

  return (
    <article
      className={`${SECTOR_SECTION} ${style.bg} border ${style.border}`}
      title={sector.label}
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-[#0d1f3c]">
              {sector.id}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${style.border} ${style.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              {STATUS_LABEL[sector.status]}
            </span>
          </div>
          <p className="mt-4 font-mono text-[36px] font-bold leading-none tabular-nums text-[#0d1f3c]">
            {TelemetryServiceMock.formatSectorTime(sector.currentTime)}
            <span className="text-base font-semibold text-neutral-400">s</span>
          </p>
        </div>

        <dl className="grid shrink-0 grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
          <div className="min-w-0">
            <dt className="text-neutral-500">Melhor setor</dt>
            <dd className="font-mono font-semibold text-[#0d1f3c]">
              {TelemetryServiceMock.formatSectorTime(sector.bestSessionTime)}s
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-neutral-500">Teórico</dt>
            <dd className="font-mono font-semibold text-accent">
              {TelemetryServiceMock.formatSectorTime(sector.theoreticalTime)}s
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-neutral-500">Variação</dt>
            <dd className="font-mono font-semibold text-neutral-700">
              ±{sector.variationMs} ms
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-neutral-500">Δ melhor</dt>
            <dd
              className={`font-mono font-semibold ${
                sector.deltaVsBest <= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {TelemetryServiceMock.formatDelta(sector.deltaVsBest)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-[10px] text-neutral-500">
          <span>Consistência do setor</span>
          <span className="font-mono font-semibold text-neutral-700">
            {sector.consistency}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200/80">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-500`}
            style={{ width: `${sector.consistency}%` }}
          />
        </div>
      </div>
    </article>
  );
}
