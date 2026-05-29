"use client";

import { HiOutlineCloudArrowUp, HiOutlineFolderOpen } from "react-icons/hi2";
import { useTelemetryTabletLayout } from "@/lib/hooks/use-telemetry-tablet-layout";

type Props = {
  onOpenSessions?: () => void;
  onOpenLoad?: () => void;
};

export function TelemetryEmptyState({ onOpenSessions, onOpenLoad }: Props) {
  const { phone } = useTelemetryTabletLayout();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-md rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white px-8 py-10 shadow-[0_2px_12px_rgba(13,31,60,0.06)]">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          Telemetria
        </p>
        <h2 className="mt-2 text-xl font-bold text-[#0d1f3c]">
          Nenhuma telemetria selecionada
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">
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
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(17,17,17,0.12)] bg-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-700 transition hover:bg-neutral-50"
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
