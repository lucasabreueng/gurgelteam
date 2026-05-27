"use client";

import { HiQrCode } from "react-icons/hi2";

type Props = {
  onClick?: () => void;
};

export function BarcodeScannerButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[rgba(13,31,60,0.25)] bg-[#fafbfc] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-[#0d1f3c] hover:bg-white"
    >
      <HiQrCode className="h-4 w-4" aria-hidden />
      Escanear peça
    </button>
  );
}
