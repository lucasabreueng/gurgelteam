import { NextResponse } from "next/server";
import {
  getOcrUnavailableMessage,
  isOpenAiOcrConfigured,
  runLessonTimingSheetOcr,
} from "@/lib/lesson-registration-ocr-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    if (!isOpenAiOcrConfigured()) {
      return NextResponse.json(
        { error: getOcrUnavailableMessage() },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Nenhuma imagem foi enviada." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length === 0) {
      return NextResponse.json({ error: "Arquivo vazio." }, { status: 400 });
    }
    if (buffer.length > MAX_BYTES) {
      return NextResponse.json(
        { error: "Imagem muito grande (máximo 12 MB)." },
        { status: 400 },
      );
    }

    const mimeType = file.type || "image/jpeg";
    const result = await runLessonTimingSheetOcr(buffer, mimeType);

    if (result.laps.length === 0) {
      return NextResponse.json(
        {
          error: getOcrUnavailableMessage(),
          hint: "Formato esperado: colunas S1, S2, S3 e TEMPO (pode estar em branco).",
          ...(process.env.NODE_ENV === "development" && result.rawModelText
            ? { debug: result.rawModelText }
            : {}),
        },
        { status: 422 },
      );
    }

    return NextResponse.json({ laps: result.laps });
  } catch (err) {
    console.error("[lesson-registration/ocr]", err);
    const message =
      err instanceof Error && err.message.includes("OPENAI_API_KEY")
        ? getOcrUnavailableMessage()
        : "Falha ao processar a imagem. Tente novamente.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
