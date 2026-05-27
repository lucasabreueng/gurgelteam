"use client";

import { HiBars3 } from "react-icons/hi2";

type Props = {
  title: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
};

/** Barra superior mobile: título à esquerda, menu hamburger à direita. */
export function MobileHeaderBar({ title, menuOpen, onToggleMenu }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 lg:hidden">
      <h1 className="min-w-0 truncate text-lg font-bold tracking-tight text-[#0d1f3c]">
        {title}
      </h1>
      <button
        type="button"
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuOpen}
        aria-controls="shell-mobile-menu"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.08)] bg-white text-[#0d1f3c] transition hover:border-accent/25"
        onClick={onToggleMenu}
      >
        <HiBars3 className="h-6 w-6" aria-hidden />
      </button>
    </div>
  );
}
