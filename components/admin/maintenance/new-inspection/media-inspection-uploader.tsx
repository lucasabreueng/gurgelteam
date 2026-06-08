"use client";

import { getAppServices } from "@/lib/data-source/app-services";
import { getDataSourceMode } from "@/lib/data-source/mode";

import { useRef, useState } from "react";
import Image from "next/image";
import { HiCamera, HiFilm, HiPlus, HiTrash } from "react-icons/hi2";

export type InspectionMediaItem = {
  id: string;
  type: "photo" | "video";
  url: string;
  note: string;
};

type Props = {
  value: InspectionMediaItem[];
  onChange: (items: InspectionMediaItem[]) => void;
};

export function MediaInspectionUploader({ value, onChange }: Props) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isHttp = getDataSourceMode() === "http";

  const uploadFile = async (file: File, type: "photo" | "video") => {
    setError(null);
    if (!isHttp) {
      onChange([
        ...value,
        {
          id: `local-${Date.now()}`,
          type,
          url: URL.createObjectURL(file),
          note: file.name.replace(/\.[^.]+$/, "") || "",
        },
      ]);
      return;
    }

    setUploading(true);
    try {
      const saved = await getAppServices().inspection.uploadMedia(file);
      onChange([
        ...value,
        {
          id: saved.id,
          type: saved.type === "foto" ? "photo" : "video",
          url: saved.url,
          note: saved.label,
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  };

  const onPick = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "photo" | "video",
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    await uploadFile(file, type);
  };

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Registro visual</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Fotos e vídeos da inspeção
      </p>
      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => void onPick(e, "photo")}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => void onPick(e, "video")}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => photoInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0d1f3c] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-white disabled:opacity-60"
        >
          <HiCamera className="h-4 w-4" aria-hidden />
          {uploading ? "Enviando…" : "Adicionar foto"}
        </button>
        <button
          type="button"
          disabled={uploading}
          onClick={() => videoInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(13,31,60,0.2)] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-[#0d1f3c] disabled:opacity-60"
        >
          <HiFilm className="h-4 w-4" aria-hidden />
          Adicionar vídeo
        </button>
      </div>
      {error ? (
        <p className="mt-3 text-xs font-semibold text-red-700">{error}</p>
      ) : null}
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {value.map((m) => (
          <li
            key={m.id}
            className="overflow-hidden rounded-xl ring-1 ring-[rgba(17,17,17,0.08)]"
          >
            <div className="relative aspect-video bg-neutral-100">
              {m.type === "photo" ? (
                <Image
                  src={m.url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized={m.url.startsWith("blob:")}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#0d1f3c]/90 text-white">
                  <HiFilm className="h-10 w-10 opacity-60" />
                </div>
              )}
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x.id !== m.id))}
                className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-red-600 shadow"
                aria-label="Remover"
              >
                <HiTrash className="h-4 w-4" />
              </button>
            </div>
            <input
              type="text"
              value={m.note}
              onChange={(e) =>
                onChange(
                  value.map((x) =>
                    x.id === m.id ? { ...x, note: e.target.value } : x,
                  ),
                )
              }
              placeholder="Observação desta mídia…"
              className="w-full border-0 bg-[#fafbfc] px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-accent/20"
            />
          </li>
        ))}
        <li>
          <button
            type="button"
            disabled={uploading}
            onClick={() => photoInputRef.current?.click()}
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-[#fafbfc] text-neutral-500 transition hover:border-accent/40 disabled:opacity-60"
          >
            <HiPlus className="h-8 w-8" />
            <span className="text-[10px] font-bold uppercase">Nova mídia</span>
          </button>
        </li>
      </ul>
    </section>
  );
}
