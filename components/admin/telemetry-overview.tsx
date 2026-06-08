"use client";

import { useMemo } from "react";
import Image from "next/image";
import { ThemedECharts } from "@/components/charts/themed-echarts";
import type { EChartsOption } from "echarts";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { useTelemetrySessionsList } from "@/lib/query/hooks/use-telemetry-sessions";
import { DashboardServiceMock } from "@/services/dashboard/dashboardServiceMock";
import {
  adminCardClass,
  adminCardMutedClass,
  adminInsightPanelClass,
  adminScoreChipClass,
  adminSectionTitleClass,
  adminStatTileClass,
  adminSubsectionTitleClass,
  adminTextValueClass,
} from "@/lib/design";
import { useChartTheme } from "@/lib/hooks/use-chart-theme";
import {
  buildConsistencyPct,
  buildEvolutionSeries,
  buildInsight,
  buildSectorDeltas,
} from "@/services/telemetry/build-overview-from-sessions";

export function TelemetryOverview() {
  const httpMode = getDataSourceMode() === "http";
  const { data: apiSessions = [] } = useTelemetrySessionsList();

  const evolutionSeries = useMemo(() => {
    if (httpMode && apiSessions.length > 0) {
      const built = buildEvolutionSeries(apiSessions);
      if (built.length > 0) return built;
    }
    return DashboardServiceMock.getTelemetryEvolutionSeries();
  }, [httpMode, apiSessions]);

  const telemetryInsight = useMemo(() => {
    if (httpMode && apiSessions.length > 0) {
      return buildInsight(apiSessions);
    }
    return DashboardServiceMock.getTelemetryInsight();
  }, [httpMode, apiSessions]);

  const telemetrySectors = useMemo(() => {
    if (httpMode && apiSessions.length > 0) {
      return buildSectorDeltas(apiSessions[0]);
    }
    return DashboardServiceMock.getTelemetrySectors();
  }, [httpMode, apiSessions]);

  const consistencyPct = useMemo(() => {
    if (httpMode && apiSessions.length > 0) {
      const pct = buildConsistencyPct(apiSessions);
      if (pct > 0) return pct;
    }
    return 89;
  }, [httpMode, apiSessions]);

  const chartTheme = useChartTheme();

  const chartOption = useMemo<EChartsOption>(() => {
    const cats = evolutionSeries.map((d) => d.week);
    const vals = evolutionSeries.map((d) => d.avg);
    const minY =
      vals.length > 0 ? Math.floor(Math.min(...vals) - 1) : 52;
    return {
      grid: { left: 48, right: 16, top: 24, bottom: 32 },
      xAxis: {
        type: "category",
        data: cats,
        axisLabel: { fontSize: 10 },
      },
      yAxis: {
        type: "value",
        min: minY,
        axisLine: { show: false },
        axisLabel: {
          fontSize: 10,
          formatter: (v: number) => `${v.toFixed(1)}s`,
        },
      },
      series: [
        {
          type: "line",
          smooth: 0.35,
          data: vals,
          lineStyle: { width: 2.75, color: chartTheme.line },
          itemStyle: { color: chartTheme.line },
          areaStyle: { opacity: 0.2, color: chartTheme.area },
        },
      ],
      tooltip: { trigger: "axis" },
    };
  }, [evolutionSeries, chartTheme]);

  return (
    <section className={`${adminCardClass} p-6 md:p-8`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={adminSectionTitleClass}>Performance</p>
          <h3 className={`mt-1 text-xl font-bold md:text-2xl ${adminTextValueClass}`}>
            Telemetria & evolução da equipe
          </h3>
        </div>
        <div className={adminScoreChipClass}>
          <p className="text-[10px] font-bold uppercase text-[var(--ds-text-muted)]">
            Consistência geral
          </p>
          <p className="text-lg font-bold text-[var(--ds-success-text)]">
            {consistencyPct}%
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(0,200px)_minmax(0,220px)]">
        <div className={`min-w-0 ${adminCardMutedClass}`}>
          <p className={`mb-3 text-[12px] font-semibold ${adminSubsectionTitleClass}`}>
            Evolução média (últimas semanas)
          </p>
          <ThemedECharts
            option={chartOption}
            style={{ height: 220, width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </div>

        <div className={`flex flex-col ${adminCardMutedClass}`}>
          <p className={`text-[12px] font-semibold ${adminSubsectionTitleClass}`}>
            Traçado · setores
          </p>
          <div className="relative mx-auto mt-4 flex flex-1 items-center justify-center py-2">
            <Image
              src="/images/tracado.svg"
              alt="Circuito"
              width={120}
              height={260}
              className="h-auto max-h-[200px] w-full object-contain opacity-90"
              unoptimized
            />
          </div>
        </div>

        <div className="space-y-4">
          <p className={`text-[12px] font-semibold ${adminSubsectionTitleClass}`}>
            Comparativo de setores
          </p>
          {telemetrySectors.map((s) => (
            <div
              key={s.sector}
              className={`rounded-xl border px-4 py-3 ${
                s.slow
                  ? "border-[var(--ds-error-border)] bg-[var(--ds-error-bg)]"
                  : `${adminStatTileClass} border-[var(--ds-border)]`
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm font-semibold ${adminTextValueClass}`}>
                  {s.sector}
                </span>
                <span
                  className={`font-mono text-sm font-bold tabular-nums ${
                    s.slow
                      ? "text-[var(--ds-error-text)]"
                      : "text-[var(--ds-success-text)]"
                  }`}
                >
                  {s.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${adminInsightPanelClass} px-5 py-4`}>
        <span className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-accent">
          Insight
        </span>
        <p className="text-[14px] leading-relaxed text-[var(--ds-text-body)]">
          {telemetryInsight}
        </p>
      </div>
    </section>
  );
}
