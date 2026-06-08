import type { ReactNode } from "react";

import { adminCardClass, adminHintClass, adminTextAccentClass } from "@/lib/design";

type Props = {
  title: string;
  subtitle?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function FinancialChartCard({
  title,
  subtitle,
  headerAction,
  children,
  className = "",
}: Props) {
  return (
    <section className={`${adminCardClass} p-4 md:p-5 ${className}`.trim()}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={`text-sm ${adminTextAccentClass}`}>{title}</h3>
          {subtitle ? (
            <p className={`mt-0.5 ${adminHintClass}`}>{subtitle}</p>
          ) : null}
        </div>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
