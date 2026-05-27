"use client";

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { EvolutionLapPoint } from "@/lib/contracts/student-area";

function formatAxisDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function formatTooltipSeconds(v: number) {
  return v.toFixed(3).replace(".", ",");
}

export function EvolutionTimeChart({
  data,
}: {
  data: readonly EvolutionLapPoint[];
}) {
  const option = useMemo<EChartsOption>(() => {
    const categories = data.map((d) => formatAxisDate(d.sessionDate));
    const secs = data.map((d) => d.seconds);
    const minRaw = secs.length ? Math.min(...secs) : 53;
    const maxRaw = secs.length ? Math.max(...secs) : 56;
    const pad = Math.max(0.12, (maxRaw - minRaw) * 0.15);

    return {
      tooltip: {
        trigger: "axis",
        formatter: (items: unknown) => {
          if (!Array.isArray(items) || !items.length) return "";
          const p = items[0] as {
            axisValue?: string;
            data?: number;
          };
          const t =
            typeof p.data === "number" ? formatTooltipSeconds(p.data) : "—";
          return `${String(p.axisValue ?? "")}<br/>Melhor volta: ${t}s`;
        },
      },
      grid: {
        left: 48,
        right: 16,
        top: 20,
        bottom: data.length > 5 ? 36 : 32,
        containLabel: false,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: categories,
        axisLine: { lineStyle: { color: "#cbd5e1" } },
        axisTick: { show: true, lineStyle: { color: "#cbd5e1" } },
        axisLabel: {
          show: true,
          fontSize: 10,
          color: "#64748b",
          interval: 0,
          rotate: data.length > 5 ? 22 : 0,
        },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        min: Number((minRaw - pad).toFixed(4)),
        max: Number((maxRaw + pad).toFixed(4)),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          fontSize: 10,
          color: "#64748b",
          formatter: (v: number) =>
            `${v.toFixed(2)}`.replace(".", ","),
        },
        splitLine: { show: false },
      },
      series: [
        {
          name: "Melhor volta",
          type: "line",
          smooth: 0.25,
          showSymbol: true,
          symbolSize: 8,
          lineStyle: { width: 2.75, color: "#0d1f3c" },
          itemStyle: {
            color: "#0d1f3c",
            borderColor: "#ffffff",
            borderWidth: 2,
          },
          areaStyle: {
            opacity: 0.12,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: "rgba(13,31,60,0.08)" },
                { offset: 1, color: "rgba(13,31,60,0.38)" },
              ],
            },
          },
          data: data.map((d) => d.seconds),
          emphasis: { focus: "series" },
        },
      ],
      animationDuration: 420,
    };
  }, [data]);

  if (data.length === 0) return null;

  return (
    <div className="w-full">
      <div className="mb-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          Evolução dos tempos
        </p>
        <p className="mt-0.5 text-sm text-neutral-600">
          Melhor volta por sessão (últimas {data.length} treinos)
        </p>
      </div>

      <ReactECharts
        option={option}
        style={{ height: 280, width: "100%" }}
        opts={{ renderer: "svg" }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}
