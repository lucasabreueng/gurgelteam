"use client";

import { HiOutlineCloudArrowUp, HiOutlineFolderOpen } from "react-icons/hi2";
import { useTelemetryTabletLayout } from "@/lib/hooks/use-telemetry-tablet-layout";
import {
  telemetryEmptyCardClass,
  telemetryOutlineBtnClass,
} from "@/lib/design";

type Props = {
  onOpenSessions?: () => void;
  onOpenLoad?: () => void;
};

export function TelemetryEmptyState({ onOpenSessions, onOpenLoad }: Props) {
  const { phone } = useTelemetryTabletLayout();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className={telemetryEmptyCardClass}>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]">
          Telemetria
        </p>
        <h2 className="mt-2 text-xl font-bold text-[var(--ds-text-primary)]">
          Nenhuma telemetria selecionada
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--ds-text-secondary)]">
          Abra uma sessão do histórico ou carregue um arquivo para visualizar
          voltas, setores e gráficos.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {onOpenSessions ? (
            <button
              type="button"
              onClick={onOpenSessions}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
            >
              <HiOutlineFolderOpen className="h-4 w-4" aria-hidden />
              Abrir telemetria
            </button>
          ) : null}
          {onOpenLoad && !phone ? (
            <button
              type="button"
              onClick={onOpenLoad}
              className={`${telemetryOutlineBtnClass} inline-flex items-center justify-center gap-2 px-5 py-2.5`}
            >
              <HiOutlineCloudArrowUp className="h-4 w-4" aria-hidden />
              Carregar telemetria
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
