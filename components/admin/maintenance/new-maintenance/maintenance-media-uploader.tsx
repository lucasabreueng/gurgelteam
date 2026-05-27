"use client";

import { useState } from "react";
import Image from "next/image";
import {
  HiDocument,
  HiFilm,
  HiPhoto,
  HiPlus,
  HiReceiptPercent,
  HiTrash,
} from "react-icons/hi2";

type MediaItem = {
  id: string;
  type: "photo" | "video" | "doc" | "invoice";
  label: string;
  url?: string;
};

const INITIAL: MediaItem[] = [
  {
    id: "1",
    type: "photo",
    label: "Desgaste corrente",
    url: "/images/gallery-3.jpg",
  },
];

export function MaintenanceMediaUploader() {
  const [items, setItems] = useState<MediaItem[]>(INITIAL);

  const add = (type: MediaItem["type"]) => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        type,
        label: type === "invoice" ? "Nota fiscal" : "Novo arquivo",
        url: type === "photo" ? "/images/gallery-5.jpg" : undefined,
      },
    ]);
  };

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Mídias e documentos</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          { type: "photo" as const, icon: HiPhoto, label: "Foto" },
          { type: "video" as const, icon: HiFilm, label: "Vídeo" },
          { type: "doc" as const, icon: HiDocument, label: "Documento" },
          { type: "invoice" as const, icon: HiReceiptPercent, label: "NF" },
        ].map((btn) => (
          <button
            key={btn.type}
            type="button"
            onClick={() => add(btn.type)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#fafbfc] px-3 py-2 text-[10px] font-bold uppercase ring-1 ring-[rgba(17,17,17,0.08)] hover:ring-accent/30"
          >
            <btn.icon className="h-4 w-4" />
            {btn.label}
          </button>
        ))}
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((m) => (
          <li
            key={m.id}
            className="overflow-hidden rounded-xl ring-1 ring-[rgba(17,17,17,0.08)]"
          >
            <div className="relative aspect-video bg-neutral-100">
              {m.url ? (
                <Image src={m.url} alt="" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-400">
                  <HiDocument className="h-10 w-10" />
                </div>
              )}
              <button
                type="button"
                onClick={() => setItems((p) => p.filter((x) => x.id !== m.id))}
                className="absolute right-2 top-2 rounded-lg bg-white p-1.5 text-red-600 shadow"
              >
                <HiTrash className="h-4 w-4" />
              </button>
            </div>
            <p className="px-3 py-2 text-xs font-semibold text-[#0d1f3c]">
              {m.label}
            </p>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => add("photo")}
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 text-neutral-500"
          >
            <HiPlus className="h-8 w-8" />
            <span className="text-[10px] font-bold uppercase">Adicionar</span>
          </button>
        </li>
      </ul>
    </section>
  );
}
