"use client";

import type { SectorModuleData } from "@/lib/contracts/telemetry/sectors";
import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";
import { useTelemetryTabletLayout } from "@/lib/hooks/use-telemetry-tablet-layout";
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
  const { tabletLandscape } = useTelemetryTabletLayout();

  return (
    <article
      className={`telemetry-sector-card ${SECTOR_SECTION} ${style.bg} border ${style.border} ${
        tabletLandscape ? "p-4" : ""
      }`}
      title={sector.label}
    >
      <div
        className={
          tabletLandscape ? "flex flex-col gap-3" : "flex items-start gap-4"
        }
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-lg font-bold text-[var(--ds-text-primary)]">
              {sector.id}
            </span>
            <span
              className={`inline-flex max-w-full items-center gap-1 rounded-full border bg-[var(--ds-bg-card)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${style.border} ${style.text}`}
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
              <span className="truncate">{STATUS_LABEL[sector.status]}</span>
            </span>
          </div>
          <p
            className={`mt-3 font-mono font-bold leading-none tabular-nums text-[var(--ds-text-primary)] ${
              tabletLandscape ? "text-[28px]" : "mt-4 text-[36px]"
            }`}
          >
            {TelemetryServiceMock.formatSectorTime(sector.currentTime)}
            <span className="text-base font-semibold text-[var(--ds-text-muted)]">
              s
            </span>
          </p>
        </div>

        <dl
          className={`grid min-w-0 text-[11px] ${
            tabletLandscape
              ? "grid-cols-2 gap-x-3 gap-y-2 border-t border-[var(--ds-border)] pt-3"
              : "shrink-0 grid-cols-2 gap-x-4 gap-y-2"
          }`}
        >
          <div className="min-w-0">
            <dt className="text-[var(--ds-text-muted)]">Melhor setor</dt>
            <dd className="font-mono font-semibold text-[var(--ds-text-primary)]">
              {TelemetryServiceMock.formatSectorTime(sector.bestSessionTime)}s
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[var(--ds-text-muted)]">Teórico</dt>
            <dd className="font-mono font-semibold text-accent">
              {TelemetryServiceMock.formatSectorTime(sector.theoreticalTime)}s
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[var(--ds-text-muted)]">Variação</dt>
            <dd className="font-mono font-semibold text-[var(--ds-text-secondary)]">
              ±{sector.variationMs} ms
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[var(--ds-text-muted)]">Δ melhor</dt>
            <dd
              className={`font-mono font-semibold ${
                sector.deltaVsBest <= 0
                  ? "text-[var(--ds-success-text)]"
                  : "text-[var(--ds-error-text)]"
              }`}
            >
              {TelemetryServiceMock.formatDelta(sector.deltaVsBest)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-[10px] text-[var(--ds-text-muted)]">
          <span>Consistência do setor</span>
          <span className="font-mono font-semibold text-[var(--ds-text-secondary)]">
            {sector.consistency}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--ds-bg-muted)]">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-500`}
            style={{ width: `${sector.consistency}%` }}
          />
        </div>
      </div>
    </article>
  );
}
