"use client";

import {
  HiChartBar,
  HiChartPie,
  HiClock,
  HiFlag,
  HiSparkles,
} from "react-icons/hi2";
import type { IconType } from "react-icons/lib";
import { KpiCard } from "@/components/ui/kpi-card";
import type { SectorsPageSummary } from "@/lib/contracts/telemetry/sectors";

type Props = {
  summary: SectorsPageSummary;
};

export function SectorsSessionHeader({ summary }: Props) {
  const kpis: {
    label: string;
    value: string;
    Icon: IconType;
    valueClassName?: string;
  }[] = [
    {
      label: "Voltas",
      value: String(summary.totalLaps),
      Icon: HiFlag,
      valueClassName: "font-mono tabular-nums",
    },
    {
      label: "Melhor tempo",
      value: `${summary.bestLap}s`,
      Icon: HiSparkles,
      valueClassName: "font-mono tabular-nums text-accent",
    },
    {
      label: "Média de tempo",
      value: `${summary.average}s`,
      Icon: HiClock,
      valueClassName: "font-mono tabular-nums",
    },
    {
      label: "Volta ideal",
      value: `${summary.idealLap}s`,
      Icon: HiChartBar,
      valueClassName: "font-mono tabular-nums text-accent",
    },
    {
      label: "Consistência",
      value: summary.consistency,
      Icon: HiChartPie,
      valueClassName: "font-mono tabular-nums",
    },
  ];

  return (
    <header>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <li key={kpi.label} className="min-w-0">
            <KpiCard
              label={kpi.label}
              value={kpi.value}
              Icon={kpi.Icon}
              valueClassName={kpi.valueClassName}
            />
          </li>
        ))}
      </ul>
    </header>
  );
}
