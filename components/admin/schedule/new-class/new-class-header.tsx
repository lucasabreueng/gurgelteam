import { HiXMark } from "react-icons/hi2";
import { adminDrawerHeaderSimpleClass, adminIconButtonClass } from "@/lib/design";

type Props = {
  onClose: () => void;
};

export function NewClassHeader({ onClose }: Props) {
  return (
    <header className={adminDrawerHeaderSimpleClass}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1
            id="new-class-drawer-title"
            className="text-xl font-bold text-[var(--ds-text-primary)]"
          >
            Nova aula
          </h1>
          <p className="mt-1 text-sm text-[var(--ds-text-secondary)]">
            Defina aluno, kart e horário da aula.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={adminIconButtonClass}
          aria-label="Fechar"
        >
          <HiXMark className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
