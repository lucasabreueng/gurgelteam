import type { IconType } from "react-icons/lib";
import { HiInformationCircle } from "react-icons/hi2";

export type KpiCardProps = {
  label: string;
  value: string;
  delta?: string | null;
  deltaPositive?: boolean;
  Icon?: IconType;
  sub?: string | null;
  tooltip?: string;
  valueClassName?: string;
  iconClassName?: string;
  /** Evita quebra de linha no rótulo, valor e delta (ex.: faixa horizontal de karts). */
  noWrap?: boolean;
};

/** KPI padrão da aplicação (layout horizontal: ícone + label + valor + badge). */
export function KpiCard({
  label,
  value,
  delta,
  deltaPositive = true,
  Icon,
  sub,
  tooltip,
  valueClassName = "",
  iconClassName = "",
  noWrap = false,
}: KpiCardProps) {
  const nowrap = noWrap ? "whitespace-nowrap" : "";

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-[0_2px_12px_rgba(13,31,60,0.04)] transition hover:shadow-[0_6px_24px_rgba(13,31,60,0.08)] md:p-5 ${noWrap ? "w-max max-w-none flex-nowrap" : ""}`}
    >
      {Icon ? (
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(13,31,60,0.06)] text-accent ${iconClassName}`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      ) : null}
      <div className={noWrap ? "shrink-0" : "min-w-0 flex-1"}>
        <p
          className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 ${nowrap}`}
        >
          {label}
          {tooltip ? (
            <span
              title={tooltip}
              className="inline-flex cursor-help text-neutral-400"
              aria-label={tooltip}
            >
              <HiInformationCircle className="h-3.5 w-3.5" aria-hidden />
            </span>
          ) : null}
        </p>
        <div
          className={`mt-0.5 flex items-center gap-2 ${noWrap ? "flex-nowrap" : "justify-between"}`}
        >
          <p
            className={`text-xl font-bold leading-tight tracking-tight text-[#0d1f3c] md:text-2xl ${nowrap} ${valueClassName}`}
          >
            {value}
          </p>
          {delta ? (
            <span
              className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold ${nowrap} ${
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
          <p className={`mt-1 text-xs text-neutral-600 ${nowrap}`}>{sub}</p>
        ) : null}
      </div>
    </div>
  );
}
