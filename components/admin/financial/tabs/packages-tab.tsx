"use client";

import { PackageCreditsCard } from "../package-credits-card";
import { useFinanceInsights } from "@/lib/query/hooks/use-finance-insights";

export function PackagesTab() {
  const { data } = useFinanceInsights();
  const packages = data?.packageCredits ?? [];
  const expiring = packages.filter(
    (p) => p.status === "expirando" || p.lessonsTotal - p.lessonsUsed <= 2,
  );

  return (
    <div className="admin-page-stack">
      <div>
        <h2 className="text-lg font-bold text-[#0d1f3c]">Pacotes e créditos</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Pacotes ativos, consumo de aulas e validade
        </p>
      </div>

      {expiring.length > 0 ? (
        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-amber-900">
            Vencimentos próximos
          </p>
          <ul className="mt-2 space-y-1 text-sm text-amber-950">
            {expiring.map((p) => (
              <li key={p.id}>
                {p.clientName} — {p.packageName} ·{" "}
                {p.lessonsTotal - p.lessonsUsed} aulas restantes
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <PackageCreditsCard />
    </div>
  );
}
