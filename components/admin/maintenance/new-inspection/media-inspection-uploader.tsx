"use client";

import { useState } from "react";
import Image from "next/image";
import { HiFilm, HiPhoto, HiPlus, HiTrash } from "react-icons/hi2";

type MediaItem = {
  id: string;
  type: "photo" | "video";
  url: string;
  note: string;
};

const MOCK_MEDIA: MediaItem[] = [
  {
    id: "m1",
    type: "photo",
    url: "/images/gallery-3.jpg",
    note: "Desgaste corrente",
  },
  {
    id: "m2",
    type: "photo",
    url: "/images/gallery-4.jpg",
    note: "Pastilha traseira",
  },
];

export function MediaInspectionUploader() {
  const [items, setItems] = useState<MediaItem[]>(MOCK_MEDIA);

  const addMock = (type: "photo" | "video") => {
    setItems((prev) => [
      ...prev,
      {
        id: `mock-${Date.now()}`,
        type,
        url: "/images/gallery-5.jpg",
        note: "",
      },
    ]);
  };

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Registro visual</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Fotos e vídeos da inspeção (mock)
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => addMock("photo")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0d1f3c] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-white"
        >
          <HiPhoto className="h-4 w-4" aria-hidden />
          Adicionar foto
        </button>
        <button
          type="button"
          onClick={() => addMock("video")}
          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(13,31,60,0.2)] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-[#0d1f3c]"
        >
          <HiFilm className="h-4 w-4" aria-hidden />
          Adicionar vídeo
        </button>
      </div>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((m) => (
          <li
            key={m.id}
            className="overflow-hidden rounded-xl ring-1 ring-[rgba(17,17,17,0.08)]"
          >
            <div className="relative aspect-video bg-neutral-100">
              {m.type === "photo" ? (
                <Image src={m.url} alt="" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#0d1f3c]/90 text-white">
                  <HiFilm className="h-10 w-10 opacity-60" />
                  <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold">
                    Vídeo mock
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() =>
                  setItems((prev) => prev.filter((x) => x.id !== m.id))
                }
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
                setItems((prev) =>
                  prev.map((x) =>
                    x.id === m.id ? { ...x, note: e.target.value } : x
                  )
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
            onClick={() => addMock("photo")}
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-[#fafbfc] text-neutral-500 transition hover:border-accent/40"
          >
            <HiPlus className="h-8 w-8" />
            <span className="text-[10px] font-bold uppercase">Nova mídia</span>
          </button>
        </li>
      </ul>
    </section>
  );
}
