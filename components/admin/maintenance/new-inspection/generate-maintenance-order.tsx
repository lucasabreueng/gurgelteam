"use client";

import { useState } from "react";
import { HiDocumentPlus } from "react-icons/hi2";

type Props = {
  onGenerated?: (osNumber: string) => void;
};

export function GenerateMaintenanceOrder({ onGenerated }: Props) {
  const [generated, setGenerated] = useState<string | null>(null);

  const handleGenerate = () => {
    const os = `OS-${String(Math.floor(1000 + Math.random() * 9000))}`;
    setGenerated(os);
    onGenerated?.(os);
  };

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-5">
      <h2 className="text-sm font-bold text-[#0d1f3c]">
        Geração automática de OS
      </h2>
      <p className="mt-1 text-xs text-neutral-500">
        Vincula inspeção à ordem de manutenção
      </p>
      <button
        type="button"
        onClick={handleGenerate}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(227,6,19,0.25)] transition hover:brightness-110 sm:w-auto"
      >
        <HiDocumentPlus className="h-5 w-5" aria-hidden />
        Gerar ordem de manutenção
      </button>
      {generated ? (
        <div className="mt-4 rounded-xl border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-sm">
          <p className="font-bold text-emerald-900">{generated} criada</p>
          <p className="mt-1 text-xs text-emerald-800">
            Kart em manutenção · inspeção vinculada (mock)
          </p>
        </div>
      ) : null}
    </section>
  );
}
