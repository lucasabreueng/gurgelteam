"use client";

import { HiPlus } from "react-icons/hi2";
import {
  createEmptyLap,
  type LapRow,
  type LapValidationIssue,
} from "@/lib/lesson-registration-laps";
import { LapsTable } from "./laps-table";
import { OcrImageViewer } from "./ocr-image-viewer";

type Props = {
  imageUrl: string;
  laps: LapRow[];
  issues: LapValidationIssue[];
  onLapsChange: (laps: LapRow[]) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

const actionBtnClass =
  "flex h-12 w-full items-center justify-center gap-1.5 rounded-xl px-2 text-center text-[10px] font-bold uppercase tracking-wider transition";

export function OcrReviewPanel({
  imageUrl,
  laps,
  issues,
  onLapsChange,
  onConfirm,
  onCancel,
}: Props) {
  const hasErrors = issues.length > 0;
  const hasAnyTime = laps.some(
    (r) => r.s1.trim() || r.s2.trim() || r.s3.trim() || r.total.trim(),
  );

  const addLap = () => {
    onLapsChange([...laps, createEmptyLap(laps.length + 1)]);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200/60 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
        {hasAnyTime
          ? "Revise os tempos extraídos antes de salvar. O OCR pode conter erros — ajuste a tabela e confirme."
          : "Não foi possível ler os tempos automaticamente. Preencha a tabela ao lado usando a foto como referência."}
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-neutral-900 p-2">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Imagem original
          </p>
          {imageUrl ? (
            <OcrImageViewer src={imageUrl} alt="Cronometragem" />
          ) : (
            <div className="flex h-[min(420px,50vh)] items-center justify-center rounded-xl bg-black text-neutral-500">
              Sem preview
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Conferência dos tempos
          </p>
          <LapsTable
            rows={laps}
            onChange={onLapsChange}
            issues={issues}
            hideAddButton
          />
          {hasErrors ? (
            <ul className="mt-3 space-y-1 text-xs text-red-700">
              {issues.slice(0, 4).map((i, idx) => (
                <li key={`${i.lapId}-${idx}`}>• {i.message}</li>
              ))}
              {issues.length > 4 ? (
                <li>• +{issues.length - 4} inconsistência(s)</li>
              ) : null}
            </ul>
          ) : null}

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[rgba(17,17,17,0.06)] pt-4">
            <button
              type="button"
              onClick={onCancel}
              className={`${actionBtnClass} border border-[rgba(13,31,60,0.2)] text-[#0d1f3c] hover:bg-[#fafbfc]`}
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={addLap}
              className={`${actionBtnClass} border border-dashed border-[rgba(13,31,60,0.25)] text-[#0d1f3c] hover:border-accent/40`}
            >
              <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
              Adicionar volta
            </button>
            <button
              type="button"
              disabled={!hasAnyTime}
              onClick={onConfirm}
              className={`${actionBtnClass} bg-[#0d1f3c] text-white hover:brightness-110 disabled:opacity-40`}
            >
              {hasErrors ? "Confirmar e ajustar" : "Confirmar tempos"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
