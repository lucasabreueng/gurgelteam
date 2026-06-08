import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_BYTES = 2 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "karts");

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/gif") return ".gif";
  return "";
}

export async function saveKartPhotoFile(file: File): Promise<string> {
  const mime = file.type || "application/octet-stream";
  if (!IMAGE_TYPES.has(mime)) {
    throw new Error("Formato não suportado. Use JPG, PNG, WEBP ou GIF.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length === 0) {
    throw new Error("Arquivo vazio.");
  }
  if (buffer.length > MAX_BYTES) {
    throw new Error("A imagem deve ter no máximo 2 MB.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = extFromMime(mime) || path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/karts/${filename}`;
}

function parseDataUrl(dataUrl: string): { mime: string; buffer: Buffer } | null {
  const match = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl.trim());
  if (!match) return null;
  const mime = match[1];
  const buffer = Buffer.from(match[2], "base64");
  return { mime, buffer };
}

export async function persistKartPhotoUrl(
  photoUrl: string | null | undefined,
): Promise<string | null> {
  const trimmed = photoUrl?.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/uploads/karts/")) return trimmed;
  if (!trimmed.startsWith("data:")) return trimmed;

  const parsed = parseDataUrl(trimmed);
  if (!parsed || !IMAGE_TYPES.has(parsed.mime)) {
    throw new Error("Imagem inválida. Envie JPG, PNG, WEBP ou GIF.");
  }
  if (parsed.buffer.length > MAX_BYTES) {
    throw new Error("A imagem deve ter no máximo 2 MB.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = extFromMime(parsed.mime) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  await writeFile(path.join(UPLOAD_DIR, filename), parsed.buffer);
  return `/uploads/karts/${filename}`;
}
