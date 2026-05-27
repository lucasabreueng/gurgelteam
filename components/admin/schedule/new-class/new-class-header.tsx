import { HiXMark } from "react-icons/hi2";

type Props = {
  onClose: () => void;
};

export function NewClassHeader({ onClose }: Props) {
  return (
    <header className="shrink-0 border-b border-[rgba(17,17,17,0.08)] bg-white px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1
            id="new-class-drawer-title"
            className="text-xl font-bold text-[#0d1f3c]"
          >
            Nova aula
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Defina aluno, kart e horário da aula.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.1)] text-neutral-500 hover:bg-neutral-100"
          aria-label="Fechar"
        >
          <HiXMark className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
