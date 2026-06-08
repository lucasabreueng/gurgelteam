type Props = {
  onSaveDraft: () => void;
  onFinish: () => void;
  onGenerateOs: () => void;
  onRelease: () => void;
  onCancel: () => void;
  compactSummary?: string;
  disabled?: boolean;
};

export function InspectionFooterActions({
  onSaveDraft,
  onFinish,
  onGenerateOs,
  onRelease,
  onCancel,
  compactSummary,
  disabled = false,
}: Props) {
  return (
    <footer className="shrink-0 border-t border-[rgba(17,17,17,0.08)] bg-white px-4 py-3 shadow-[0_-4px_20px_rgba(13,31,60,0.06)] md:px-6 md:py-4">
      {compactSummary ? (
        <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral-500 md:text-left">
          {compactSummary}
        </p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="order-last rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-neutral-500 transition hover:bg-neutral-100 sm:order-first sm:mr-auto"
        >
          Cancelar
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onSaveDraft}
          className="rounded-xl border border-[rgba(13,31,60,0.2)] px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#0d1f3c]"
        >
          Salvar rascunho
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onGenerateOs}
          className="rounded-xl border-2 border-accent/40 bg-accent/5 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-accent"
        >
          Gerar OS
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onRelease}
          className="rounded-xl border-2 border-emerald-300/60 bg-emerald-50 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-emerald-900"
        >
          Liberar kart
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onFinish}
          className="rounded-xl bg-[#0d1f3c] px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-white shadow-[0_4px_16px_rgba(13,31,60,0.2)]"
        >
          Finalizar inspeção
        </button>
      </div>
    </footer>
  );
}
