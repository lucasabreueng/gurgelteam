"use client";

import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";
import type { TelemetryTabKey } from "@/lib/contracts/student-area";

import { useMemo, useRef, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import type { ECharts, EChartsOption } from "echarts";
import * as echarts from "echarts";


const X_LABEL_INTERVAL_M = 100;

export type TelemetryLapLine = {
  name: string;
  color: string;
  data: number[];
};

const AXIS_POINTER_LINE = {
  type: "line" as const,
  snap: true,
  animation: false,
  lineStyle: {
    color: "rgba(13, 31, 60, 0.45)",
    type: "dashed" as const,
    width: 1,
    dashOffset: 4,
  },
  label: { show: false },
};

type Props = {
  telemetryTab: TelemetryTabKey;
  series?: { yours: number[]; reference: number[] };
  lapSeries?: TelemetryLapLine[];
  chartHeight?: number | string;
  yExtent?: { min: number; max: number };
  compact?: boolean;
  chartGroup?: string;
  onChartReady?: (chart: ECharts) => void;
  /** Distância em metros (eixo X) sob o cursor — para sincronizar com o mapa. */
  onAxisPointerDistance?: (distanceM: number | null) => void;
  /** Comprimento do eixo X em metros (volta completa ou setor). */
  distanceLengthM?: number;
  /** Se true, este gráfico emite eventos de cursor (evita duplicatas). */
  syncPointer?: boolean;
};

export function TelemetryEChart({
  telemetryTab,
  series: seriesOverride,
  lapSeries,
  chartHeight = "100%",
  yExtent,
  compact = false,
  chartGroup = TelemetryServiceMock.getTelemetryChartGroup(),
  onChartReady,
  onAxisPointerDistance,
  distanceLengthM = TelemetryServiceMock.getTelemetryTrackLengthM(),
  syncPointer = false,
}: Props) {
  const registeredRef = useRef(false);
  const chartRef = useRef<ECharts | null>(null);
  const pointerCbRef = useRef(onAxisPointerDistance);
  const pointerCleanupRef = useRef<(() => void) | null>(null);

  pointerCbRef.current = onAxisPointerDistance;

  const attachPointerListeners = (chart: ECharts) => {
    pointerCleanupRef.current?.();
    pointerCleanupRef.current = null;
    if (!syncPointer || !pointerCbRef.current) return;

    const handlePointer = (event: unknown) => {
      const cb = pointerCbRef.current;
      if (!cb) return;
      const axesInfo = (event as { axesInfo?: { value?: string | number }[] })
        .axesInfo;
      const raw = axesInfo?.[0]?.value;
      if (raw == null) return;
      const dist =
        typeof raw === "number" ? raw : Number.parseInt(String(raw), 10);
      if (Number.isFinite(dist)) cb(dist);
    };

    chart.on("updateAxisPointer", handlePointer);
    pointerCleanupRef.current = () => {
      chart.off("updateAxisPointer", handlePointer);
    };
  };

  useEffect(() => {
    if (chartRef.current) attachPointerListeners(chartRef.current);
    return () => {
      pointerCleanupRef.current?.();
      pointerCleanupRef.current = null;
    };
  }, [onAxisPointerDistance, syncPointer]);

  const option = useMemo<EChartsOption>(() => {
    const yMeta = TelemetryServiceMock.getTelemetryYAxis()[telemetryTab];
    const distLabels = Array.from({ length: distanceLengthM + 1 }, (_, i) =>
      String(i),
    );

    const lines: TelemetryLapLine[] =
      lapSeries && lapSeries.length > 0
        ? lapSeries
        : seriesOverride
          ? [
              {
                name: "Sua volta",
                color: "#0d1f3c",
                data: seriesOverride.yours,
              },
              {
                name: "Referência",
                color: "#64748b",
                data: seriesOverride.reference,
              },
            ]
          : [
              {
                name: "Sua volta",
                color: "#0d1f3c",
                data: TelemetryServiceMock.getTelemetryChartByTab()[telemetryTab].yours,
              },
              {
                name: "Referência",
                color: "#64748b",
                data: TelemetryServiceMock.getTelemetryChartByTab()[telemetryTab].reference,
              },
            ];

    const units =
      telemetryTab === "rpm"
        ? " rpm"
        : telemetryTab === "velocidade"
          ? " km/h"
          : telemetryTab === "giro"
            ? " °/s"
            : " m/s²";

    return {
      axisPointer: AXIS_POINTER_LINE,
      tooltip: {
        trigger: "axis",
        confine: true,
        triggerOn: "mousemove|click",
        axisPointer: AXIS_POINTER_LINE,
        formatter: (items: unknown) => {
          if (!Array.isArray(items) || !items.length) return "";
          let html = `<div style="margin-bottom:2px;font-weight:600">${String((items[0] as { axisValue?: string }).axisValue ?? "")}</div>`;
          for (const raw of items) {
            const p = raw as {
              seriesName?: string;
              data?: number;
              color?: string;
            };
            const dataVal =
              typeof p.data === "number" && Number.isFinite(p.data)
                ? p.data
                : NaN;
            const formatted = Number.isFinite(dataVal)
              ? telemetryTab === "rpm" ||
                telemetryTab === "velocidade" ||
                telemetryTab === "giro"
                ? Math.round(dataVal).toLocaleString("pt-BR")
                : yMeta.formatter(dataVal)
              : "—";
            const colorDot = `<span style="display:inline-block;width:8px;height:8px;margin-right:6px;border-radius:50%;background:${p.color ?? "#999"};"></span>`;
            html += `<div>${colorDot}${p.seriesName ?? ""}: ${formatted}${units}</div>`;
          }
          return html;
        },
      },
      legend: { show: false },
      grid: {
        left: 4,
        right: 8,
        top: compact ? 6 : 12,
        bottom: compact ? 22 : 32,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: distLabels,
        name: compact ? undefined : "Distância na volta",
        nameLocation: "middle",
        nameGap: 22,
        nameTextStyle: { fontSize: 10, color: "#64748b" },
        axisLine: { lineStyle: { color: "#e2e8f0" } },
        axisLabel: {
          fontSize: 9,
          color: "#64748b",
          interval: (index: number) =>
            index % X_LABEL_INTERVAL_M === 0 || index === distanceLengthM,
          formatter: (value: string) => `${value} m`,
        },
        axisTick: { show: false },
        axisPointer: {
          show: true,
          snap: true,
          lineStyle: AXIS_POINTER_LINE.lineStyle,
        },
      },
      yAxis: {
        type: "value",
        name: compact ? undefined : yMeta.name,
        nameLocation: "middle",
        nameGap: 40,
        nameRotate: 90,
        nameTextStyle: { fontSize: 10, color: "#64748b" },
        min: yExtent?.min,
        max: yExtent?.max,
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.18)" } },
        axisLabel: {
          fontSize: 9,
          color: "#64748b",
          formatter: (v: number) => yMeta.formatter(v),
        },
        scale: !yExtent,
        axisPointer: { show: false },
      },
      series: lines.map((line) => ({
        name: line.name,
        type: "line",
        smooth: 0.2,
        showSymbol: false,
        symbol: "circle",
        symbolSize: 4,
        lineStyle: { width: 2, color: line.color },
        itemStyle: { color: line.color },
        emphasis: {
          focus: "series",
          scale: false,
        },
        data: [...line.data],
      })),
      animationDuration: 280,
    };
  }, [telemetryTab, seriesOverride, lapSeries, yExtent, compact, distanceLengthM]);

  const handleChartReady = (instance: ECharts) => {
    chartRef.current = instance;
    instance.group = chartGroup;
    attachPointerListeners(instance);
    if (!registeredRef.current) {
      registeredRef.current = true;
      onChartReady?.(instance);
    }
  };

  return (
    <ReactECharts
      option={option}
      style={{
        height: chartHeight,
        width: "100%",
        minHeight: compact ? 72 : 120,
      }}
      opts={{ renderer: "svg" }}
      notMerge
      lazyUpdate
      onChartReady={handleChartReady}
    />
  );
}

/** Conecta instâncias para cursor vertical sincronizado */
export function connectTelemetryCharts(group = TelemetryServiceMock.getTelemetryChartGroup()) {
  echarts.connect(group);
}

export function disconnectTelemetryCharts(group = TelemetryServiceMock.getTelemetryChartGroup()) {
  echarts.disconnect(group);
}
