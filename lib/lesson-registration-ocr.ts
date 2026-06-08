import type { LapRow } from "./lesson-registration-laps";

export type TimingSheetOcrResult = {
  imageUrl: string;
  laps: LapRow[];
};

export class TimingSheetOcrError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "TimingSheetOcrError";
  }
}

function ocrEndpoint(): string {
  return "/api/v1/lessons/ocr";
}

/** Envia a foto para OCR no servidor (OpenAI) e retorna as voltas extraídas. */
export async function runTimingSheetOcr(
  file: File,
): Promise<TimingSheetOcrResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(ocrEndpoint(), {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const body = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    error?: { message?: string };
    data?: { laps?: LapRow[] };
    laps?: LapRow[];
  };

  if (!res.ok) {
    const message =
      typeof body.error === "object" && body.error?.message
        ? body.error.message
        : typeof body.error === "string"
          ? body.error
          : "Não foi possível ler a cronometragem.";
    throw new TimingSheetOcrError(message, res.status);
  }

  const laps = body.data?.laps ?? body.laps;

  if (!laps?.length) {
    throw new TimingSheetOcrError(
      "Nenhum tempo foi encontrado na imagem.",
      res.status,
    );
  }

  return {
    imageUrl: "",
    laps,
  };
}

export function readImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
