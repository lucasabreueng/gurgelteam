import type { IconType } from "react-icons/lib";
import { HiInformationCircle } from "react-icons/hi2";
import {
  adminKpiCardClass,
  adminKpiIconWrapClass,
  adminKpiLabelClass,
  adminKpiValueClass,
} from "@/lib/design";

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
  /** Badge de variação (delta) ao lado do valor — desligado em KPIs de frota/equipe/estoque/financeiro. */
  showDeltaBadge?: boolean;
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
  showDeltaBadge = true,
}: KpiCardProps) {
  const nowrap = noWrap ? "whitespace-nowrap" : "";

  return (
    <div
      className={`${adminKpiCardClass} ${noWrap ? "w-max max-w-none flex-nowrap" : ""}`}
    >
      {Icon ? (
        <div className={`${adminKpiIconWrapClass} ${iconClassName}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      ) : null}
      <div className={noWrap ? "shrink-0" : "min-w-0 flex-1"}>
        <p
          className={`flex items-center gap-1.5 ${adminKpiLabelClass} ${nowrap}`}
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
            className={`${adminKpiValueClass} ${nowrap} ${valueClassName}`}
          >
            {value}
          </p>
          {showDeltaBadge && delta ? (
            <span
              className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold ${nowrap} ${
                deltaPositive
                  ? "bg-[var(--ds-success-bg)] text-[var(--ds-success-text)] ring-1 ring-[var(--ds-success-border)]"
                  : "bg-[var(--ds-error-bg)] text-[var(--ds-error-text)] ring-1 ring-[var(--ds-error-border)]"
              }`}
            >
              {delta}
            </span>
          ) : null}
        </div>
        {sub ? (
          <p className={`mt-1 text-xs text-[var(--ds-text-muted)] ${nowrap}`}>
            {sub}
          </p>
        ) : null}
      </div>
    </div>
  );
}
