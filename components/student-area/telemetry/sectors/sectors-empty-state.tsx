"use client";

import { telemetryEmptyCardClass } from "@/lib/design";

export function SectorsEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className={telemetryEmptyCardClass}>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]">
          Setores
        </p>
        <h2 className="mt-2 text-xl font-bold text-[var(--ds-text-primary)]">
          Nenhuma volta válida
        </h2>
        <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-[var(--ds-text-secondary)]">
          Importe uma sessão com voltas válidas ou selecione outra sessão no
          histórico.
        </p>
      </div>
    </div>
  );
}
