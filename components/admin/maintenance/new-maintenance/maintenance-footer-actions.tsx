type Props = {
  onCreate: () => void;
  onCreateAndBlock: () => void;
  onCreateAndQuote: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
  createDisabled?: boolean;
};

export function MaintenanceFooterActions({
  onCreate,
  onCreateAndBlock,
  onCreateAndQuote,
  onSaveDraft,
  onCancel,
  createDisabled,
}: Props) {
  return (
    <footer className="shrink-0 border-t border-[rgba(17,17,17,0.08)] bg-white px-4 py-3 md:px-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="order-last rounded-xl px-4 py-3 text-[10px] font-bold uppercase text-neutral-500 sm:order-first sm:mr-auto"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          className="rounded-xl border border-[rgba(13,31,60,0.2)] px-4 py-3 text-[10px] font-bold uppercase text-[#0d1f3c]"
        >
          Salvar rascunho
        </button>
        <button
          type="button"
          onClick={onCreateAndQuote}
          disabled={createDisabled}
          className="rounded-xl border-2 border-accent/40 px-4 py-3 text-[10px] font-bold uppercase text-accent disabled:opacity-50"
        >
          Criar e gerar orçamento
        </button>
        <button
          type="button"
          onClick={onCreateAndBlock}
          disabled={createDisabled}
          className="rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-[10px] font-bold uppercase text-red-800 disabled:opacity-50"
        >
          Criar e bloquear kart
        </button>
        <button
          type="button"
          onClick={onCreate}
          disabled={createDisabled}
          className="rounded-xl bg-[#0d1f3c] px-5 py-3 text-[10px] font-bold uppercase text-white shadow-md disabled:opacity-50"
        >
          Criar OS
        </button>
      </div>
    </footer>
  );
}
