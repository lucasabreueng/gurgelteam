import type { IconType } from "react-icons/lib";

export type KpiCardProps = {
  label: string;
  value: string;
  delta?: string | null;
  deltaPositive?: boolean;
  Icon?: IconType;
  sub?: string | null;
  valueClassName?: string;
  iconClassName?: string;
};

/** KPI padrão da aplicação (layout horizontal: ícone + label + valor + badge). */
export function KpiCard({
  label,
  value,
  delta,
  deltaPositive = true,
  Icon,
  sub,
  valueClassName = "",
  iconClassName = "",
}: KpiCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-[0_2px_12px_rgba(13,31,60,0.04)] transition hover:shadow-[0_6px_24px_rgba(13,31,60,0.08)] md:p-5">
      {Icon ? (
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(13,31,60,0.06)] text-accent ${iconClassName}`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          {label}
        </p>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p
            className={`text-xl font-bold leading-tight tracking-tight text-[#0d1f3c] md:text-2xl ${valueClassName}`}
          >
            {value}
          </p>
          {delta ? (
            <span
              className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                deltaPositive
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60"
                  : "bg-red-50 text-red-700 ring-1 ring-red-200/60"
              }`}
            >
              {delta}
            </span>
          ) : null}
        </div>
        {sub ? (
          <p className="mt-1 text-xs text-neutral-600">{sub}</p>
        ) : null}
      </div>
    </div>
  );
}
