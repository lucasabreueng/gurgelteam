"use client";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { ClientProfileDetail } from "@/lib/contracts/clients";

type Props = {
  performance: ClientProfileDetail["performance"];
};

const chartBox =
  "rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-4";

export function PerformanceOverview({ performance }: Props) {
  const lapOption: EChartsOption = {
    grid: { left: 40, right: 16, top: 24, bottom: 28 },
    xAxis: {
      type: "category",
      data: performance.lapTrend.map((_, i) => `S${i + 1}`),
      axisLine: { lineStyle: { color: "#e5e7eb" } },
      axisLabel: { color: "#6b7280", fontSize: 10 },
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#f3f4f6" } },
      axisLabel: { color: "#6b7280", fontSize: 10 },
    },
    series: [
      {
        type: "line",
        smooth: true,
        data: performance.lapTrend,
        lineStyle: { color: "#0d1f3c", width: 2 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(13,31,60,0.2)" },
              { offset: 1, color: "rgba(13,31,60,0)" },
            ],
          },
        },
        symbol: "circle",
        symbolSize: 6,
        itemStyle: { color: "#0d1f3c" },
      },
    ],
  };

  const consistencyOption: EChartsOption = {
    grid: { left: 40, right: 16, top: 24, bottom: 28 },
    xAxis: {
      type: "category",
      data: performance.consistencyTrend.map((_, i) => `M${i + 1}`),
      axisLine: { lineStyle: { color: "#e5e7eb" } },
      axisLabel: { color: "#6b7280", fontSize: 10 },
    },
    yAxis: {
      type: "value",
      max: 100,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#f3f4f6" } },
      axisLabel: { color: "#6b7280", fontSize: 10, formatter: "{value}%" },
    },
    series: [
      {
        type: "bar",
        data: performance.consistencyTrend,
        itemStyle: {
          color: "#10b981",
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: "50%",
      },
    ],
  };

  const compareOption: EChartsOption = {
    grid: { left: 40, right: 16, top: 24, bottom: 28 },
    xAxis: {
      type: "category",
      data: performance.evolutionCompare.map((d) => d.label),
      axisLine: { lineStyle: { color: "#e5e7eb" } },
      axisLabel: { color: "#6b7280", fontSize: 10 },
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#f3f4f6" } },
      axisLabel: { color: "#6b7280", fontSize: 10 },
    },
    series: [
      {
        type: "line",
        smooth: true,
        data: performance.evolutionCompare.map((d) => d.value),
        lineStyle: { color: "#c41e3a", width: 2 },
        itemStyle: { color: "#c41e3a" },
      },
    ],
  };

  const stats = [
    { label: "Melhor volta", value: `${performance.bestLap}s` },
    { label: "Média", value: `${performance.averageLap}s` },
    { label: "Consistência", value: `${performance.consistency}%` },
    { label: "Evolução", value: `+${performance.evolutionPercent}%` },
    { label: "Frequência", value: performance.frequency },
    { label: "Ranking", value: `#${performance.rankingPosition}` },
  ];

  return (
    <section>
      <h3 className="text-lg font-bold text-[#0d1f3c]">Performance</h3>
      <p className="mt-1 text-sm text-neutral-600">
        Tempos, consistência e evolução na pista.
      </p>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <li
            key={s.label}
            className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-3 shadow-sm"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              {s.label}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-[#0d1f3c]">
              {s.value}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className={chartBox}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Evolução de volta
          </p>
          <ReactECharts
            option={lapOption}
            style={{ height: 200 }}
            opts={{ renderer: "svg" }}
          />
        </div>
        <div className={chartBox}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Consistência
          </p>
          <ReactECharts
            option={consistencyOption}
            style={{ height: 200 }}
            opts={{ renderer: "svg" }}
          />
        </div>
        <div className={`${chartBox} lg:col-span-2`}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Comparativo de evolução
          </p>
          <ReactECharts
            option={compareOption}
            style={{ height: 180 }}
            opts={{ renderer: "svg" }}
          />
        </div>
      </div>
    </section>
  );
}
