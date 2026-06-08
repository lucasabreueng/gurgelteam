"use client";

import type { ResultRow } from "@/lib/contracts/student-area";
import { usePilotHome } from "@/lib/query/hooks/use-pilot-home";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";

import { useEffect, useState } from "react";

import { StudentCardActionButton } from "./student-card-action-button";
import { StudentCardEmptyState } from "./student-card-empty-state";

type ResultsCardProps = {
  className?: string;
};

function ResultCard({
  row,
  onSelect,
}: {
  row: ResultRow;
  onSelect: (row: ResultRow) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(row)}
      className="flex w-full items-center gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-3 text-left transition hover:border-accent/25 hover:bg-neutral-50/90 hover:shadow-sm"
    >
      <span className="min-w-0 shrink-0 text-sm font-bold text-[#0d1f3c]">
        {row.dateLabel}
      </span>
      <span className="ml-auto shrink-0 font-mono text-sm font-bold tabular-nums text-accent">
        {row.bestLap}s
      </span>
      <span className="shrink-0 text-[11px] tabular-nums text-neutral-500">
        méd.{" "}
        <span className="font-mono text-sm font-semibold text-neutral-800">
          {row.avgLap}s
        </span>
      </span>
    </button>
  );
}

function ResultsTable({
  rows,
  onSelect,
}: {
  rows: readonly ResultRow[];
  onSelect: (row: ResultRow) => void;
}) {
  return (
    <table className="w-full border-collapse text-left text-[13px]">
      <thead>
        <tr className="border-b border-[rgba(17,17,17,0.08)] bg-neutral-100/80 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
          <th className="px-4 py-3">Data</th>
          <th className="px-4 py-3 text-right">Melhor tempo</th>
          <th className="px-4 py-3 text-right">Tempo médio</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ResultsList({
  rows,
  onSelect,
}: {
  rows: readonly ResultRow[];
  onSelect: (row: ResultRow) => void;
}) {
  return (
    <ul className="flex flex-col gap-2 p-3 sm:p-4">
      {rows.map((row) => (
        <li key={row.id}>
          <ResultCard row={row} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}

function ResultsMobileList({
  rows,
  onSelect,
}: {
  rows: readonly ResultRow[];
  onSelect: (row: ResultRow) => void;
}) {
  return (
    <ul className="divide-y divide-[rgba(17,17,17,0.06)]">
      {rows.map((row) => (
        <li key={row.id}>
          <button
            type="button"
            onClick={() => onSelect(row)}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-neutral-50/80"
          >
            <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[#0d1f3c]">
              {row.dateLabel}
            </span>
            <span className="shrink-0 font-mono text-[12px] font-bold tabular-nums text-accent">
              {row.bestLap}s
            </span>
            <span className="shrink-0 text-[11px] tabular-nums text-neutral-500">
              méd. {row.avgLap}s
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function ResultsContent({
  rows,
  onSelect,
  tabletLandscape,
}: {
  rows: readonly ResultRow[];
  onSelect: (row: ResultRow) => void;
  tabletLandscape: boolean;
}) {
  if (rows.length === 0) {
    return (
      <StudentCardEmptyState
        title="Nenhum treino registrado"
        description="Quando você concluir sessões na pista, o histórico com melhor tempo e média aparecerá aqui."
      />
    );
  }

  if (tabletLandscape) {
    return <ResultsList rows={rows} onSelect={onSelect} />;
  }

  return (
    <>
      <div className="hidden lg:block">
        <ResultsTable rows={rows} onSelect={onSelect} />
      </div>
      <div className="lg:hidden">
        <ResultsMobileList rows={rows} onSelect={onSelect} />
      </div>
    </>
  );
}

export function ResultsCard({ className = "" }: ResultsCardProps) {
  const { tabletLandscape } = useAdminPanelTabletLayout();
  const [listOpen, setListOpen] = useState(false);
  const [detail, setDetail] = useState<ResultRow | null>(null);
  const { data: home } = usePilotHome();
  const results = home?.results ?? [];
  const hasResults = results.length > 0;

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
          <StudentCardActionButton
            onClick={() => setListOpen(true)}
            disabled={!hasResults}
            aria-disabled={!hasResults}
            className={!hasResults ? "pointer-events-none opacity-50" : ""}
          >
            Mais
          </StudentCardActionButton>
        </div>
        <div
          className={`mt-4 min-h-0 flex-1 overflow-y-auto rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] lg:mt-6 ${
            tabletLandscape ? "" : "lg:bg-[#fdfdfd] lg:shadow-inner"
          }`}
        >
          <ResultsContent
            rows={results}
            onSelect={setDetail}
            tabletLandscape={tabletLandscape}
          />
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
                  {tabletLandscape
                    ? "Toque num card para ver volta a volta"
                    : "Toque numa linha para ver volta a volta"}
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
            <div className="min-h-0 flex-1 overflow-auto">
              <ResultsContent
                rows={results}
                onSelect={(row) => {
                  setListOpen(false);
                  setDetail(row);
                }}
                tabletLandscape={tabletLandscape}
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
