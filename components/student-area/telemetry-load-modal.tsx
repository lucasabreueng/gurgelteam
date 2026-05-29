"use client";

import "@/lib/random-id";

import { useEffect, useRef, useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";
import { AppDropdown } from "@/components/ui/app-dropdown";
import { AppModal } from "@/components/ui/app-modal";
import {
  exportGoproGpsCsvFromVideo,
  type GoproExportProgress,
} from "@/lib/gopro-gps-export";
import {
  createSessionId,
  previewToSession,
  readFileAsText,
  saveProcessedSession,
  telemetryQueue,
  type ImportPreviewData,
  type PipelineProgress,
  type TelemetrySource,
} from "@/lib/telemetry-engine";
import type { UserTrackRecord } from "@/lib/telemetry-engine/tracks/user-track-types";
import { TelemetryImportPreview } from "@/components/student-area/telemetry/import/telemetry-import-preview";
import {
  TelemetryServiceMock,
  type TelemetryDeviceType as TelemetryDeviceTypeFromService,
} from "@/services/telemetry/telemetryServiceMock";

type Props = {
  open: boolean;
  onClose: () => void;
  onImported?: (payload: {
    sessionId: string;
    fileName: string;
    device: TelemetryDeviceTypeFromService;
  }) => void;
  tracksRevision?: number;
  onOpenTracks?: () => void;
};

const VIDEO_ACCEPT =
  "video/mp4,video/quicktime,video/x-msvideo,.mp4,.mov,.avi";

const btnSecondary =
  "flex-1 rounded-xl border border-[rgba(17,17,17,0.12)] py-3 text-[12px] font-bold uppercase tracking-wider text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-40";

const btnPrimary =
  "flex-1 rounded-xl bg-accent py-3 text-[12px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";

function deviceToSource(
  device: TelemetryDeviceTypeFromService,
): TelemetrySource {
  if (device === "alfano") return "alfano";
  if (device === "gopro") return "gopro";
  return "mychron";
}

export function TelemetryLoadModal({
  open,
  onClose,
  onImported,
  tracksRevision,
  onOpenTracks,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [device, setDevice] = useState<TelemetryDeviceTypeFromService>("mychron");
  const [file, setFile] = useState<File | null>(null);
  const [userTracks, setUserTracks] = useState<UserTrackRecord[]>([]);
  const [tracksLoading, setTracksLoading] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [goproProgress, setGoproProgress] = useState<GoproExportProgress | null>(null);
  const [goproSuccess, setGoproSuccess] = useState<string | null>(null);
  const [pipelineProgress, setPipelineProgress] = useState<PipelineProgress | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<ImportPreviewData | null>(null);

  useEffect(() => {
    if (!open) {
      setDevice("mychron");
      setFile(null);
      setSelectedTrackId("");
      setError(null);
      setLoading(false);
      setGoproProgress(null);
      setGoproSuccess(null);
      setPipelineProgress(null);
      setPreviewOpen(false);
      setPreviewData(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setTracksLoading(true);
    void TelemetryServiceMock.listUserTracks()
      .then((rows) => {
        setUserTracks(rows);
        setSelectedTrackId((prev) => {
          if (prev && rows.some((t) => t.id === prev)) return prev;
          return rows[0]?.id ?? "";
        });
      })
      .finally(() => setTracksLoading(false));
  }, [open, tracksRevision]);

  const isGopro = device === "gopro";
  const accept = isGopro ? VIDEO_ACCEPT : ".csv,text/csv";
  const fileLabel = isGopro ? "Arquivo de vídeo" : "Arquivo .csv";

  const handleDeviceChange = (next: TelemetryDeviceTypeFromService) => {
    setDevice(next);
    setFile(null);
    setError(null);
    setGoproSuccess(null);
    setGoproProgress(null);
    setPreviewOpen(false);
    setPreviewData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    setError(null);
    setGoproSuccess(null);
    setPreviewOpen(false);
    setPreviewData(null);
    if (!picked) {
      setFile(null);
      return;
    }
    if (isGopro) {
      const name = picked.name.toLowerCase();
      const isVideo =
        picked.type.startsWith("video/") ||
        name.endsWith(".mp4") ||
        name.endsWith(".mov") ||
        name.endsWith(".avi");
      if (!isVideo) {
        setError("Selecione um vídeo GoPro (.mp4 ou .mov recomendado).");
        setFile(null);
        return;
      }
    } else {
      const name = picked.name.toLowerCase();
      if (!name.endsWith(".csv")) {
        setError("Selecione um arquivo .csv exportado pelo datalogger.");
        setFile(null);
        return;
      }
    }
    setFile(picked);
  };

  const runCsvPipeline = async (csvFile: File, source: TelemetrySource) => {
    const text = await readFileAsText(csvFile);
    const preview = await telemetryQueue.enqueueCsvText(text, {
      source,
      sourceFileName: csvFile.name,
      trackId: selectedTrackId,
      onProgress: setPipelineProgress,
    });
    setPreviewData(preview);
    setPreviewOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrackId) {
      setError("Selecione a pista da sessão antes de continuar.");
      return;
    }
    if (!file) {
      setError(`Selecione ${isGopro ? "o vídeo" : "o arquivo .csv"} para continuar.`);
      return;
    }

    setLoading(true);
    setError(null);
    setGoproSuccess(null);
    setGoproProgress(null);
    setPipelineProgress(null);

    try {
      if (isGopro) {
        const result = await exportGoproGpsCsvFromVideo(file, setGoproProgress);
        setGoproSuccess(
          `${result.csvFileName} (${result.rowCount} pontos GPS · ${result.streamKey})`,
        );
        const csvBlob = new Blob([result.csvContent], { type: "text/csv" });
        const csvFile = new File([csvBlob], result.csvFileName, { type: "text/csv" });
        await runCsvPipeline(csvFile, "gopro");
      } else {
        await runCsvPipeline(file, deviceToSource(device));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao processar o arquivo.");
    } finally {
      setLoading(false);
      setGoproProgress(null);
      setPipelineProgress(null);
    }
  };

  const handleConfirmImport = async (preview: ImportPreviewData) => {
    setLoading(true);
    try {
      const sessionId = createSessionId();
      const session = previewToSession(preview, sessionId);
      await saveProcessedSession(session);
      onImported?.({ sessionId, fileName: preview.sourceFileName, device });
      setPreviewOpen(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar sessão.");
    } finally {
      setLoading(false);
    }
  };

  const loadingLabel =
    pipelineProgress?.message ??
    goproProgress?.message ??
    (isGopro ? "Processando vídeo…" : "Processando telemetria…");

  const progressPercent = pipelineProgress?.percent ?? goproProgress?.percent ?? 0;

  return (
    <>
      <AppModal
        open={open && !previewOpen}
        onClose={onClose}
        title="Carregar telemetria"
        maxWidth="lg"
        preventClose={loading}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="telemetry-track"
              className="text-[11px] font-bold uppercase tracking-wider text-neutral-600"
            >
              Pista da sessão
            </label>
            {tracksLoading ? (
              <p className="mt-2 text-[12px] text-neutral-500">Carregando pistas…</p>
            ) : userTracks.length === 0 ? (
              <div className="mt-2 rounded-xl border border-dashed border-[rgba(17,17,17,0.15)] bg-neutral-50/80 px-4 py-4">
                <p className="text-[13px] font-medium text-[#0d1f3c]">
                  Nenhuma pista cadastrada
                </p>
                <p className="mt-1 text-[12px] text-neutral-600">
                  Cadastre a pista em <strong>Pistas</strong> antes de importar telemetria.
                </p>
                {onOpenTracks ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenTracks();
                    }}
                    className="mt-3 rounded-xl bg-accent px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:brightness-110"
                  >
                    Abrir cadastro de pistas
                  </button>
                ) : null}
              </div>
            ) : (
              <AppDropdown
                id="telemetry-track"
                aria-label="Pista da sessão"
                options={userTracks.map((t) => ({
                  value: t.id,
                  label: `${t.name} — ${t.city}`,
                }))}
                value={selectedTrackId}
                onSelect={setSelectedTrackId}
                disabled={loading}
                placeholder="Selecionar pista"
                rootClassName="relative mt-2 block w-full min-w-0 rounded-xl border border-[rgba(17,17,17,0.12)] bg-white shadow-sm focus-within:ring-2 focus-within:ring-accent/15"
                triggerClassName="flex h-11 w-full min-w-0 cursor-pointer items-center rounded-xl border-0 bg-transparent px-3 py-0 text-left outline-none transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                labelClassName="flex w-full items-center justify-between gap-2 text-[13px] font-semibold text-[#0d1f3c]"
                listClassName="z-[350] !border !border-[rgba(17,17,17,0.1)] !bg-white shadow-[0_4px_20px_rgba(13,31,60,0.08)]"
                optionClassName="!font-medium !text-[#0d1f3c] hover:!bg-neutral-50"
                chevron={
                  <HiOutlineChevronDown
                    className="h-[18px] w-[18px] shrink-0 text-neutral-500"
                    aria-hidden
                  />
                }
              />
            )}
          </div>

          <fieldset disabled={loading}>
            <legend className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
              Tipo de telemetria
            </legend>
            <div
              className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3"
              role="radiogroup"
              aria-label="Tipo de telemetria"
            >
              {TelemetryServiceMock.getTelemetryDeviceOptions().map((opt) => {
                const selected = device === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={loading}
                    onClick={() => handleDeviceChange(opt.id)}
                    className={`rounded-xl border px-3 py-3 text-left transition ${
                      selected
                        ? "border-accent/40 bg-accent/5 ring-1 ring-accent/30"
                        : "border-[rgba(17,17,17,0.1)] bg-neutral-50/80 hover:border-[rgba(17,17,17,0.18)]"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    <span className="block text-[13px] font-bold text-[#0d1f3c]">
                      {opt.label}
                    </span>
                    <span className="mt-1 block text-[11px] leading-snug text-neutral-600">
                      {opt.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="telemetry-file"
              className="text-[11px] font-bold uppercase tracking-wider text-neutral-600"
            >
              {fileLabel}
            </label>
            <input
              ref={fileInputRef}
              id="telemetry-file"
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={loading}
              className="mt-2 block w-full text-[13px] text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0d1f3c] file:px-3 file:py-2 file:text-[11px] file:font-semibold file:uppercase file:tracking-wide file:text-white hover:file:brightness-110"
            />
            {loading && (goproProgress || pipelineProgress) ? (
              <div className="mt-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-neutral-50 px-3 py-3">
                <p className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-medium text-neutral-700">{loadingLabel}</span>
                  <span className="font-mono tabular-nums text-neutral-500">
                    {progressPercent}%
                  </span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : null}

            {goproSuccess ? (
              <p className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-800">
                GPS extraído: <strong>{goproSuccess}</strong>
              </p>
            ) : null}

            {error ? (
              <p className="mt-2 text-[12px] font-medium text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className="-mx-6 -mb-5 flex gap-2 border-t border-[rgba(17,17,17,0.06)] bg-neutral-50/50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={btnSecondary}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !file || !selectedTrackId || userTracks.length === 0}
              className={btnPrimary}
            >
              {loading ? loadingLabel : isGopro ? "Extrair e analisar" : "Analisar CSV"}
            </button>
          </div>
        </form>
      </AppModal>

      {previewData ? (
        <TelemetryImportPreview
          open={previewOpen}
          initialPreview={previewData}
          onClose={() => setPreviewOpen(false)}
          onConfirm={handleConfirmImport}
        />
      ) : null}
    </>
  );
}
