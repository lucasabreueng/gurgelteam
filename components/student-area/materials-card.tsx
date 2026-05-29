"use client";

import { StudentAreaServiceMock } from "@/services/student/studentAreaServiceMock";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { HiMiniPlayCircle } from "react-icons/hi2";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";


export function MaterialsCard() {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const openItem = StudentAreaServiceMock.getVideoMaterials().find((v) => v.id === openId);

  const playVideo = useCallback((id: string) => {
    setLibraryOpen(false);
    setOpenId(id);
  }, []);

  const scrollByDir = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-video-card]");
    const step = card ? card.offsetWidth + 12 : el.clientWidth * 0.75;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!libraryOpen && !openId) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openId) setOpenId(null);
      else setLibraryOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [libraryOpen, openId]);

  return (
    <>
      <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(17,17,17,0.06)] pb-4">
          <h3 className="text-xl font-bold text-[#0d1f3c]">Vídeos e materiais</h3>
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.12)] bg-white px-4 py-2 text-[13px] font-semibold text-accent shadow-sm transition hover:border-accent/30 hover:bg-neutral-50"
          >
            Ver biblioteca
          </button>
        </div>

        <div className="relative mt-6">
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollByDir(-1)}
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(17,17,17,0.1)] bg-white text-[#0d1f3c] shadow-md transition hover:bg-neutral-50 lg:hidden"
          >
            <HiChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Seguinte"
            onClick={() => scrollByDir(1)}
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(17,17,17,0.1)] bg-white text-[#0d1f3c] shadow-md transition hover:bg-neutral-50 lg:hidden"
          >
            <HiChevronRight className="h-6 w-6" />
          </button>

          <div
            ref={scrollerRef}
            className="app-scrollbar-hidden flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-11 pb-1 sm:px-14 lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-x-visible lg:px-0"
          >
            {StudentAreaServiceMock.getVideoMaterials().map((it) => (
              <div
                key={it.id}
                data-video-card
                className="flex w-[82%] max-w-[280px] shrink-0 snap-center flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-3 shadow-sm sm:w-[48%] md:w-[32%] lg:w-auto lg:min-w-0 lg:max-w-none lg:snap-align-none"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-200">
                  <Image
                    src={it.thumbnail}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 70vw, 18vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  {it.tag ? (
                    <span className="absolute left-2 top-2 inline-flex rounded-full bg-accent px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow">
                      {it.tag}
                    </span>
                  ) : null}
                  <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-white">
                    {it.duration}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenId(it.id)}
                    className="absolute inset-0 flex items-center justify-center transition hover:bg-black/15"
                    aria-label={`Reproduzir ${it.title}`}
                  >
                    <HiMiniPlayCircle className="h-12 w-12 text-white drop-shadow-lg md:h-14 md:w-14" />
                  </button>
                </div>
                <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-snug text-[#111]">
                  {it.title}
                </p>
                <div className="mt-2 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOpenId(it.id)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-accent/35 bg-accent/10 px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:bg-accent hover:text-white"
                  >
                    <HiMiniPlayCircle className="text-base" aria-hidden />
                    Assistir
                  </button>
                  <a
                    href={it.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[rgba(17,17,17,0.12)] bg-white px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-accent transition hover:bg-neutral-50"
                  >
                    <HiOutlineDocumentArrowDown className="text-base" aria-hidden />
                    PDF
                  </a>
                </div>
                <p className="mt-1 text-center text-[9px] leading-tight text-neutral-500">
                  {it.pdfLabel}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {libraryOpen ? (
        <div
          role="presentation"
          className="fixed inset-0 z-[205] flex items-center justify-center bg-black/55 p-4"
          onClick={() => setLibraryOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="biblioteca-modal-title"
            className="flex max-h-[min(90vh,720px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4 md:px-6">
              <div>
                <h2
                  id="biblioteca-modal-title"
                  className="text-lg font-bold text-[#0d1f3c]"
                >
                  Biblioteca de vídeos e materiais
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  {StudentAreaServiceMock.getVideoMaterials().length} itens disponíveis
                </p>
              </div>
              <button
                type="button"
                className="rounded-xl bg-[#0d1f3c] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                onClick={() => setLibraryOpen(false)}
              >
                Fechar
              </button>
            </div>
            <ul className="grid grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2 lg:grid-cols-3 md:p-6">
              {StudentAreaServiceMock.getVideoMaterials().map((it) => (
                <li
                  key={it.id}
                  className="flex flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-3 shadow-sm"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-200">
                    <Image
                      src={it.thumbnail}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    {it.tag ? (
                      <span className="absolute left-2 top-2 inline-flex rounded-full bg-accent px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow">
                        {it.tag}
                      </span>
                    ) : null}
                    <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-white">
                      {it.duration}
                    </span>
                    <button
                      type="button"
                      onClick={() => playVideo(it.id)}
                      className="absolute inset-0 flex items-center justify-center transition hover:bg-black/15"
                      aria-label={`Reproduzir ${it.title}`}
                    >
                      <HiMiniPlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
                    </button>
                  </div>
                  <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-snug text-[#111]">
                    {it.title}
                  </p>
                  <div className="mt-2 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => playVideo(it.id)}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-accent/35 bg-accent/10 px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:bg-accent hover:text-white"
                    >
                      <HiMiniPlayCircle className="text-base" aria-hidden />
                      Assistir
                    </button>
                    <a
                      href={it.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[rgba(17,17,17,0.12)] bg-white px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-accent transition hover:bg-neutral-50"
                    >
                      <HiOutlineDocumentArrowDown className="text-base" aria-hidden />
                      PDF
                    </a>
                  </div>
                  <p className="mt-1 text-center text-[9px] leading-tight text-neutral-500">
                    {it.pdfLabel}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {openItem ? (
        <div
          role="presentation"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 p-4"
          onClick={() => setOpenId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="material-video-title"
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-[1] rounded-lg bg-black/60 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-black/80"
              onClick={() => setOpenId(null)}
            >
              Fechar
            </button>
            <h2 id="material-video-title" className="sr-only">
              {openItem.title}
            </h2>
            <div className="relative aspect-video w-full">
              <iframe
                src={openItem.videoUrl}
                title={openItem.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
