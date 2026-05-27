import type { LapRow } from "./lesson-registration-laps";
import {
  computeTotalFromSectors,
  formatSeconds,
  parseTimeToSeconds,
} from "./lesson-registration-laps";

type RawLap = {
  lap?: number;
  s1?: string | number;
  s2?: string | number;
  s3?: string | number;
  total?: string | number;
};

const EXTRACT_PROMPT = `Você é um assistente que transcreve planilhas de cronometragem de kart fotografadas à mão.

Tarefa:
1. Localize a tabela com colunas S1, S2, S3 e TEMPO (esta última pode estar vazia).
2. Para cada linha com os três setores preenchidos, extraia os valores exatamente como aparecem.
3. Aceite vírgula ou ponto decimal (ex.: 15,72 ou 15.72).
4. Se TEMPO estiver vazio, calcule a soma S1+S2+S3 em segundos.

Responda APENAS com JSON válido neste formato exato:
{"laps":[{"lap":1,"s1":"15.72","s2":"11.50","s3":"13.51","total":"40.73"}]}

Regras:
- Chaves em minúsculas: lap, s1, s2, s3, total
- Tempos sempre como string com ponto decimal e 2 casas (ex.: "11.50")
- Não invente voltas; ignore linhas em branco
- Se houver dúvida em um dígito, use o valor mais provável pelo contexto da tabela`;

function normalizeTime(value: unknown): string {
  if (value == null) return "";
  const raw = String(value).trim().replace(",", ".");
  if (!raw) return "";

  const sec = parseTimeToSeconds(raw);
  if (sec !== null && sec > 0) {
    const formatted = formatSeconds(sec);
    const dot = formatted.includes(":")
      ? formatted.split(":")[1]
      : formatted;
    const [whole, frac = ""] = dot.split(".");
    return `${whole}.${frac.padEnd(2, "0").slice(0, 3)}`;
  }

  const loose = raw.match(/^(\d{1,2})\.(\d{1,3})$/);
  if (loose) {
    const frac = loose[2].padEnd(2, "0").slice(0, 3);
    return `${loose[1]}.${frac}`;
  }

  return "";
}

function pickField(
  row: Record<string, unknown>,
  ...keys: string[]
): unknown {
  for (const key of keys) {
    if (row[key] != null && row[key] !== "") return row[key];
  }
  const lowerKeys = keys.map((k) => k.toLowerCase());
  for (const [k, v] of Object.entries(row)) {
    if (v != null && v !== "" && lowerKeys.includes(k.toLowerCase())) {
      return v;
    }
  }
  return undefined;
}

function normalizeRawRow(row: unknown): RawLap | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const s1 = pickField(r, "s1", "S1", "setor1", "setor_1");
  const s2 = pickField(r, "s2", "S2", "setor2", "setor_2");
  const s3 = pickField(r, "s3", "S3", "setor3", "setor_3");
  const total = pickField(r, "total", "tempo", "TEMPO", "Tempo", "time");
  const lapRaw = pickField(r, "lap", "volta", "lapNumber", "n");

  if (s1 == null && s2 == null && s3 == null) return null;

  return {
    lap: lapRaw != null ? Number(lapRaw) : undefined,
    s1: s1 as string | number | undefined,
    s2: s2 as string | number | undefined,
    s3: s3 as string | number | undefined,
    total: total as string | number | undefined,
  };
}

function rawToLapRows(raw: RawLap[]): LapRow[] {
  const laps: LapRow[] = [];
  for (const row of raw) {
    const s1 = normalizeTime(row.s1);
    const s2 = normalizeTime(row.s2);
    const s3 = normalizeTime(row.s3);
    if (!s1 || !s2 || !s3) continue;
    const total =
      normalizeTime(row.total) || computeTotalFromSectors(s1, s2, s3);
    laps.push({
      id: `ocr-${laps.length + 1}`,
      lap: row.lap && Number.isFinite(row.lap) ? row.lap : laps.length + 1,
      s1,
      s2,
      s3,
      total,
    });
  }
  return laps;
}

function extractRawLapArray(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) return parsed;
  if (!parsed || typeof parsed !== "object") return [];

  const obj = parsed as Record<string, unknown>;
  const listKeys = ["laps", "voltas", "rows", "registros", "tempos", "data"];
  for (const key of listKeys) {
    const val = obj[key];
    if (Array.isArray(val)) return val;
    if (val && typeof val === "object") {
      const nested = val as Record<string, unknown>;
      if (Array.isArray(nested.laps)) return nested.laps;
      if (Array.isArray(nested.voltas)) return nested.voltas;
    }
  }
  return [];
}

export function parseTimingSheetModelResponse(text: string): LapRow[] {
  let cleaned = text.trim();
  if (!cleaned) return [];

  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();
  }

  try {
    const parsed = JSON.parse(cleaned) as unknown;
    const rows = extractRawLapArray(parsed)
      .map(normalizeRawRow)
      .filter((r): r is RawLap => r != null);
    return rawToLapRows(rows);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return [];
    try {
      const parsed = JSON.parse(jsonMatch[0]) as unknown;
      const rows = extractRawLapArray(parsed)
        .map(normalizeRawRow)
        .filter((r): r is RawLap => r != null);
      return rawToLapRows(rows);
    } catch {
      return [];
    }
  }
}

export function isOpenAiOcrConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function resolveImageMimeType(
  buffer: Buffer,
  declaredType: string,
): string {
  const declared = declaredType?.split(";")[0]?.trim().toLowerCase();
  if (declared && /^image\/(jpeg|png|webp|gif)$/.test(declared)) {
    return declared;
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return "image/jpeg";
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46
  ) {
    return "image/webp";
  }
  return "image/jpeg";
}

export type LessonOcrServerResult = {
  laps: LapRow[];
  rawModelText?: string;
};

export async function runLessonTimingSheetOcr(
  buffer: Buffer,
  mimeType: string,
): Promise<LessonOcrServerResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada.");
  }

  const resolvedMime = resolveImageMimeType(buffer, mimeType);
  if (
    mimeType.toLowerCase().includes("heic") ||
    mimeType.toLowerCase().includes("heif")
  ) {
    throw new Error(
      "Formato HEIC não suportado. Salve a foto como JPG ou PNG e envie novamente.",
    );
  }

  const base64 = buffer.toString("base64");
  const model = process.env.OPENAI_OCR_MODEL?.trim() || "gpt-4o";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: EXTRACT_PROMPT },
            {
              type: "image_url",
              image_url: {
                url: `data:${resolvedMime};base64,${base64}`,
                detail: "high",
              },
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("[lesson-ocr/openai]", res.status, detail);
    let message = "A API da OpenAI retornou erro ao ler a imagem.";
    try {
      const errJson = JSON.parse(detail) as {
        error?: { message?: string };
      };
      if (errJson.error?.message) message = errJson.error.message;
    } catch {
      /* use default */
    }
    throw new Error(message);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content ?? "";
  const laps = parseTimingSheetModelResponse(text);

  if (laps.length === 0) {
    console.error("[lesson-ocr/openai] resposta sem voltas:", text);
  }

  return {
    laps,
    ...(process.env.NODE_ENV === "development" ? { rawModelText: text } : {}),
  };
}

export function getOcrUnavailableMessage(): string {
  if (!isOpenAiOcrConfigured()) {
    return "Configure OPENAI_API_KEY no arquivo .env e reinicie o servidor (npm run dev).";
  }
  return "Não foi possível extrair os tempos desta foto. Confira se a tabela está legível ou preencha manualmente ao lado.";
}
