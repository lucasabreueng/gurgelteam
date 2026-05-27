"use client";

import { useEffect, useMemo, useState } from "react";
import { AppModal } from "@/components/ui/app-modal";
import type { ImportPreviewData } from "@/lib/telemetry-engine";
import {
  calculateIdealLap,
  formatLapTime,
  hasBlockingErrors,
} from "@/lib/telemetry-engine";
import { TelemetryImportMap } from "./telemetry-import-map";
import { TelemetryLapTraceEditor } from "./telemetry-lap-trace-editor";

type Props = {
  open: boolean;
  initialPreview: ImportPreviewData;
  onClose: () => void;
  onConfirm: (preview: ImportPreviewData) => void;
};

const btnSecondary =
  "flex-1 rounded-xl border border-[rgba(17,17,17,0.12)] py-3 text-[12px] font-bold uppercase tracking-wider text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-40";

const btnPrimary =
  "flex-1 rounded-xl bg-accent py-3 text-[12px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";

export function TelemetryImportPreview({
  open,
  initialPreview,
  onClose,
  onConfirm,
}: Props) {
  const [preview, setPreview] = useState(initialPreview);

  useEffect(() => {
    setPreview(initialPreview);
  }, [initialPreview]);

  const validLaps = preview.laps.filter((l) => l.isValid);
  const blocking = hasBlockingErrors(preview.validations);
  const warnings = preview.validations.filter((v) => v.severity === "warning");
  const errors = preview.validations.filter((v) => v.severity === "error");
  const ideal = calculateIdealLap(preview.laps);
  const unresolvedIssues = preview.lapIssues.filter(
    (issue) =>
      !preview.lapCorrections.some((c) => c.lapNumber === issue.lapNumber),
  );
  const canImport =
    !blocking && validLaps.length > 0 && unresolvedIssues.length === 0;

  const lapRows = useMemo(
    () =>
      preview.laps
        .filter((l) => !l.isOutLap)
        .map((l) => ({
          lap: l.lapNumber,
          time: formatLapTime(l.lapTime),
          valid: l.isValid,
          incomplete: l.isIncomplete,
          sectors: l.sectors.map((s) => formatLapTime(s.sectorTime)).join(" · "),
        })),
    [preview.laps],
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Pré-visualização da sessão"
      description="Voltas por GPS: início e fim em S1. Voltas sem todos os setores devem ser corrigidas arrastando o traçado no mapa."
      maxWidth="2xl"
    >
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
              Pista
            </p>
            <p className="mt-2 rounded-xl border border-[rgba(17,17,17,0.08)] bg-neutral-50/80 px-3 py-2.5 text-[13px] font-semibold text-[#0d1f3c]">
              {preview.trackName}
            </p>
            <p className="mt-2 text-[11px] text-neutral-500">
              Adaptador: <strong>{preview.adapterId}</strong> ·{" "}
              {preview.meta.totalPoints} pontos GPS · volta inicia/termina em{" "}
              <strong>S1</strong>
              {preview.lapCorrections.length > 0 ? (
                <>
                  {" "}
                  · <strong>{preview.lapCorrections.length}</strong>{" "}
                  {preview.lapCorrections.length === 1
                    ? "correção manual"
                    : "correções manuais"}
                </>
              ) : null}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <StatBox label="Voltas válidas" value={String(validLaps.length)} />
            <StatBox
              label="Melhor volta"
              value={
                preview.meta.bestLapTime != null
                  ? formatLapTime(preview.meta.bestLapTime)
                  : "—"
              }
            />
            <StatBox label="Volta ideal" value={formatLapTime(ideal.idealTime)} />
          </div>
        </div>

        <TelemetryImportMap preview={preview} />

        <TelemetryLapTraceEditor
          preview={preview}
          baselinePoints={initialPreview.points}
          baselineLaps={initialPreview.laps}
          onPreviewChange={setPreview}
        />

        {(errors.length > 0 || warnings.length > 0) && (
          <ul className="space-y-1 rounded-lg border border-[rgba(17,17,17,0.08)] bg-neutral-50 px-3 py-2 text-[12px]">
            {errors.map((v) => (
              <li key={v.code} className="font-medium text-red-600">
                {v.message}
              </li>
            ))}
            {warnings.map((v) => (
              <li key={v.code} className="text-amber-700">
                {v.message}
              </li>
            ))}
          </ul>
        )}

        <div className="max-h-40 overflow-y-auto rounded-lg border border-[rgba(17,17,17,0.08)]">
          <table className="w-full text-left text-[12px]">
            <thead className="sticky top-0 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
              <tr>
                <th className="px-3 py-2">Volta</th>
                <th className="px-3 py-2">Tempo</th>
                <th className="px-3 py-2">Setores</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {lapRows.map((row) => (
                <tr key={row.lap} className="border-t border-[rgba(17,17,17,0.06)]">
                  <td className="px-3 py-1.5 font-mono">{row.lap}</td>
                  <td className="px-3 py-1.5 font-mono tabular-nums">{row.time}</td>
                  <td className="px-3 py-1.5 font-mono text-neutral-600">
                    {row.sectors || "—"}
                  </td>
                  <td className="px-3 py-1.5">
                    {row.incomplete ? (
                      <span className="text-amber-600">Incompleta</span>
                    ) : row.valid ? (
                      <span className="text-emerald-700">Válida</span>
                    ) : (
                      <span className="text-neutral-500">Inválida</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="-mx-6 -mb-5 mt-4 flex gap-2 border-t border-[rgba(17,17,17,0.06)] bg-neutral-50/50 px-6 py-4">
        <button type="button" onClick={onClose} className={btnSecondary}>
          Cancelar
        </button>
        <button
          type="button"
          disabled={!canImport}
          onClick={() => onConfirm(preview)}
          className={btnPrimary}
          title={
            unresolvedIssues.length > 0
              ? "Corrija ou exclua todas as voltas com setores ausentes"
              : undefined
          }
        >
          Importar sessão
        </button>
      </div>
    </AppModal>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-neutral-50/80 px-2 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-[14px] font-bold text-[#0d1f3c]">{value}</p>
    </div>
  );
}
