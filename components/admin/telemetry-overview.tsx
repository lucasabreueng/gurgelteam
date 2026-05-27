"use client";

import { useMemo } from "react";
import Image from "next/image";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { DashboardServiceMock } from "@/services/dashboard/dashboardServiceMock";

export function TelemetryOverview() {
  const evolutionSeries = DashboardServiceMock.getTelemetryEvolutionSeries();
  const telemetryInsight = DashboardServiceMock.getTelemetryInsight();
  const telemetrySectors = DashboardServiceMock.getTelemetrySectors();

  const chartOption = useMemo<EChartsOption>(() => {
    const cats = evolutionSeries.map((d) => d.week);
    const vals = evolutionSeries.map((d) => d.avg);
    return {
      grid: { left: 48, right: 16, top: 24, bottom: 32 },
      xAxis: {
        type: "category",
        data: cats,
        axisLine: { lineStyle: { color: "#e2e8f0" } },
        axisLabel: { fontSize: 10, color: "#64748b" },
      },
      yAxis: {
        type: "value",
        min: 52,
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.2)" } },
        axisLabel: {
          fontSize: 10,
          color: "#64748b",
          formatter: (v: number) => `${v.toFixed(1)}s`,
        },
      },
      series: [
        {
          type: "line",
          smooth: 0.35,
          data: vals,
          lineStyle: { width: 2.75, color: "#0d1f3c" },
          itemStyle: { color: "#0d1f3c" },
          areaStyle: { opacity: 0.08, color: "#0d1f3c" },
        },
      ],
      tooltip: { trigger: "axis" },
    };
  }, [evolutionSeries]);

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Performance
          </p>
          <h3 className="mt-1 text-xl font-bold text-[#0d1f3c] md:text-2xl">
            Telemetria & evolução da equipe
          </h3>
        </div>
        <div className="rounded-xl bg-[#fafbfc] px-4 py-2 text-center ring-1 ring-[rgba(17,17,17,0.06)]">
          <p className="text-[10px] font-bold uppercase text-neutral-500">
            Consistência geral
          </p>
          <p className="text-lg font-bold text-emerald-700">89%</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(0,200px)_minmax(0,220px)]">
        <div className="min-w-0 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-4">
          <p className="mb-3 text-[12px] font-semibold text-neutral-600">
            Evolução média (últimas semanas)
          </p>
          <ReactECharts
            option={chartOption}
            style={{ height: 220, width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </div>

        <div className="flex flex-col rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-4">
          <p className="text-[12px] font-semibold text-neutral-600">Traçado · setores</p>
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
          <p className="text-[12px] font-semibold text-neutral-600">
            Comparativo de setores
          </p>
          {telemetrySectors.map((s) => (
            <div
              key={s.sector}
              className={`rounded-xl border px-4 py-3 ${
                s.slow
                  ? "border-[#c41e3a]/25 bg-red-50/50"
                  : "border-[rgba(17,17,17,0.08)] bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-[#111]">{s.sector}</span>
                <span
                  className={`font-mono text-sm font-bold tabular-nums ${
                    s.slow ? "text-[#c41e3a]" : "text-emerald-700"
                  }`}
                >
                  {s.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3 rounded-xl border border-accent/15 bg-accent/[0.04] px-5 py-4">
        <span className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-accent">
          Insight
        </span>
        <p className="text-[14px] leading-relaxed text-[#0d1f3c]/90">
          {telemetryInsight}
        </p>
      </div>
    </section>
  );
}
