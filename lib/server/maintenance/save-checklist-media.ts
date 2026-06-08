import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_BYTES = 8 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "maintenance");

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/gif") return ".gif";
  if (mime === "video/mp4") return ".mp4";
  if (mime === "video/webm") return ".webm";
  if (mime === "video/quicktime") return ".mov";
  return "";
}

export type SavedChecklistMedia = {
  id: string;
  label: string;
  type: "foto" | "video";
  url: string;
};

export async function saveChecklistMediaFile(
  file: File,
  label?: string,
): Promise<SavedChecklistMedia> {
  const mime = file.type || "application/octet-stream";
  const isImage = IMAGE_TYPES.has(mime);
  const isVideo = VIDEO_TYPES.has(mime);

  if (!isImage && !isVideo) {
    throw new Error("Formato não suportado. Use JPG, PNG, WEBP, GIF, MP4 ou WEBM.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length === 0) {
    throw new Error("Arquivo vazio.");
  }
  if (buffer.length > MAX_BYTES) {
    throw new Error("Arquivo excede 8 MB.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const id = randomUUID();
  const ext = extFromMime(mime) || path.extname(file.name) || (isImage ? ".jpg" : ".mp4");
  const filename = `${id}${ext}`;
  const diskPath = path.join(UPLOAD_DIR, filename);

  await writeFile(diskPath, buffer);

  const baseName = file.name.replace(/\.[^.]+$/, "").trim();
  return {
    id,
    label: label?.trim() || baseName || (isImage ? "Foto" : "Vídeo"),
    type: isImage ? "foto" : "video",
    url: `/uploads/maintenance/${filename}`,
  };
}
