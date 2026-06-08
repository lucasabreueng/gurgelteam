import { DRAWER_FOOTER_SHELL_CLASS } from "@/components/ui/drawer-footer";
import { adminDrawerPrimaryBtnClass } from "@/lib/design";

type Props = {
  onConfirm: () => void;
  confirmDisabled?: boolean;
};

export function NewClassFooter({ onConfirm, confirmDisabled }: Props) {
  return (
    <footer className={`${DRAWER_FOOTER_SHELL_CLASS} px-4 py-3 md:px-5`}>
      <button
        type="button"
        onClick={onConfirm}
        disabled={confirmDisabled}
        className={`w-full ${adminDrawerPrimaryBtnClass}`}
      >
        Agendar aula
      </button>
    </footer>
  );
}
