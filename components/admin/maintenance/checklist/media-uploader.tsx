"use client";

import { ChecklistServiceMock } from "@/services/maintenance/checklistServiceMock";

import type { ChecklistMediaPreview } from "@/lib/contracts/maintenance";

import { useState } from "react";
import { HiCamera, HiFilm, HiPlus } from "react-icons/hi2";


export function MediaUploader() {
  const [previews, setPreviews] =
    useState<ChecklistMediaPreview[]>(ChecklistServiceMock.getMediaPreviews());

  const addMock = (type: "foto" | "video") => {
    setPreviews((p) => [
      ...p,
      {
        id: `mock-${Date.now()}`,
        label: type === "foto" ? "Nova foto" : "Novo vídeo",
        type,
      },
    ]);
  };

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm md:p-5">
      <h3 className="text-sm font-bold text-[#0d1f3c]">Fotos e vídeos</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => addMock("foto")}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-[rgba(13,31,60,0.2)] bg-[#fafbfc] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/40"
        >
          <HiCamera className="h-4 w-4" aria-hidden />
          Tirar foto
        </button>
        <button
          type="button"
          onClick={() => addMock("video")}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-[rgba(13,31,60,0.2)] bg-[#fafbfc] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/40"
        >
          <HiFilm className="h-4 w-4" aria-hidden />
          Anexar vídeo
        </button>
        <button
          type="button"
          onClick={() => addMock("foto")}
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0d1f3c] text-white"
          aria-label="Upload"
        >
          <HiPlus className="h-5 w-5" />
        </button>
      </div>
      {previews.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {previews.map((m) => (
            <li
              key={m.id}
              className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-[#0d1f3c] to-[#1a3a5c]"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                <span className="text-2xl opacity-80">
                  {m.type === "foto" ? "📷" : "▶"}
                </span>
                <span className="mt-1 text-[10px] font-bold text-white/90">
                  {m.label}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
