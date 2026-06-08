"use client";

import type { SectorId, SectorsLapRecord } from "@/lib/contracts/telemetry/sectors";
import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";
import { useMemo, useState } from "react";

import {
  INNER_TABLE,
  SECTION_TITLE,
  SECTOR_CARD,
  TABLE_HEAD,
} from "./sectors-styles";
import { adminTableBodyRowClass } from "@/lib/design";

type SortKey = "lap" | "s1" | "s2" | "s3" | "total" | "delta" | "consistency";

type Props = {
  laps: SectorsLapRecord[];
  selectedLaps: number[];
  onToggleLap: (lap: number) => void;
};

function lapConsistency(lap: SectorsLapRecord, bestTotal: number): number {
  if (lap.invalid) return 0;
  const spread = Math.abs(lap.total - bestTotal);
  return Math.max(0, Math.min(100, Math.round(100 - spread * 80)));
}

function cellClass(highlight: ReturnType<typeof TelemetryServiceMock.getLapCellHighlight>): string {
  if (highlight === "session_best") {
    return "bg-[var(--ds-success-bg)] font-semibold text-[var(--ds-success-text)]";
  }
  if (highlight === "personal_best") {
    return "bg-violet-500/10 font-semibold text-violet-300";
  }
  return "";
}

export function SectorsLapsTable({
  laps,
  selectedLaps,
  onToggleLap,
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("lap");
  const [sortAsc, setSortAsc] = useState(true);

  const bestTotal = useMemo(
    () =>
      Math.min(
        ...laps.filter((l) => !l.invalid).map((l) => l.total),
      ),
    [laps],
  );

  const rows = useMemo(() => {
    const list = [...laps];

    list.sort((a, b) => {
      const getVal = (lap: SectorsLapRecord): number => {
        if (sortKey === "lap") return lap.lap;
        if (sortKey === "delta") return lap.total - bestTotal;
        if (sortKey === "consistency") return lapConsistency(lap, bestTotal);
        return lap[sortKey];
      };
      const diff = getVal(a) - getVal(b);
      return sortAsc ? diff : -diff;
    });
    return list;
  }, [laps, sortKey, sortAsc, bestTotal]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const thClass =
    "cursor-pointer px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)] transition hover:text-[var(--ds-text-primary)]";

  return (
    <article className={`${SECTOR_CARD} overflow-hidden`}>
      <div className="border-b border-[var(--ds-border)] px-5 py-4 md:px-6">
        <h3 className={SECTION_TITLE}>Análise de voltas</h3>
      </div>

      <div className={`${INNER_TABLE} mx-5 mb-5 mt-4 md:mx-6`}>
        <table className="hidden w-full min-w-[640px] border-collapse text-[13px] lg:table">
          <thead>
            <tr className={TABLE_HEAD}>
              <th className="w-10 px-4 py-3" aria-label="Selecionar" />
              {(
                [
                  ["lap", "Volta"],
                  ["s1", "S1"],
                  ["s2", "S2"],
                  ["s3", "S3"],
                  ["total", "Tempo"],
                  ["delta", "Delta"],
                  ["consistency", "Consist."],
                ] as const
              ).map(([key, label]) => (
                <th
                  key={key}
                  className={thClass}
                  onClick={() => toggleSort(key)}
                  title={`Ordenar por ${label}`}
                >
                  {label}
                  {sortKey === key ? (sortAsc ? " ↑" : " ↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((lap) => {
              const selected = selectedLaps.includes(lap.lap);
              const delta = lap.total - bestTotal;
              const consistency = lapConsistency(lap, bestTotal);
              return (
                <tr
                  key={lap.lap}
                  className={`${adminTableBodyRowClass} ${
                    lap.invalid
                      ? "bg-[var(--ds-error-bg)] text-[var(--ds-error-text)]"
                      : selected
                        ? "bg-accent/5"
                        : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={lap.invalid}
                      onChange={() => onToggleLap(lap.lap)}
                      className="h-3.5 w-3.5 rounded border-neutral-300 accent-accent"
                      aria-label={`Selecionar volta ${lap.lap}`}
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-[var(--ds-text-primary)]">
                    V{lap.lap}
                    {lap.invalid ? (
                      <span className="ml-1 text-[9px] uppercase text-red-600">
                        inv.
                      </span>
                    ) : null}
                  </td>
                  {(["S1", "S2", "S3"] as SectorId[]).map((sector) => {
                    const field = sector.toLowerCase() as "s1" | "s2" | "s3";
                    const hl = TelemetryServiceMock.getLapCellHighlight(laps, lap, sector);
                    return (
                      <td
                        key={sector}
                        className={`px-4 py-3 font-mono tabular-nums text-[var(--ds-text-secondary)] ${cellClass(hl)}`}
                        title={
                          hl === "session_best"
                            ? "Melhor setor da sessão"
                            : hl === "personal_best"
                              ? "Melhor pessoal"
                              : undefined
                        }
                      >
                        {TelemetryServiceMock.formatSectorTime(lap[field])}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 font-mono font-bold tabular-nums text-[var(--ds-text-primary)]">
                    {TelemetryServiceMock.formatSectorTime(lap.total)}
                  </td>
                  <td
                    className={`px-4 py-3 font-mono tabular-nums ${
                      delta <= 0
                        ? "font-semibold text-accent"
                        : "text-[var(--ds-error-text)]"
                    }`}
                  >
                    {TelemetryServiceMock.formatDelta(delta)}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-[var(--ds-text-muted)]">
                    {lap.invalid ? "—" : `${consistency}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <ul className="flex flex-col gap-2 lg:hidden">
            {rows.map((lap) => {
              const selected = selectedLaps.includes(lap.lap);
              const delta = lap.total - bestTotal;
              const consistency = lapConsistency(lap, bestTotal);

              return (
                <li key={lap.lap}>
                  <article
                    className={`rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-card)] p-3 shadow-[var(--ds-shadow-card)] ${
                      lap.invalid
                        ? "bg-[var(--ds-error-bg)] text-[var(--ds-error-text)]"
                        : selected
                          ? "border-accent/30 bg-accent/5"
                          : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={lap.invalid}
                        onChange={() => onToggleLap(lap.lap)}
                        className="h-4 w-4 shrink-0 rounded border-neutral-300 accent-accent"
                        aria-label={`Selecionar volta ${lap.lap}`}
                      />
                      <div className="flex min-w-0 flex-1 items-baseline justify-between gap-2">
                        <p className="text-[12px] font-bold text-[var(--ds-text-primary)]">
                          V{lap.lap}
                          {lap.invalid ? (
                            <span className="ml-1 text-[9px] uppercase text-red-600">
                              inv.
                            </span>
                          ) : null}
                        </p>
                        <p className="font-mono text-[13px] font-black tabular-nums text-[var(--ds-text-primary)]">
                          {TelemetryServiceMock.formatSectorTime(lap.total)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 font-mono text-[11px] tabular-nums ${
                          delta <= 0
                        ? "font-semibold text-accent"
                        : "text-[var(--ds-error-text)]"
                        }`}
                      >
                        {TelemetryServiceMock.formatDelta(delta)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-[26px]">
                      {(["S1", "S2", "S3"] as SectorId[]).map((sector) => {
                        const field = sector.toLowerCase() as "s1" | "s2" | "s3";
                        const hl = TelemetryServiceMock.getLapCellHighlight(
                          laps,
                          lap,
                          sector,
                        );
                        return (
                          <span
                            key={sector}
                            className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] tabular-nums ring-1 ${
                              hl === "session_best"
                                ? "bg-[var(--ds-success-bg)] font-semibold text-[var(--ds-success-text)] ring-[var(--ds-success-border)]"
                                : hl === "personal_best"
                                  ? "bg-violet-500/10 font-semibold text-violet-300 ring-violet-400/30"
                                  : "bg-[var(--ds-bg-muted)] text-[var(--ds-text-secondary)] ring-[var(--ds-border-subtle)]"
                            }`}
                          >
                            {sector}{" "}
                            {TelemetryServiceMock.formatSectorTime(lap[field])}
                          </span>
                        );
                      })}
                      {!lap.invalid ? (
                        <span className="rounded-md bg-[var(--ds-bg-muted)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--ds-text-muted)] ring-1 ring-[var(--ds-border-subtle)]">
                          {consistency}%
                        </span>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
      </div>

      <div className="flex flex-wrap gap-4 border-t border-[var(--ds-border)] px-5 py-3 text-[11px] text-[var(--ds-text-secondary)] md:px-6">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded bg-[var(--ds-success-bg)] ring-1 ring-[var(--ds-success-border)]" />
          Melhor da sessão
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded bg-violet-500/20 ring-1 ring-violet-400/40" />
          Melhor pessoal (volta rápida)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded bg-[var(--ds-error-bg)] ring-1 ring-[var(--ds-error-border)]" />
          Volta inválida
        </span>
      </div>
    </article>
  );
}
