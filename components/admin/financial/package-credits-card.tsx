import type { PackageCreditStatus } from "@/lib/contracts/finance";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";


const STATUS_STYLES: Record<PackageCreditStatus, string> = {
  ativo: "bg-emerald-50 text-emerald-800",
  expirando: "bg-amber-50 text-amber-900",
  esgotado: "bg-neutral-100 text-neutral-600",
};

export function PackageCreditsCard() {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6">
      <ul className="space-y-4">
        {FinancialServiceMock.getPackageCredits().map((pkg) => {
          const pct = Math.round((pkg.lessonsUsed / pkg.lessonsTotal) * 100);
          const remaining = pkg.lessonsTotal - pkg.lessonsUsed;
          return (
            <li
              key={pkg.id}
              className="rounded-xl border border-[rgba(17,17,17,0.06)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-[#0d1f3c]">{pkg.clientName}</p>
                  <p className="text-sm text-neutral-600">{pkg.packageName}</p>
                </div>
                <span
                  className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[pkg.status]}`}
                >
                  {FinancialServiceMock.getPackageStatusLabels()[pkg.status]}
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
