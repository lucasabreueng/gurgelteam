"use client";

import type { ChecklistMediaPreview } from "@/lib/contracts/maintenance";
import { getAppServices } from "@/lib/data-source/app-services";
import { getDataSourceMode } from "@/lib/data-source/mode";

import { useRef, useState } from "react";
import Image from "next/image";
import { HiCamera, HiFilm, HiPlus, HiTrash } from "react-icons/hi2";

type Props = {
  value: ChecklistMediaPreview[];
  onChange: (items: ChecklistMediaPreview[]) => void;
};

export function MediaUploader({ value, onChange }: Props) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isHttp = getDataSourceMode() === "http";

  const uploadFile = async (file: File, type: "foto" | "video") => {
    setError(null);
    if (!isHttp) {
      onChange([
        ...value,
        {
          id: `local-${Date.now()}`,
          label: file.name.replace(/\.[^.]+$/, "") || (type === "foto" ? "Nova foto" : "Novo vídeo"),
          type,
          url: URL.createObjectURL(file),
        },
      ]);
      return;
    }

    setUploading(true);
    try {
      const saved = await getAppServices().checklist.uploadMedia(file);
      onChange([
        ...value,
        {
          id: saved.id,
          label: saved.label,
          type: saved.type,
          url: saved.url,
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
    type: "foto" | "video",
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    await uploadFile(file, type);
  };

  const remove = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm md:p-5">
      <h3 className="text-sm font-bold text-[#0d1f3c]">Fotos e vídeos</h3>
      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => void onPick(e, "foto")}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => void onPick(e, "video")}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => photoInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-[rgba(13,31,60,0.2)] bg-[#fafbfc] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/40 disabled:opacity-60"
        >
          <HiCamera className="h-4 w-4" aria-hidden />
          {uploading ? "Enviando…" : "Anexar foto"}
        </button>
        <button
          type="button"
          disabled={uploading}
          onClick={() => videoInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-[rgba(13,31,60,0.2)] bg-[#fafbfc] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/40 disabled:opacity-60"
        >
          <HiFilm className="h-4 w-4" aria-hidden />
          Anexar vídeo
        </button>
        <button
          type="button"
          disabled={uploading}
          onClick={() => photoInputRef.current?.click()}
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0d1f3c] text-white disabled:opacity-60"
          aria-label="Upload"
        >
          <HiPlus className="h-5 w-5" />
        </button>
      </div>
      {error ? (
        <p className="mt-3 text-xs font-semibold text-red-700">{error}</p>
      ) : null}
      {value.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {value.map((m) => (
            <li
              key={m.id}
              className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-[#0d1f3c] to-[#1a3a5c]"
            >
              {m.url && m.type === "foto" ? (
                <Image
                  src={m.url}
                  alt={m.label}
                  fill
                  className="object-cover"
                  unoptimized={m.url.startsWith("blob:")}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-2xl opacity-80">
                    {m.type === "foto" ? "📷" : "▶"}
                  </span>
                  <span className="mt-1 text-[10px] font-bold text-white/90">
                    {m.label}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => remove(m.id)}
                className="absolute right-2 top-2 rounded-lg bg-white/95 p-1.5 text-red-600 shadow"
                aria-label={`Remover ${m.label}`}
              >
                <HiTrash className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
