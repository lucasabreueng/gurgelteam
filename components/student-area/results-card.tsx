"use client";

import { StudentAreaServiceMock } from "@/services/student/studentAreaServiceMock";
import type { ResultRow } from "@/lib/contracts/student-area";

import { useEffect, useState } from "react";


type ResultsCardProps = {
  className?: string;
};

function ResultsTable({
  rows,
  onSelect,
}: {
  rows: readonly ResultRow[];
  onSelect: (row: ResultRow) => void;
}) {
  return (
    <table className="w-full min-w-[540px] border-collapse text-left text-[13px]">
      <thead>
        <tr className="border-b border-[rgba(17,17,17,0.08)] bg-neutral-100/80 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
          <th className="px-4 py-3">Data</th>
          <th className="px-4 py-3 text-right">Melhor tempo</th>
          <th className="px-4 py-3 text-right">Tempo médio</th>
          <th className="px-4 py-3 text-right">Tempo total de pista</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.id}
            className="cursor-pointer border-b border-dashed border-neutral-200 transition last:border-0 hover:bg-white/90"
            onClick={() => onSelect(row)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(row);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <td className="px-4 py-3 font-medium text-neutral-800">
              {row.dateLabel}
            </td>
            <td className="px-4 py-3 text-right font-bold tabular-nums text-accent">
              {row.bestLap}s
            </td>
            <td className="px-4 py-3 text-right tabular-nums text-neutral-800">
              {row.avgLap}s
            </td>
            <td className="px-4 py-3 text-right font-medium tabular-nums text-neutral-700">
              {row.totalTrackTime}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ResultsCard({ className = "" }: ResultsCardProps) {
  const [listOpen, setListOpen] = useState(false);
  const [detail, setDetail] = useState<ResultRow | null>(null);

  useEffect(() => {
    if (!detail && !listOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (detail) setDetail(null);
      else setListOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [detail, listOpen]);

  return (
    <>
      <div
        className={`flex h-full min-h-0 flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6 ${className}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-[#0d1f3c]">
            Histórico de treinos
          </h3>
          <button
            type="button"
            onClick={() => setListOpen(true)}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.12)] bg-white px-4 py-2 text-sm font-semibold text-accent shadow-sm transition hover:border-accent/30 hover:bg-neutral-50"
          >
            Mais
          </button>
        </div>
        <div className="mt-6 min-h-0 flex-1 overflow-x-auto rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fdfdfd] shadow-inner">
          <ResultsTable rows={StudentAreaServiceMock.getLastResults()} onSelect={setDetail} />
        </div>
      </div>

      {listOpen ? (
        <div
          role="presentation"
          className="fixed inset-0 z-[205] flex items-center justify-center bg-black/55 p-4"
          onClick={() => setListOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="historico-modal-title"
            className="flex max-h-[min(90vh,640px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
              <div>
                <h2
                  id="historico-modal-title"
                  className="text-lg font-bold text-[#0d1f3c]"
                >
                  Histórico completo de treinos
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Toque numa linha para ver volta a volta
                </p>
              </div>
              <button
                type="button"
                className="rounded-xl bg-[#0d1f3c] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                onClick={() => setListOpen(false)}
              >
                Fechar
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto px-2 py-3">
              <ResultsTable
                rows={StudentAreaServiceMock.getLastResults()}
                onSelect={(row) => {
                  setListOpen(false);
                  setDetail(row);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {detail ? (
        <div
          role="presentation"
          className="fixed inset-0 z-[205] flex items-center justify-center bg-black/55 p-4"
          onClick={() => setDetail(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="treino-detalhe-titulo"
            className="max-h-[min(90vh,640px)] w-full max-w-lg overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-neutral-100 px-5 py-4">
              <h2
                id="treino-detalhe-titulo"
                className="text-lg font-bold text-[#0d1f3c]"
              >
                Treino · {detail.dateLabel}
              </h2>
              <p className="mt-1 text-[13px] text-neutral-600">
                Melhor:{" "}
                <span className="font-bold tabular-nums text-accent">
                  {detail.bestLap}s
                </span>
                {" · "}
                Média:{" "}
                <span className="font-mono font-semibold tabular-nums">
                  {detail.avgLap}s
                </span>
                {" · "}
                Total em pista:{" "}
                <span className="font-semibold tabular-nums">
                  {detail.totalTrackTime}
                </span>
              </p>
            </div>
            <div className="max-h-[min(52vh,420px)] overflow-y-auto px-2 py-3">
              <table className="w-full border-collapse text-[13px]">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-neutral-200 text-left text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    <th className="px-3 py-2">Volta</th>
                    <th className="px-3 py-2 text-right">Tempo</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.laps.map((l) => (
                    <tr
                      key={l.lap}
                      className="border-b border-dashed border-neutral-100 last:border-0"
                    >
                      <td className="px-3 py-2 font-medium text-neutral-700">
                        {l.lap}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-semibold tabular-nums text-[#111]">
                        {l.time}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end border-t border-neutral-100 px-4 py-3">
              <button
                type="button"
                className="rounded-xl bg-[#0d1f3c] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                onClick={() => setDetail(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
