"use client";

import { HiCheck } from "react-icons/hi2";

type Props = {
  saving: boolean;
  saved: boolean;
  dirty: boolean;
  onSave: () => void;
};

export function ProfileSaveBar({ saving, saved, dirty, onSave }: Props) {
  return (
    <div
      className={`sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 shadow-[0_8px_32px_rgba(13,31,60,0.12)] transition-all duration-300 md:px-5 ${
        saved
          ? "border-emerald-200/80 bg-emerald-50"
          : "border-[rgba(17,17,17,0.08)] bg-white"
      }`}
    >
      <div className="min-w-0">
        {saved ? (
          <p className="flex items-center gap-2 text-[13px] font-semibold text-emerald-800">
            <HiCheck className="h-4 w-4 shrink-0" aria-hidden />
            Alterações salvas com sucesso
          </p>
        ) : (
          <p className="text-[13px] text-neutral-600">
            {dirty
              ? "Você tem alterações não salvas"
              : "Seus dados estão atualizados"}
          </p>
        )}
      </div>
      <button
        type="button"
        disabled={saving || (!dirty && !saved)}
        onClick={onSave}
        className="rounded-xl bg-accent px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white shadow-[0_6px_20px_rgba(13,31,60,0.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Salvando…" : "Salvar alterações"}
      </button>
    </div>
  );
}
