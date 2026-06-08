"use client";

import type { KartOwnership, KartStatus } from "@/lib/contracts/karts";
import { getAppServices } from "@/lib/data-source/app-services";
import { useKartsFleet } from "@/lib/query/hooks/use-karts";
import {
  adminBadgeInfoClass,
  adminBadgeNeutralStatusClass,
  adminBadgeSuccessClass,
  adminBadgeWarningClass,
  adminCardClass,
} from "@/lib/design";

function statusBadgeClass(status: KartStatus): string {
  switch (status) {
    case "disponivel":
      return adminBadgeSuccessClass;
    case "em_treino":
      return adminBadgeInfoClass;
    case "manutencao":
    case "aguardando_peca":
      return adminBadgeWarningClass;
    case "reservado":
    case "preparacao":
      return adminBadgeInfoClass;
    default:
      return adminBadgeNeutralStatusClass;
  }
}

function ownershipLabel(ownership: KartOwnership, ownerName?: string) {
  if (ownership === "client" && ownerName) {
    return `Cliente · ${ownerName}`;
  }
  if (ownership === "client") {
    return "Cliente";
  }
  return "Próprio";
}

export function KartStatusGrid() {
  const { data: kartFleet = [], isPending } = useKartsFleet();
  const statusLabels = getAppServices().karts.getStatusLabels();

  return (
    <div className={`p-6 md:p-7 ${adminCardClass}`}>
      <h3 className="text-xl font-bold text-[var(--ds-text-primary)]">Gestão de karts</h3>
      <p className="mt-1 text-sm text-[var(--ds-text-secondary)]">Paddock · status em tempo real</p>

      {isPending ? (
        <div className="mt-6 animate-pulse space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-[var(--ds-bg-muted)]"
            />
          ))}
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {kartFleet.map((k) => (
            <li
              key={k.id}
              className="flex flex-col gap-2 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-muted)] p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-2xl font-bold tabular-nums text-[var(--ds-text-primary)]">
                  {String(k.number).padStart(2, "0")}
                </p>
                <span
                  className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold ring-1 ${statusBadgeClass(k.status)}`}
                >
                  {statusLabels[k.status]}
                </span>
              </div>
              <p className="text-sm font-semibold text-[var(--ds-text-secondary)]">
                {k.categoryName}
              </p>
              <p className="text-[12px] text-[var(--ds-text-muted)]">
                {ownershipLabel(k.ownership, k.ownerName)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
