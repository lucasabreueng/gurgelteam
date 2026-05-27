"use client";

import type { SectorId, SectorsLapRecord } from "@/lib/contracts/telemetry/sectors";
import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

import { CHART_LIGHT, SECTION_LABEL, SECTOR_SECTION } from "./sectors-styles";

const CHART_BASE = {
  backgroundColor: "transparent",
  textStyle: { fontFamily: "inherit" },
  grid: { left: 8, right: 12, top: 28, bottom: 24, containLabel: true },
};

type TooltipParam = {
  seriesName?: string;
  data?: unknown;
  value?: unknown;
  marker?: string;
  axisValue?: string;
};

function extractNumericValue(p: TooltipParam): number {
  const raw = p.value ?? p.data;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (Array.isArray(raw) && typeof raw[1] === "number") return raw[1];
  return NaN;
}

function normalizeTooltipParams(params: unknown): TooltipParam[] {
  if (Array.isArray(params)) return params as TooltipParam[];
  if (params && typeof params === "object") return [params as TooltipParam];
  return [];
}

function axisTooltipSeconds(params: unknown): string {
  const items = normalizeTooltipParams(params);
  if (items.length === 0) return "";
  const axisValue = items[0].axisValue ?? "";
  let html = `<div style="margin-bottom:4px;font-weight:600">${String(axisValue)}</div>`;
  for (const p of items) {
    const value = extractNumericValue(p);
    const formatted = Number.isFinite(value)
      ? `${TelemetryServiceMock.formatSectorTime(value, 3)}s`
      : "—";
    const label = p.seriesName && !/^series\d+$/i.test(p.seriesName)
      ? `${p.seriesName}: `
      : "";
    html += `<div>${p.marker ?? ""}${label}${formatted}</div>`;
  }
  return html;
}

/** Linha única — exibe somente o tempo formatado. */
function singleSeriesTimeTooltip(params: unknown): string {
  const items = normalizeTooltipParams(params);
  if (items.length === 0) return "";
  const value = extractNumericValue(items[0]);
  if (!Number.isFinite(value)) return "—";
  return `${TelemetryServiceMock.formatSectorTime(value, 3)}s`;
}

/** Linha única — exibe somente o delta formatado. */
function singleSeriesDeltaTooltip(params: unknown): string {
  const items = normalizeTooltipParams(params);
  if (items.length === 0) return "";
  const value = extractNumericValue(items[0]);
  if (!Number.isFinite(value)) return "—";
  return TelemetryServiceMock.formatDelta(value);
}

type Props = {
  lapEvolution: number[];
  cumulativeDelta: number[];
  laps: SectorsLapRecord[];
};

function ChartShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className={SECTOR_SECTION}>
      <p className={SECTION_LABEL}>{title}</p>
      <div className="mt-2 h-[220px] min-h-[180px] w-full">{children}</div>
    </article>
  );
}

export function SectorsChartsSection({
  lapEvolution,
  cumulativeDelta,
  laps,
}: Props) {
  const validLaps = laps.filter((l) => !l.invalid);
  const labels = validLaps.map((l) => `V${l.lap}`);

  const evolutionOption = useMemo<EChartsOption>(
    () => ({
      ...CHART_BASE,
      tooltip: {
        trigger: "axis",
        ...CHART_LIGHT.tooltip,
        formatter: singleSeriesTimeTooltip,
      },
      xAxis: {
        type: "category",
        data: labels,
        axisLine: CHART_LIGHT.axisLine,
        axisLabel: CHART_LIGHT.axisLabel,
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        scale: true,
        splitLine: CHART_LIGHT.splitLine,
        axisLabel: {
          ...CHART_LIGHT.axisLabel,
          formatter: (v: number) => TelemetryServiceMock.formatSectorTime(v, 2),
        },
      },
      series: [
        {
          name: "Tempo",
          type: "line",
          data: lapEvolution,
          smooth: 0.35,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { width: 2.5, color: "#0d1f3c" },
          itemStyle: { color: "#0d1f3c", borderColor: "#ffffff", borderWidth: 2 },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(13,31,60,0.12)" },
                { offset: 1, color: "rgba(13,31,60,0)" },
              ],
            },
          },
        },
      ],
    }),
    [lapEvolution, labels],
  );

  const sectorOption = useMemo<EChartsOption>(
    () => ({
      ...CHART_BASE,
      legend: {
        top: 0,
        textStyle: { color: "#64748b", fontSize: 10 },
        itemWidth: 12,
        itemHeight: 8,
      },
      tooltip: {
        trigger: "axis",
        ...CHART_LIGHT.tooltip,
        formatter: axisTooltipSeconds,
      },
      xAxis: {
        type: "category",
        data: labels,
        axisLine: CHART_LIGHT.axisLine,
        axisLabel: CHART_LIGHT.axisLabel,
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        scale: true,
        splitLine: CHART_LIGHT.splitLine,
        axisLabel: CHART_LIGHT.axisLabel,
      },
      series: (["S1", "S2", "S3"] as SectorId[]).map((id, idx) => {
        const colors = ["#0d1f3c", "#2563eb", "#7c3aed"];
        const field = id.toLowerCase() as "s1" | "s2" | "s3";
        return {
          name: id,
          type: "bar",
          barMaxWidth: 14,
          data: validLaps.map((l) => l[field]),
          itemStyle: {
            color: colors[idx],
            borderRadius: [3, 3, 0, 0],
            opacity: 0.92,
          },
        };
      }),
    }),
    [validLaps, labels],
  );

  const deltaOption = useMemo<EChartsOption>(
    () => ({
      ...CHART_BASE,
      tooltip: {
        trigger: "axis",
        ...CHART_LIGHT.tooltip,
        formatter: singleSeriesDeltaTooltip,
      },
      xAxis: {
        type: "category",
        data: labels,
        axisLine: CHART_LIGHT.axisLine,
        axisLabel: CHART_LIGHT.axisLabel,
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        splitLine: CHART_LIGHT.splitLine,
        axisLabel: {
          ...CHART_LIGHT.axisLabel,
          formatter: (v: number) => `${v >= 0 ? "+" : ""}${TelemetryServiceMock.formatSectorTime(v, 2)}`,
        },
      },
      series: [
        {
          name: "Delta",
          type: "line",
          data: cumulativeDelta,
          smooth: 0.3,
          symbol: "none",
          lineStyle: { width: 2, color: "#d97706" },
          areaStyle: { color: "rgba(217,119,6,0.1)" },
        },
      ],
    }),
    [cumulativeDelta, labels],
  );

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <ChartShell title="Evolução de voltas">
        <ReactECharts
          option={evolutionOption}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </ChartShell>
      <ChartShell title="Tempos por setor">
        <ReactECharts
          option={sectorOption}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </ChartShell>
      <ChartShell title="Delta acumulado">
        <ReactECharts
          option={deltaOption}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </ChartShell>
    </section>
  );
}
