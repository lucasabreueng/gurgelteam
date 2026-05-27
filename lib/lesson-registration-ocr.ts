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

/** Envia a foto para OCR no servidor (OpenAI) e retorna as voltas extraídas. */
export async function runTimingSheetOcr(
  file: File,
): Promise<TimingSheetOcrResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/admin/lesson-registration/ocr", {
    method: "POST",
    body: formData,
  });

  const body = (await res.json().catch(() => ({}))) as {
    error?: string;
    laps?: LapRow[];
  };

  if (!res.ok) {
    throw new TimingSheetOcrError(
      body.error ?? "Não foi possível ler a cronometragem.",
      res.status,
    );
  }

  if (!body.laps?.length) {
    throw new TimingSheetOcrError(
      "Nenhum tempo foi encontrado na imagem.",
      res.status,
    );
  }

  return {
    imageUrl: "",
    laps: body.laps,
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
