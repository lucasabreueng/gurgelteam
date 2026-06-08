import {
  getOcrUnavailableMessage,
  isOpenAiOcrConfigured,
  runLessonTimingSheetOcr,
} from "@/lib/lesson-registration-ocr-server";

const MAX_BYTES = 12 * 1024 * 1024;

export type LessonOcrLap = {
  lap: number;
  s1: string;
  s2: string;
  s3: string;
  total: string;
};

export type LessonOcrFailure = {
  httpStatus: number;
  message: string;
  hint?: string;
  debug?: string;
};

export type LessonOcrProcessResult =
  | { ok: true; laps: LessonOcrLap[] }
  | { ok: false; failure: LessonOcrFailure };

export async function processLessonTimingSheetUpload(
  formData: FormData,
): Promise<LessonOcrProcessResult> {
  if (!isOpenAiOcrConfigured()) {
    return {
      ok: false,
      failure: {
        httpStatus: 503,
        message: getOcrUnavailableMessage(),
      },
    };
  }

  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return {
      ok: false,
      failure: {
        httpStatus: 400,
        message: "Nenhuma imagem foi enviada.",
      },
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length === 0) {
    return {
      ok: false,
      failure: {
        httpStatus: 400,
        message: "Arquivo vazio.",
      },
    };
  }

  if (buffer.length > MAX_BYTES) {
    return {
      ok: false,
      failure: {
        httpStatus: 400,
        message: "Imagem muito grande (máximo 12 MB).",
      },
    };
  }

  try {
    const mimeType = file.type || "image/jpeg";
    const result = await runLessonTimingSheetOcr(buffer, mimeType);

    if (result.laps.length === 0) {
      return {
        ok: false,
        failure: {
          httpStatus: 422,
          message: getOcrUnavailableMessage(),
          hint: "Formato esperado: colunas S1, S2, S3 e TEMPO (pode estar em branco).",
          ...(process.env.NODE_ENV === "development" && result.rawModelText
            ? { debug: result.rawModelText }
            : {}),
        },
      };
    }

    return { ok: true, laps: result.laps };
  } catch (err) {
    console.error("[lesson-ocr-handler]", err);
    const message =
      err instanceof Error && err.message.includes("OPENAI_API_KEY")
        ? getOcrUnavailableMessage()
        : "Falha ao processar a imagem. Tente novamente.";
    return {
      ok: false,
      failure: {
        httpStatus: 500,
        message,
      },
    };
  }
}
