"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HiPlay, HiXMark } from "react-icons/hi2";

type MediaItem = {
  id: string;
  label: string;
  type: "foto" | "video";
  url: string;
};

type Props = {
  items: MediaItem[];
};

export function MaintenanceMediaGallery({ items }: Props) {
  const [active, setActive] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => setActive(m)}
              className="group relative flex h-20 w-28 overflow-hidden rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#0d1f3c] shadow-sm transition hover:ring-2 hover:ring-accent/40"
            >
              {m.type === "foto" ? (
                <Image
                  src={m.url}
                  alt={m.label}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="112px"
                />
              ) : (
                <>
                  <Image
                    src="/images/gallery-5.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-70"
                    sizes="112px"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#0d1f3c]">
                      <HiPlay className="h-5 w-5" aria-hidden />
                    </span>
                  </span>
                </>
              )}
              <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5 text-left text-[9px] font-bold text-white">
                {m.label}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.label}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Fechar visualização"
          >
            <HiXMark className="h-6 w-6" />
          </button>
          <div
            className="relative max-h-[90vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 text-center text-sm font-bold text-white">
              {active.label}
            </p>
            {active.type === "foto" ? (
              <div className="relative mx-auto aspect-video max-h-[80vh] w-full overflow-hidden rounded-2xl">
                <Image
                  src={active.url}
                  alt={active.label}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            ) : (
              <video
                src={active.url}
                controls
                autoPlay
                className="mx-auto max-h-[80vh] w-full rounded-2xl bg-black"
              >
                <track kind="captions" />
              </video>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
