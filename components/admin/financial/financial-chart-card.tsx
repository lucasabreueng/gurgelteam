import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function FinancialChartCard({
  title,
  subtitle,
  children,
  className = "",
}: Props) {
  return (
    <section
      className={`rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-5 ${className}`}
    >
      <h3 className="text-sm font-bold text-[#0d1f3c]">{title}</h3>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
