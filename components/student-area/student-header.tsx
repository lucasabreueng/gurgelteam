"use client";

import { StudentAreaServiceMock } from "@/services/student/studentAreaServiceMock";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import {
  HiOutlineBell,
  HiOutlineMagnifyingGlass,
  HiOutlineUserCircle,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";


export function StudentHeader() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative min-w-0 flex-1 lg:max-w-md">
        <HiOutlineMagnifyingGlass
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar aula, material, resultado…"
          className="w-full rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] py-3 pl-11 pr-4 text-[14px] text-[#111] outline-none transition placeholder:text-neutral-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
        <span className="hidden items-center gap-2 rounded-full border border-[rgba(13,31,60,0.12)] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#0d1f3c] sm:inline-flex">
          Próxima aula · {StudentAreaServiceMock.getNextClass().dateLabel}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          Nível {StudentAreaServiceMock.getHeroLevel().title}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.08)] bg-white text-[#0d1f3c] transition hover:border-accent/25"
            aria-label="Notificações"
          >
            <HiOutlineBell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#c41e3a]" />
          </button>

          <div ref={rootRef} className="relative">
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white py-1.5 pl-1.5 pr-3 transition hover:border-accent/25"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white">
                <Image
                  src={StudentAreaServiceMock.getStudentProfile().avatarFallback}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </span>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-[13px] font-semibold text-[#111]">
                  {StudentAreaServiceMock.getStudentProfile().firstName.split(" ")[0]}
                </p>
                <p className="text-[11px] text-neutral-500">{StudentAreaServiceMock.getStudentProfile().tag}</p>
              </div>
              <FaChevronDown
                className={`hidden text-xs text-neutral-500 transition-transform sm:inline ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open ? (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] w-[min(calc(100vw-2rem),220px)] overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white py-1.5 shadow-[0_12px_40px_rgba(13,31,60,0.15)]"
              >
                <Link
                  role="menuitem"
                  href="/piloto/perfil"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#111] transition hover:bg-[rgba(13,31,60,0.06)]"
                  onClick={() => setOpen(false)}
                >
                  <HiOutlineUserCircle className="text-lg text-[#0d1f3c]" aria-hidden />
                  Meu perfil
                </Link>
                <Link
                  role="menuitem"
                  href="/"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700/90 transition hover:bg-red-50"
                  onClick={() => setOpen(false)}
                >
                  <HiArrowRightOnRectangle className="text-lg" aria-hidden />
                  Sair
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
