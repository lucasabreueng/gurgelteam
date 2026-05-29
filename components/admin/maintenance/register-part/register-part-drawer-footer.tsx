import {
  DRAWER_FOOTER_INNER_CLASS,
  DRAWER_FOOTER_SHELL_CLASS,
  DrawerFooterActions,
} from "@/components/ui/drawer-footer";

type Props = {
  onSave: () => void;
  onSaveAndAddAnother: () => void;
  onRequestPurchase: () => void;
  onCancel: () => void;
  saveDisabled?: boolean;
};

const btnClass =
  "rounded-xl px-3 py-3 text-[10px] font-bold uppercase tracking-wider transition";

export function RegisterPartDrawerFooter({
  onSave,
  onSaveAndAddAnother,
  onRequestPurchase,
  onCancel,
  saveDisabled,
}: Props) {
  return (
    <footer className={`${DRAWER_FOOTER_SHELL_CLASS} shadow-[0_-8px_32px_rgba(13,31,60,0.08)]`}>
      <div className={DRAWER_FOOTER_INNER_CLASS}>
        <DrawerFooterActions columns={4}>
          <button
            type="button"
            onClick={onSave}
            disabled={saveDisabled}
            className={`${btnClass} bg-emerald-600 text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            Salvar registro
          </button>
          <button
            type="button"
            onClick={onSaveAndAddAnother}
            disabled={saveDisabled}
            className={`${btnClass} bg-[#0d1f3c] text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            Salvar e outra
          </button>
          <button
            type="button"
            onClick={onRequestPurchase}
            className={`${btnClass} border border-[rgba(13,31,60,0.2)] bg-white text-[#0d1f3c] hover:border-accent/40`}
          >
            Solicitar compra
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={`${btnClass} border border-[rgba(13,31,60,0.2)] bg-[#fafbfc] text-neutral-600`}
          >
            Cancelar
          </button>
        </DrawerFooterActions>
      </div>
    </footer>
  );
}
