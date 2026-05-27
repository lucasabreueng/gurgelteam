"use client";

import type { ChecklistKartContext } from "@/lib/contracts/maintenance";
import Image from "next/image";
import { HiXMark } from "react-icons/hi2";

type Props = {
  kart: ChecklistKartContext;
  onClose: () => void;
};

export function ChecklistHeader({ kart, onClose }: Props) {
  return (
    <header className="shrink-0 border-b border-[rgba(17,17,17,0.08)] bg-white px-3 py-3 md:px-4">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-[#0d1f3c]">
          <Image
            src={kart.photo}
            alt=""
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">
            Checklist · {kart.categoryName}
          </p>
          <h2 className="text-lg font-bold tabular-nums leading-tight text-[#0d1f3c]">
            Kart {String(kart.kartNumber).padStart(2, "0")}
          </h2>
          <p className="truncate text-[11px] text-neutral-600">
            {kart.engineHours}h motor · {kart.responsible}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1.5 text-neutral-600 transition hover:bg-[#fafbfc]"
          aria-label="Fechar"
        >
          <HiXMark className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
