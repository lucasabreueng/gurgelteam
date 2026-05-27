"use client";

import type { PartCatalogItem } from "@/lib/contracts/parts";

import { PartsServiceMock } from "@/services/parts/partsServiceMock";

import { HiQrCode } from "react-icons/hi2";


type Props = {
  onScan: (part: PartCatalogItem) => void;
};

export function BarcodeScannerButton({ onScan }: Props) {
  return (
    <button
      type="button"
      onClick={() => onScan(PartsServiceMock.mockBarcodeLookup())}
      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[rgba(13,31,60,0.2)] bg-white py-3 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/40 hover:bg-[#fafbfc]"
    >
      <HiQrCode className="h-5 w-5 text-accent" aria-hidden />
      Escanear peça
      <span className="font-normal normal-case text-neutral-500">(mock)</span>
    </button>
  );
}
