"use client";

import { HiXMark } from "react-icons/hi2";
import type { RegisterPartOsContext } from "@/lib/contracts/parts";

type Props = {
  context: RegisterPartOsContext;
  onClose: () => void;
  onSave: () => void;
  onSaveAndAddAnother: () => void;
  saveDisabled?: boolean;
};

export function RegisterPartHeader({
  context,
  onClose,
  onSave,
  onSaveAndAddAnother,
  saveDisabled,
}: Props) {
  return (
    <header className="shrink-0 border-b border-[rgba(17,17,17,0.08)] bg-white">
      <div className="flex items-start justify-between gap-3 px-3 py-3 md:px-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-[#0d1f3c]">Registrar peça</h2>
          <p className="mt-0.5 text-sm font-semibold text-[#0d1f3c]">
            {context.osNumber} · Kart{" "}
            {String(context.kartNumber).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[11px] text-neutral-600">
            {context.status} · {context.mechanicName}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1.5 text-neutral-600 hover:bg-[#fafbfc]"
          aria-label="Fechar"
        >
          <HiXMark className="h-5 w-5" />
        </button>
      </div>
      <div className="flex gap-2 border-t border-[rgba(17,17,17,0.06)] bg-[#fafbfc] px-3 py-2 md:px-4">
        <button
          type="button"
          onClick={onSave}
          disabled={saveDisabled}
          className="rounded-xl bg-[#0d1f3c] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={onSaveAndAddAnother}
          disabled={saveDisabled}
          className="rounded-xl border border-[rgba(13,31,60,0.2)] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Outra peça
        </button>
      </div>
    </header>
  );
}
