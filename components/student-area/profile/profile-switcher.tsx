"use client";

import Image from "next/image";
import type { AccountRole } from "@/lib/contracts/student/profile";

export type SwitcherOption = {
  id: string;
  label: string;
  sublabel: string;
  avatarUrl: string;
  role: AccountRole;
};

type Props = {
  options: SwitcherOption[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function ProfileSwitcher({ options, activeId, onSelect }: Props) {
  return (
    <div className="rounded-2xl border border-[rgba(17,17,17,0.06)] bg-white px-4 py-5 shadow-[0_2px_16px_rgba(13,31,60,0.04)] md:px-6">
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
        Perfil ativo
      </p>
      <div
        className="mt-4 flex gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Selecionar perfil"
      >
        {options.map((opt) => {
          const active = opt.id === activeId;
          return (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(opt.id)}
              className={`group flex min-w-[88px] shrink-0 flex-col items-center gap-2 rounded-2xl px-2 py-2 transition ${
                active
                  ? "opacity-100"
                  : "opacity-55 hover:opacity-90"
              }`}
            >
              <span
                className={`relative block h-[72px] w-[72px] overflow-hidden rounded-xl transition-all duration-300 ${
                  active
                    ? "ring-[3px] ring-accent shadow-[0_8px_24px_rgba(13,31,60,0.18)] scale-105"
                    : "ring-2 ring-transparent group-hover:ring-neutral-200"
                }`}
              >
                <Image
                  src={opt.avatarUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </span>
              <span className="max-w-[96px] truncate text-center text-[12px] font-semibold text-[#0d1f3c]">
                {opt.label.split(" ")[0]}
              </span>
              <span className="max-w-[96px] truncate text-center text-[10px] font-medium text-neutral-500">
                {opt.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
