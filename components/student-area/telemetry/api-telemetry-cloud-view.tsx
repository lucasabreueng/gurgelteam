"use client";

import Link from "next/link";
import { HiCloudArrowUp } from "react-icons/hi2";
import {
  adminCardClass,
  telemetryLoadingTextClass,
  telemetryWorkspaceBgClass,
} from "@/lib/design";
import { useSectorsPageData } from "./use-telemetry-session-data";

type Props = {
  sessionId: string;
};

/** Vista resumida quando a sessão ativa veio da API (sem pontos GPS locais). */
export function ApiTelemetryCloudView({ sessionId }: Props) {
  const { data, loading, error } = useSectorsPageData(sessionId);

  if (loading) {
    return (
      <div
        className={`flex h-full min-h-0 flex-col items-center justify-center ${telemetryWorkspaceBgClass}`}
      >
        <p className={telemetryLoadingTextClass}>Carregando sessão da nuvem…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className={`flex h-full min-h-0 flex-col items-center justify-center gap-3 p-6 text-center ${telemetryWorkspaceBgClass}`}
      >
        <p className="text-sm text-[var(--ds-text-secondary)]">
          {error ?? "Não foi possível carregar os dados desta sessão."}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden ${telemetryWorkspaceBgClass}`}
    >
      <div className="min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
        <div className={`mx-auto max-w-lg p-6 ${adminCardClass}`}>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <HiCloudArrowUp className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[var(--ds-text-primary)]">
                Sessão na nuvem
              </h2>
              <p className="mt-1 text-sm text-[var(--ds-text-secondary)]">
                {data.summary.trackName} · {data.summary.dateLabel}
              </p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]">
                Melhor volta
              </dt>
              <dd className="mt-0.5 font-mono text-lg font-bold text-[var(--ds-success-text)]">
                {data.summary.bestLap}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]">
                Voltas válidas
              </dt>
              <dd className="mt-0.5 font-semibold text-[var(--ds-text-primary)]">
                {data.summary.totalLaps}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]">
                Média
              </dt>
              <dd className="mt-0.5 font-mono font-semibold tabular-nums text-[var(--ds-text-primary)]">
                {data.summary.average}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]">
                Volta ideal
              </dt>
              <dd className="mt-0.5 font-mono font-semibold tabular-nums text-[var(--ds-text-primary)]">
                {data.summary.idealLap}
              </dd>
            </div>
          </dl>

          <p className="mt-6 text-sm leading-relaxed text-[var(--ds-text-secondary)]">
            Gráficos de velocidade, mapa GPS e comparação de traçado exigem importar o
            arquivo CSV localmente. Os setores e tempos de volta desta sessão estão
            disponíveis na aba dedicada.
          </p>

          <Link
            href="/piloto/telemetria/setores"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white transition hover:brightness-110"
          >
            Abrir análise de setores
          </Link>
        </div>
      </div>
    </div>
  );
}
