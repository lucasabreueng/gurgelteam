export type GoproExportPhase = "extract" | "process" | "download";

export type GoproExportProgress = {
  phase: GoproExportPhase;
  percent: number;
  message: string;
};

export type GoproGpsExportResult = {
  csvContent: string;
  csvFileName: string;
  streamKey: string;
  rowCount: number;
};

const VENDOR_SCRIPT = "/vendor/gopro-gps.js?v=2";
let vendorLoadPromise: Promise<GoproGpsVendorApi> | null = null;

type GoproGpsVendorApi = NonNullable<Window["GoproGpsVendor"]>;

function csvBaseName(videoFileName: string): string {
  return videoFileName.replace(/\.[^.]+$/, "") || "gopro-video";
}

function pickGpsCsvContent(
  files: Record<string, string>,
): { key: string; content: string } | null {
  const entries = Object.entries(files);
  if (entries.length === 0) return null;

  const priority = [/GPS5/i, /GPS9/i, /GPS/i, /GPRI/i];
  for (const pattern of priority) {
    const match = entries.find(([key]) => pattern.test(key));
    if (match) return { key: match[0], content: match[1] };
  }
  const [key, content] = entries[0];
  return { key, content };
}

function countCsvRows(csv: string): number {
  const lines = csv.trim().split(/\r?\n/);
  return Math.max(0, lines.length - 1);
}

export function downloadCsvFile(content: string, fileName: string): void {
  const blob = new Blob(["\uFEFF", content], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function mapGoproError(error: unknown): string {
  const message =
    error instanceof Error ? error.message : String(error ?? "Erro desconhecido");

  if (/track not found/i.test(message)) {
    if (/trilhas no arquivo/i.test(message)) {
      return `Metadados GPMF não encontrados neste vídeo. Detalhe técnico: ${message}. Confirme que é o .MP4 original da câmera (não LRV/clip editado) com GPS ativo.`;
    }
    return "Este vídeo não contém trilha GPMF (GPS). Use o arquivo .MP4 original da GoPro com GPS ativo — arquivos LRV, cortes do app ou exportações podem não incluir telemetria.";
  }
  if (/file not compatible/i.test(message)) {
    return "Formato de vídeo não compatível. Envie o .MP4 ou .MOV original exportado da câmera ou do cartão SD.";
  }
  if (/invalid gpmf/i.test(message)) {
    return "Metadados GPMF inválidos ou corrompidos neste vídeo.";
  }
  if (/canceled by user/i.test(message)) {
    return "Extração cancelada.";
  }
  if (/loading chunk|failed to fetch|gopro-gps\.js/i.test(message)) {
    return "Falha ao carregar o módulo de extração GPS. Recarregue a página e tente novamente.";
  }
  return `Não foi possível extrair o GPS: ${message}`;
}

/** Carrega bundle estático (evita chunks dinâmicos do Next.js). */
export function loadGoproGpsVendor(): Promise<GoproGpsVendorApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Extração GoPro disponível apenas no navegador."));
  }
  if (window.GoproGpsVendor) {
    return Promise.resolve(window.GoproGpsVendor);
  }
  if (!vendorLoadPromise) {
    vendorLoadPromise = new Promise<GoproGpsVendorApi>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[data-gopro-vendor="true"]`,
      );
      if (existing) {
        existing.addEventListener("load", () => {
          if (window.GoproGpsVendor) resolve(window.GoproGpsVendor);
          else reject(new Error("Bundle GoPro GPS carregou sem exportar API."));
        });
        existing.addEventListener("error", () =>
          reject(new Error("Não foi possível carregar /vendor/gopro-gps.js")),
        );
        return;
      }

      const script = document.createElement("script");
      script.src = VENDOR_SCRIPT;
      script.async = true;
      script.dataset.goproVendor = "true";
      script.onload = () => {
        if (window.GoproGpsVendor) resolve(window.GoproGpsVendor);
        else reject(new Error("Bundle GoPro GPS carregou sem exportar API."));
      };
      script.onerror = () =>
        reject(new Error("Não foi possível carregar /vendor/gopro-gps.js"));
      document.head.appendChild(script);
    }).catch((err) => {
      vendorLoadPromise = null;
      throw err;
    }) as Promise<GoproGpsVendorApi>;
  }
  return vendorLoadPromise;
}

/**
 * Extrai a trilha GPMF do vídeo GoPro e exporta metadados GPS como CSV.
 */
export async function exportGoproGpsCsvFromVideo(
  videoFile: File,
  onProgress?: (progress: GoproExportProgress) => void,
): Promise<GoproGpsExportResult> {
  onProgress?.({
    phase: "extract",
    percent: 0,
    message: "Preparando extração GPS…",
  });

  const { gpmfExtract, goproTelemetry } = await loadGoproGpsVendor();

  onProgress?.({
    phase: "extract",
    percent: 2,
    message: "Lendo metadados GPMF do vídeo…",
  });

  let extracted: { rawData: Uint8Array; timing?: unknown };
  try {
    extracted = await gpmfExtract(videoFile, {
      browserMode: true,
      progress: (percent) => {
        onProgress?.({
          phase: "extract",
          percent: Math.round(2 + percent * 0.53),
          message: `Extraindo trilha GPMF… ${Math.round(percent)}%`,
        });
      },
    });
  } catch (error) {
    throw new Error(mapGoproError(error));
  }

  if (!extracted?.rawData?.length) {
    throw new Error(
      "Nenhum metadado GPMF encontrado. Verifique se o GPS estava ativo durante a gravação.",
    );
  }

  onProgress?.({
    phase: "process",
    percent: 60,
    message: "Convertendo GPS para CSV…",
  });

  let csvFiles: Record<string, string>;
  const telemetryOptions = {
    preset: "csv" as const,
    GPS5Fix: 0 as const,
    decimalPlaces: 6,
    tolerant: true,
  };

  try {
    csvFiles = (await goproTelemetry(extracted, {
      ...telemetryOptions,
      stream: ["GPS5"],
      progress: (ratio: number) => {
        onProgress?.({
          phase: "process",
          percent: 60 + Math.round(ratio * 30),
          message: "Processando coordenadas GPS…",
        });
      },
    })) as unknown as Record<string, string>;
  } catch {
    try {
      csvFiles = (await goproTelemetry(extracted, {
        ...telemetryOptions,
        stream: ["GPS5", "GPS9"],
      })) as unknown as Record<string, string>;
    } catch {
      try {
        csvFiles = (await goproTelemetry(extracted, {
          ...telemetryOptions,
        })) as unknown as Record<string, string>;
      } catch (error) {
        throw new Error(mapGoproError(error));
      }
    }
  }

  const picked = pickGpsCsvContent(csvFiles);
  if (!picked?.content?.trim()) {
    throw new Error(
      "Nenhum dado GPS encontrado no vídeo. Confirme que a gravação inclui localização.",
    );
  }

  const csvFileName = `${csvBaseName(videoFile.name)}_gps.csv`;

  onProgress?.({
    phase: "download",
    percent: 95,
    message: "Exportando arquivo CSV…",
  });

  downloadCsvFile(picked.content, csvFileName);

  onProgress?.({
    phase: "download",
    percent: 100,
    message: "CSV exportado com sucesso.",
  });

  return {
    csvContent: picked.content,
    csvFileName,
    streamKey: picked.key,
    rowCount: countCsvRows(picked.content),
  };
}
