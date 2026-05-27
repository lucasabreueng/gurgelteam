import type {
  ImportPreviewData,
  PipelineProgress,
  ProcessedTelemetrySession,
  TelemetrySource,
  Track,
  ValidationIssue,
} from "../types";
import { detectAdapter, normalizeWithAdapter } from "../adapters/registry";
import { parseCsvContent, readFileAsText, sampleRows } from "../csv/parse-csv";
import {
  cloneTrackLines,
  getDefaultTrack,
} from "../tracks/catalog";
import {
  detectBestTrackAsync,
  getTrackByIdAsync,
} from "../tracks/track-resolver";
import {
  diagnoseLapSectorIssues,
} from "./lap-quality";
import {
  reconstructLapsAndSectors,
  validateTelemetryInput,
} from "./reconstruct";
import { calculateIdealLap, formatSessionDate } from "./ideal-lap";

export type ProcessOptions = {
  source: TelemetrySource;
  sourceFileName: string;
  trackId?: string;
  customLines?: ProcessedTelemetrySession["appliedLines"];
  onProgress?: (progress: PipelineProgress) => void;
};

function yieldToMain(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

function report(
  onProgress: ProcessOptions["onProgress"],
  status: PipelineProgress["status"],
  percent: number,
  message: string,
): void {
  onProgress?.({ status, percent, message });
}

export function refreshLapMeta(
  laps: ProcessedTelemetrySession["laps"],
): Omit<ProcessedTelemetrySession["meta"], "totalPoints"> {
  return buildMeta(laps);
}

function buildMeta(
  laps: ProcessedTelemetrySession["laps"],
): ProcessedTelemetrySession["meta"] {
  const valid = laps.filter((l) => l.isValid);
  const best =
    valid.length > 0
      ? Math.min(...valid.map((l) => l.lapTime))
      : null;
  const avg =
    valid.length > 0
      ? valid.reduce((a, l) => a + l.lapTime, 0) / valid.length
      : null;

  return {
    totalPoints: 0,
    validLapCount: valid.length,
    bestLapTime: best,
    averageLapTime: avg,
    outLapDetected: laps.some((l) => l.isOutLap),
    incompleteLapDetected: laps.some((l) => l.isIncomplete),
  };
}

export async function processCsvText(
  csvText: string,
  options: ProcessOptions,
): Promise<ImportPreviewData> {
  const { onProgress, source, sourceFileName, trackId, customLines } = options;

  report(onProgress, "uploaded", 5, "Arquivo recebido");
  await yieldToMain();

  report(onProgress, "parsing", 15, "Analisando estrutura do CSV…");
  const parsed = parseCsvContent(csvText);
  const detected = detectAdapter(
    parsed.headers,
    sampleRows(parsed.rows),
    source === "gopro" ? "generic_gps" : source,
  );
  await yieldToMain();

  if (!detected.mapping.latitude || !detected.mapping.longitude) {
    const preview = parsed.headers.slice(0, 12).join(", ");
    throw new Error(
      `Colunas GPS não encontradas no CSV. Cabeçalhos detectados: ${preview}${parsed.headers.length > 12 ? "…" : ""}. ` +
        "No Race Studio, exporte com GPS Latitude/Longitude (ou GPS N/S e GPS E/W) habilitados.",
    );
  }

  report(onProgress, "normalizing", 35, `Normalizando (${detected.adapterId})…`);
  const points = normalizeWithAdapter(
    detected.adapterId,
    parsed.rows,
    detected.mapping,
  );
  await yieldToMain();

  let track: Track;
  if (trackId) {
    const resolved = await getTrackByIdAsync(trackId);
    if (!resolved) {
      throw new Error("Pista selecionada não encontrada. Cadastre-a em Pistas.");
    }
    track = resolved;
  } else {
    track = (await detectBestTrackAsync(points)) ?? getDefaultTrack();
  }
  const appliedLines = customLines ?? cloneTrackLines(track);

  report(
    onProgress,
    "reconstructing_laps",
    60,
    "Reconstruindo voltas via GPS (início/fim em S1)…",
  );

  const { points: tagged, laps, crossings } = reconstructLapsAndSectors(
    points,
    appliedLines,
  );
  await yieldToMain();

  const lapIssues = diagnoseLapSectorIssues(laps);

  report(onProgress, "calculating_sectors", 80, "Calculando setores e volta ideal…");
  const validations = validateTelemetryInput(tagged, track, appliedLines);

  if (lapIssues.length > 0) {
    validations.push({
      code: "LAP_SECTOR_GAPS",
      message: `${lapIssues.length} volta(s) sem passagem em todos os setores — selecione cada volta e arraste o traçado no mapa até cruzar S1, S2 e S3.`,
      severity: "warning",
    });
  }

  if (laps.filter((l) => l.isValid).length === 0) {
    validations.push({
      code: "NO_LAPS",
      message:
        "Nenhuma volta válida detectada. Verifique a pista e as linhas de setor.",
      severity: "error",
    });
  }

  const meta = buildMeta(laps);
  meta.totalPoints = tagged.length;
  report(onProgress, "completed", 100, "Processamento concluído");

  return {
    source,
    sourceFileName,
    adapterId: detected.adapterId,
    trackId: track.id,
    trackName: track.name,
    points: tagged,
    laps,
    crossings,
    validations,
    appliedLines,
    meta,
    lapIssues,
    lapCorrections: [],
  };
}

export async function processCsvFile(
  file: File,
  options: Omit<ProcessOptions, "sourceFileName"> & { sourceFileName?: string },
): Promise<ImportPreviewData> {
  const text = await readFileAsText(file);
  return processCsvText(text, {
    ...options,
    sourceFileName: options.sourceFileName ?? file.name,
  });
}

export function previewToSession(
  preview: ImportPreviewData,
  sessionId: string,
): ProcessedTelemetrySession {
  const idealLap = calculateIdealLap(preview.laps);
  const now = new Date().toISOString();

  return {
    id: sessionId,
    source: preview.source,
    sourceFileName: preview.sourceFileName,
    trackId: preview.trackId,
    trackName: preview.trackName,
    status: "completed",
    createdAt: now,
    dateLabel: formatSessionDate(now),
    adapterId: preview.adapterId,
    points: preview.points,
    laps: preview.laps,
    crossings: preview.crossings,
    idealLap,
    validations: preview.validations,
    appliedLines: preview.appliedLines,
    meta: preview.meta,
    lapIssues: preview.lapIssues,
    lapCorrections: preview.lapCorrections,
  };
}

export function hasBlockingErrors(validations: ValidationIssue[]): boolean {
  return validations.some((v) => v.severity === "error");
}
