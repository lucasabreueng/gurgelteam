import { HiXMark } from "react-icons/hi2";

type Props = {
  osNumber: string;
  responsible: string;
  dateTime: string;
  onSaveDraft: () => void;
  onCreate: () => void;
  onClose: () => void;
  createDisabled?: boolean;
};

export function MaintenanceHeader({
  osNumber,
  responsible,
  dateTime,
  onSaveDraft,
  onCreate,
  onClose,
  createDisabled,
}: Props) {
  return (
    <header className="shrink-0 border-b border-[rgba(17,17,17,0.08)] bg-white px-4 py-3 md:px-5 md:py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                Paddock · Oficina técnica
              </p>
              <h1 className="text-xl font-bold tracking-tight text-[#0d1f3c]">
                Nova manutenção
              </h1>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100 lg:hidden"
              aria-label="Fechar"
            >
              <HiXMark className="h-6 w-6" />
            </button>
          </div>
          <dl className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-600">
            <div>
              <dt className="inline font-bold uppercase text-neutral-400">OS </dt>
              <dd className="inline font-bold tabular-nums text-[#0d1f3c]">
                {osNumber}
              </dd>
            </div>
            <div>
              <dt className="inline font-bold uppercase text-neutral-400">
                Resp.{" "}
              </dt>
              <dd className="inline font-semibold">{responsible}</dd>
            </div>
            <div>
              <dt className="inline font-bold uppercase text-neutral-400">
                Data{" "}
              </dt>
              <dd className="inline font-semibold tabular-nums">{dateTime}</dd>
            </div>
          </dl>
        </div>
        <div className="hidden flex-wrap gap-2 lg:flex">
          <button
            type="button"
            onClick={onSaveDraft}
            className="rounded-xl border border-[rgba(13,31,60,0.2)] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-[#0d1f3c]"
          >
            Salvar rascunho
          </button>
          <button
            type="button"
            onClick={onCreate}
            disabled={createDisabled}
            className="rounded-xl bg-[#0d1f3c] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md transition hover:brightness-110 disabled:opacity-50"
          >
            Criar OS
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2.5 text-neutral-500 hover:bg-neutral-100"
            aria-label="Fechar"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
