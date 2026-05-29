"use client";

import {
  HiChartBar,
  HiChartPie,
  HiClock,
  HiFlag,
  HiSparkles,
} from "react-icons/hi2";
import type { IconType } from "react-icons/lib";
import { AdminResponsiveKpis } from "@/components/admin/admin-responsive-kpis";
import type { SectorsPageSummary } from "@/lib/contracts/telemetry/sectors";

type Props = {
  summary: SectorsPageSummary;
};

const KPI_ICONS: Record<string, IconType> = {
  voltas: HiFlag,
  melhor: HiSparkles,
  media: HiClock,
  ideal: HiChartBar,
  consistencia: HiChartPie,
};

export function SectorsSessionHeader({ summary }: Props) {
  const kpis = [
    {
      id: "voltas",
      label: "Voltas",
      value: String(summary.totalLaps),
      valueClassName: "font-mono tabular-nums",
    },
    {
      id: "melhor",
      label: "Melhor tempo",
      value: `${summary.bestLap}s`,
      valueClassName: "font-mono tabular-nums text-accent",
    },
    {
      id: "media",
      label: "Média de tempo",
      value: `${summary.average}s`,
      valueClassName: "font-mono tabular-nums",
    },
    {
      id: "ideal",
      label: "Volta ideal",
      value: `${summary.idealLap}s`,
      valueClassName: "font-mono tabular-nums text-accent",
    },
    {
      id: "consistencia",
      label: "Consistência",
      value: summary.consistency,
      valueClassName: "font-mono tabular-nums",
    },
  ];

  return (
    <header>
      <AdminResponsiveKpis
        kpis={kpis}
        icons={KPI_ICONS}
        desktopClassName="admin-page-grid grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      />
    </header>
  );
}
