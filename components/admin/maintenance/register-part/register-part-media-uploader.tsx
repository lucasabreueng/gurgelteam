"use client";

import { useState } from "react";
import { HiCamera, HiDocument, HiFilm, HiPlus } from "react-icons/hi2";

type MediaItem = { id: string; label: string; type: "foto" | "nf" | "video" };

const LABELS = [
  { type: "foto" as const, label: "Peça antiga", icon: HiCamera },
  { type: "foto" as const, label: "Instalação", icon: HiCamera },
  { type: "nf" as const, label: "Nota fiscal", icon: HiDocument },
  { type: "video" as const, label: "Vídeo curto", icon: HiFilm },
];

export function RegisterPartMediaUploader() {
  const [items, setItems] = useState<MediaItem[]>([]);

  const add = (type: MediaItem["type"], label: string) => {
    setItems((p) => [...p, { id: `m-${Date.now()}`, label, type }]);
  };

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4">
      <h3 className="text-sm font-bold text-[#0d1f3c]">Mídia</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {LABELS.map((l) => (
          <button
            key={l.label}
            type="button"
            onClick={() => add(l.type, l.label)}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-[rgba(13,31,60,0.15)] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#0d1f3c] hover:bg-[#fafbfc]"
          >
            <l.icon className="h-4 w-4" aria-hidden />
            {l.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => add("foto", "Anexo")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d1f3c] text-white"
          aria-label="Adicionar"
        >
          <HiPlus className="h-5 w-5" />
        </button>
      </div>
      {items.length > 0 ? (
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {items.map((m) => (
            <li
              key={m.id}
              className="flex aspect-video flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#0d1f3c] to-[#1a3a5c] p-2 text-center"
            >
              <span className="text-2xl opacity-80">
                {m.type === "video" ? "▶" : m.type === "nf" ? "📄" : "📷"}
              </span>
              <span className="mt-1 text-[10px] font-bold text-white/90">
                {m.label}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
