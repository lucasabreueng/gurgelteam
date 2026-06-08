"use client";

import type { IconType } from "react-icons/lib";
import { KpiCard, type KpiCardProps } from "@/components/ui/kpi-card";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";

export type AdminKpiItem = Pick<
  KpiCardProps,
  | "label"
  | "value"
  | "delta"
  | "deltaPositive"
  | "sub"
  | "tooltip"
  | "iconClassName"
  | "valueClassName"
> & {
  id: string;
};

type Props = {
  kpis: AdminKpiItem[];
  icons?: Record<string, IconType>;
  defaultIcon?: IconType;
  /** Grid desktop (lg+). Incluir `admin-page-grid grid` e colunas. */
  desktopClassName?: string;
  className?: string;
  /** Sempre faixa horizontal (ex.: telemetria). */
  forceHorizontalStrip?: boolean;
  /** Exibe badge de variação (delta) — desligado em karts/equipe/estoque/financeiro. */
  showDeltaBadge?: boolean;
};

const STRIP_CLASSES =
  "admin-kpi-horizontal-strip app-scrollbar-hidden flex flex-nowrap gap-[var(--admin-gap)] overflow-x-auto scroll-smooth snap-x snap-mandatory touch-pan-x select-none overscroll-x-contain";

function AdminKpiCard({
  kpi,
  Icon,
  noWrap,
  showDeltaBadge,
}: {
  kpi: AdminKpiItem;
  Icon?: IconType;
  noWrap: boolean;
  showDeltaBadge: boolean;
}) {
  return (
    <KpiCard
      label={kpi.label}
      value={kpi.value}
      delta={kpi.delta}
      deltaPositive={kpi.deltaPositive}
      sub={kpi.sub}
      tooltip={kpi.tooltip}
      Icon={Icon}
      iconClassName={kpi.iconClassName}
      valueClassName={kpi.valueClassName}
      noWrap={noWrap}
      showDeltaBadge={showDeltaBadge}
    />
  );
}

/** KPIs em faixa horizontal (< lg e tablet paisagem) e grid no desktop. */
export function AdminResponsiveKpis({
  kpis,
  icons = {},
  defaultIcon,
  desktopClassName = "admin-page-grid grid grid-cols-2 lg:grid-cols-4",
  className = "",
  forceHorizontalStrip = false,
  showDeltaBadge = true,
}: Props) {
  const { tabletLandscape } = useAdminPanelTabletLayout();

  if (kpis.length === 0) return null;

  const rootClass = ["min-w-0", className].filter(Boolean).join(" ");
  const useStrip = forceHorizontalStrip || tabletLandscape;

  if (useStrip) {
    return (
      <div className={rootClass}>
        <ul className={STRIP_CLASSES}>
          {kpis.map((kpi) => (
            <li key={kpi.id} className="shrink-0 snap-start">
              <AdminKpiCard
                kpi={kpi}
                Icon={icons[kpi.id] ?? defaultIcon}
                noWrap
                showDeltaBadge={showDeltaBadge}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      <div className={`lg:hidden ${rootClass}`}>
        <ul className={STRIP_CLASSES}>
          {kpis.map((kpi) => (
            <li key={kpi.id} className="shrink-0 snap-start">
              <AdminKpiCard
                kpi={kpi}
                Icon={icons[kpi.id] ?? defaultIcon}
                noWrap
                showDeltaBadge={showDeltaBadge}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className={`hidden lg:block ${rootClass}`}>
        <ul className={desktopClassName}>
          {kpis.map((kpi) => (
            <li key={kpi.id} className="min-w-0">
              <AdminKpiCard
                kpi={kpi}
                Icon={icons[kpi.id] ?? defaultIcon}
                noWrap={false}
                showDeltaBadge={showDeltaBadge}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
