"use client";

import type { PackageCreditStatus } from "@/lib/contracts/finance";
import { useFinanceInsights } from "@/lib/query/hooks/use-finance-insights";
import { getAppServices } from "@/lib/data-source/app-services";
import {
  adminBadgeNeutralStatusClass,
  adminBadgeSuccessClass,
  adminBadgeWarningClass,
  adminCardClass,
  adminEmptyStateClass,
} from "@/lib/design";

const STATUS_STYLES: Record<PackageCreditStatus, string> = {
  ativo: adminBadgeSuccessClass,
  expirando: adminBadgeWarningClass,
  esgotado: adminBadgeNeutralStatusClass,
};

export function PackageCreditsCard() {
  const { data, isLoading } = useFinanceInsights();
  const packages = data?.packageCredits ?? [];
  const statusLabels = getAppServices().finance.getPackageStatusLabels();

  if (isLoading) {
    return (
      <section className={`${adminCardClass} p-5 md:p-6`}>
        <div className="h-32 animate-pulse rounded-xl bg-[var(--ds-bg-muted)]" />
      </section>
    );
  }

  if (packages.length === 0) {
    return (
      <section className={`${adminCardClass} p-5 md:p-6`}>
        <p className={adminEmptyStateClass}>Nenhum pacote ativo no momento.</p>
      </section>
    );
  }

  return (
    <section className={`${adminCardClass} p-5 md:p-6`}>
      <ul className="space-y-4">
        {packages.map((pkg) => {
          const pct = Math.round((pkg.lessonsUsed / pkg.lessonsTotal) * 100);
          const remaining = pkg.lessonsTotal - pkg.lessonsUsed;
          return (
            <li
              key={pkg.id}
              className="rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-bg-muted)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-[var(--ds-text-primary)]">{pkg.clientName}</p>
                  <p className="text-sm text-[var(--ds-text-secondary)]">{pkg.packageName}</p>
                </div>
                <span
                  className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${STATUS_STYLES[pkg.status]}`}
                >
                  {statusLabels[pkg.status]}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-bold uppercase text-neutral-500">
                  <span>Uso do pacote</span>
                  <span className="tabular-nums text-[#0d1f3c]">
                    {remaining} aulas restantes
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#fafbfc] ring-1 ring-[rgba(17,17,17,0.06)]">
                  <div
                    className="h-full rounded-full bg-[#0d1f3c] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-neutral-500">
                  {pkg.lessonsUsed}/{pkg.lessonsTotal} aulas · válido até {pkg.validity}
                </p>
              </div>
              <p className="mt-2 text-sm font-bold text-[#0d1f3c]">
                {pkg.amountPaid}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
