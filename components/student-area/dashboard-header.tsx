"use client";

import { usePilotHome } from "@/lib/query/hooks/use-pilot-home";

import { UserAvatar } from "@/components/ui/user-avatar";
import Link from "next/link";
import { LogoutLink } from "@/components/auth/logout-link";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { HiOutlineUserCircle, HiArrowRightOnRectangle } from "react-icons/hi2";


export function DashboardHeader() {
  const { data: home } = usePilotHome();
  const profile = home?.profile;
  const displayName = profile?.firstName?.trim() || "Piloto";
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
    <header className="flex shrink-0 items-center justify-between gap-4 px-2 py-1 md:px-0 md:py-0">
      <Link
        href="/"
        className="hidden text-[13px] font-semibold text-[#0d1f3c] underline-offset-4 hover:underline lg:inline-flex"
      >
        ← Voltar ao site
      </Link>

      <div ref={rootRef} className="relative flex flex-1 items-center justify-end gap-3 md:gap-5 lg:flex-initial">
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          className="flex max-w-full items-center gap-3 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white py-2 pl-2 pr-3 transition hover:border-accent/25 md:gap-4 md:rounded-full md:border-0 md:bg-transparent md:pr-4 md:hover:bg-[rgba(13,31,60,0.03)]"
          onClick={() => setOpen((o) => !o)}
        >
          <UserAvatar
            src={home?.avatarUrl}
            name={displayName || "Piloto"}
            size={44}
            roundedClass="rounded-full"
            className="border-2 border-white ring-1 ring-[rgba(17,17,17,0.08)]"
          />
          <div className="min-w-0 text-left md:block">
            <p className="truncate text-sm font-semibold text-[#111]">
              {profile?.firstName ?? "Piloto"}
            </p>
            <p className="hidden truncate text-xs text-neutral-600 md:block">
              Ver perfil
            </p>
          </div>
          <FaChevronDown
            className={`hidden text-xs text-neutral-500 transition-transform md:inline ${
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
            <LogoutLink
              role="menuitem"
              href="/"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700/90 transition hover:bg-red-50"
              onClick={() => setOpen(false)}
            >
              <HiArrowRightOnRectangle className="text-lg" aria-hidden />
              Sair
            </LogoutLink>
          </div>
        ) : null}
      </div>
    </header>
  );
}
