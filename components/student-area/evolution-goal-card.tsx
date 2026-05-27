"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HiCog8Tooth } from "react-icons/hi2";

type GoalShape = {
  title: string;
  description: string;
  targetLap: string;
  currentBest: string;
  progressPercent: number;
};

const DEFAULT_DEADLINE_ISO = "2026-06-30";

/** Converte texto tipo 53.842 ou 53,842 para segundos */
function parseLapTime(input: string): number | null {
  const trimmed = input.trim().replace(",", ".");
  const n = parseFloat(trimmed);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Exibe volta no padrão BR com vírgula */
function formatLapDisplay(seconds: number) {
  return seconds.toFixed(3).replace(".", ",");
}

function computeProgress(bestSec: number, targetSec: number): number {
  if (bestSec <= targetSec) return 100;
  const span = Math.max(0.4, Math.min(4, bestSec - targetSec + 2));
  const pct = Math.round(100 * (1 - (bestSec - targetSec) / span));
  return Math.min(98, Math.max(8, pct));
}

function formatDeadlineLabel(isoDate: string) {
  try {
    const d = new Date(isoDate + "T12:00:00");
    if (Number.isNaN(d.getTime())) return `até ${isoDate}`;
    return `até ${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}`;
  } catch {
    return `até ${isoDate}`;
  }
}

type Props = {
  initial: GoalShape;
  initialDeadlineIso?: string;
};

export function EvolutionGoalCard({
  initial,
  initialDeadlineIso = DEFAULT_DEADLINE_ISO,
}: Props) {
  const [targetDisplay, setTargetDisplay] = useState(initial.targetLap);
  const [deadlineIso, setDeadlineIso] = useState(initialDeadlineIso);
  const [progressPercent, setProgressPercent] = useState(initial.progressPercent);
  const [modalOpen, setModalOpen] = useState(false);

  const [draftTime, setDraftTime] = useState(initial.targetLap);
  const [draftDeadline, setDraftDeadline] = useState(initialDeadlineIso);

  const bestParsed = parseLapTime(initial.currentBest.replace("s", ""));

  const syncProgress = useCallback(
    (targetStr: string) => {
      const t = parseLapTime(targetStr);
      if (bestParsed == null || t == null) {
        setProgressPercent(initial.progressPercent);
        return;
      }
      setProgressPercent(computeProgress(bestParsed, t));
    },
    [bestParsed, initial.progressPercent],
  );

  useEffect(() => {
    syncProgress(targetDisplay);
  }, [targetDisplay, syncProgress]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    if (modalOpen) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [modalOpen]);

  const deadlineLabel = useMemo(
    () => formatDeadlineLabel(deadlineIso),
    [deadlineIso],
  );

  const openModal = () => {
    setDraftTime(targetDisplay);
    setDraftDeadline(deadlineIso);
    setModalOpen(true);
  };

  const saveModal = () => {
    const parsed = parseLapTime(draftTime);
    if (parsed != null) {
      setTargetDisplay(formatLapDisplay(parsed));
    }
    setDeadlineIso(draftDeadline);
    setModalOpen(false);
  };

  return (
    <>
      <div className="relative flex min-h-0 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-gradient-to-br from-[#0b1630] via-[#0d1f3c] to-[#183458] p-5 text-white shadow-[0_12px_40px_rgba(13,31,60,0.22)] md:p-6">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#c41e3a]/12 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-amber-400/10 blur-3xl"
          aria-hidden
        />

        <div className="relative z-[1] w-full space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/72">
                {initial.title}
              </p>
              <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-white/82 md:text-[13.5px]">
                {initial.description}
              </p>
            </div>
            <button
              type="button"
              onClick={openModal}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/18 bg-black/22 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/95 backdrop-blur-md transition hover:border-white/30 hover:bg-black/35 md:px-3"
            >
              <HiCog8Tooth className="text-sm opacity-90" aria-hidden />
              Ajustar meta
            </button>
          </div>

          <div className="w-full rounded-xl border border-white/10 bg-black/14 px-4 py-3.5 backdrop-blur-sm">
            <div className="flex w-full items-baseline justify-between gap-3 text-sm">
              <span className="shrink-0 text-[12px] font-medium text-white/60">
                Meta
              </span>
              <span className="min-w-0 text-right font-mono text-[15px] font-bold tabular-nums tracking-tight text-amber-100">
                {targetDisplay}s
              </span>
            </div>
            <div className="mt-2.5 flex w-full items-baseline justify-between gap-3 border-t border-white/10 pt-2.5 text-sm">
              <span className="shrink-0 text-[12px] font-medium text-white/60">
                Seu recorde
              </span>
              <span className="min-w-0 text-right font-mono text-[14px] font-bold tabular-nums text-white">
                {initial.currentBest}s
              </span>
            </div>
            <div className="mt-2.5 flex w-full items-baseline justify-between gap-3 border-t border-white/10 pt-2.5">
              <span className="shrink-0 text-[12px] font-medium text-white/60">
                Prazo
              </span>
              <span className="max-w-[70%] text-right text-[12px] font-semibold leading-snug text-white/88 md:max-w-[75%]">
                {deadlineLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-[1] mt-6">
          <div className="flex items-center justify-between gap-2 text-[11px] text-white/70">
            <span className="font-semibold uppercase tracking-wider">
              Progresso rumo à meta
            </span>
            <span className="font-bold tabular-nums text-white">
              {progressPercent}%
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.13] shadow-inner shadow-black/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 transition-[width] duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {modalOpen ? (
        <div
          role="presentation"
          className="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="meta-modal-title"
            className="w-full max-w-md rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="meta-modal-title" className="text-lg font-bold text-[#0d1f3c]">
              Ajustar meta do trimestre
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Defina o tempo‑alvo da melhor volta e a data‑limite. Use segundos
              com vírgula ou ponto (ex.: 53,450).
            </p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                  Tempo objetivo (s)
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={draftTime}
                  onChange={(e) => setDraftTime(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[rgba(17,17,17,0.12)] px-4 py-2.5 font-mono text-[15px] text-[#111] outline-none ring-accent/40 focus:border-accent focus:ring-2"
                  placeholder="53,500"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                  Prazo
                </span>
                <input
                  type="date"
                  value={draftDeadline}
                  onChange={(e) => setDraftDeadline(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[rgba(17,17,17,0.12)] px-4 py-2.5 text-[15px] text-[#111] outline-none ring-accent/40 focus:border-accent focus:ring-2"
                />
              </label>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-xl border border-[rgba(17,17,17,0.12)] px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-accent/30 transition hover:brightness-105"
                onClick={saveModal}
              >
                Guardar meta
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
