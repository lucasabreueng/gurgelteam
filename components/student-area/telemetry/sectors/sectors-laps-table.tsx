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
  if (highlight === "session_best") return "bg-emerald-50 font-semibold text-emerald-700";
  if (highlight === "personal_best") return "bg-violet-50 font-semibold text-violet-700";
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
    "cursor-pointer px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-neutral-600 transition hover:text-[#0d1f3c]";

  return (
    <article className={`${SECTOR_CARD} overflow-hidden`}>
      <div className="border-b border-[rgba(17,17,17,0.08)] px-5 py-4 md:px-6">
        <h3 className={SECTION_TITLE}>Análise de voltas</h3>
      </div>

      <div className={`${INNER_TABLE} mx-5 mb-5 mt-4 md:mx-6`}>
        <table className="w-full min-w-[640px] border-collapse text-[13px]">
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
                  className={`border-b border-dashed border-neutral-200 transition last:border-0 ${
                    lap.invalid
                      ? "bg-red-50/80 text-red-700/90"
                      : selected
                        ? "bg-accent/5"
                        : "hover:bg-white/90"
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
                  <td className="px-4 py-3 font-semibold text-neutral-800">
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
                        className={`px-4 py-3 font-mono tabular-nums text-neutral-800 ${cellClass(hl)}`}
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
                  <td className="px-4 py-3 font-mono font-bold tabular-nums text-[#0d1f3c]">
                    {TelemetryServiceMock.formatSectorTime(lap.total)}
                  </td>
                  <td
                    className={`px-4 py-3 font-mono tabular-nums ${
                      delta <= 0 ? "font-semibold text-accent" : "text-red-600"
                    }`}
                  >
                    {TelemetryServiceMock.formatDelta(delta)}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-neutral-600">
                    {lap.invalid ? "—" : `${consistency}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-4 border-t border-[rgba(17,17,17,0.08)] px-5 py-3 text-[11px] text-neutral-600 md:px-6">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded bg-emerald-100 ring-1 ring-emerald-200" />
          Melhor da sessão
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded bg-violet-100 ring-1 ring-violet-200" />
          Melhor pessoal (volta rápida)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded bg-red-100 ring-1 ring-red-200" />
          Volta inválida
        </span>
      </div>
    </article>
  );
}
