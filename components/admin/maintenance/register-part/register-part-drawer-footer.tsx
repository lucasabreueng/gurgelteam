type Props = {
  onSave: () => void;
  onSaveAndAddAnother: () => void;
  onRequestPurchase: () => void;
  onCancel: () => void;
  saveDisabled?: boolean;
};

export function RegisterPartDrawerFooter({
  onSave,
  onSaveAndAddAnother,
  onRequestPurchase,
  onCancel,
  saveDisabled,
}: Props) {
  return (
    <footer className="shrink-0 border-t border-[rgba(17,17,17,0.08)] bg-white shadow-[0_-8px_32px_rgba(13,31,60,0.08)]">
      <div className="grid grid-cols-2 gap-2 p-3 md:grid-cols-4 md:px-4">
        <button
          type="button"
          onClick={onSave}
          disabled={saveDisabled}
          className="rounded-xl bg-emerald-600 px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Salvar registro
        </button>
        <button
          type="button"
          onClick={onSaveAndAddAnother}
          disabled={saveDisabled}
          className="rounded-xl bg-[#0d1f3c] px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Salvar e outra
        </button>
        <button
          type="button"
          onClick={onRequestPurchase}
          className="rounded-xl border border-[rgba(13,31,60,0.2)] bg-white px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/40"
        >
          Solicitar compra
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[rgba(13,31,60,0.2)] bg-[#fafbfc] px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-neutral-600"
        >
          Cancelar
        </button>
      </div>
    </footer>
  );
}
