"use client";

type Props = {
  onChangeSession?: () => void;
};

export function SectorsEmptyState({ onChangeSession }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white px-8 py-10 shadow-[0_2px_12px_rgba(13,31,60,0.06)]">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          Sem dados
        </p>
        <h2 className="mt-2 text-xl font-bold text-[#0d1f3c]">
          Nenhuma volta disponível
        </h2>
        <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-neutral-600">
          Carregue uma sessão ou selecione outra no histórico para analisar os
          setores.
        </p>
        {onChangeSession ? (
          <button
            type="button"
            onClick={onChangeSession}
            className="mt-6 rounded-xl bg-accent px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
          >
            Escolher sessão
          </button>
        ) : null}
      </div>
    </div>
  );
}
