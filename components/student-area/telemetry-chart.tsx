"use client";

import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";
import type { TelemetryTabKey } from "@/lib/contracts/student-area";

import { useMemo, useRef, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import type { ECharts, EChartsOption } from "echarts";


const X_LABEL_INTERVAL_M = 100;

/** Ignora eventos gerados por dispatchAction em gráficos sincronizados. */
let isExternalChartSync = false;

const telemetryChartPools = new Map<string, Set<ECharts>>();

function getChartPool(group: string): Set<ECharts> {
  let pool = telemetryChartPools.get(group);
  if (!pool) {
    pool = new Set();
    telemetryChartPools.set(group, pool);
  }
  return pool;
}

function pruneChartPool(group: string) {
  const pool = getChartPool(group);
  for (const chart of pool) {
    if (chart.isDisposed()) pool.delete(chart);
  }
}

function addToChartPool(group: string, chart: ECharts) {
  pruneChartPool(group);
  getChartPool(group).add(chart);
}

function removeFromChartPool(group: string, chart: ECharts) {
  getChartPool(group).delete(chart);
}

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

function tooltipPositionNearPoint(
  pos: number[],
  _params: unknown,
  _dom: unknown,
  _rect: unknown,
  size: { contentSize: number[]; viewSize: number[] },
): [number, number] {
  const [x, y] = pos;
  const [boxW, boxH] = size.contentSize;
  const viewW = size.viewSize[0];
  let left = x - boxW / 2;
  left = Math.max(8, Math.min(left, viewW - boxW - 8));
  const above = y - boxH - 10;
  const top = above < 4 ? y + 12 : above;
  return [left, top];
}

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
}: Props) {
  const registeredRef = useRef(false);
  const chartRef = useRef<ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const pointerCbRef = useRef(onAxisPointerDistance);
  const chartGroupRef = useRef(chartGroup);
  const distanceLengthRef = useRef(distanceLengthM);
  const pointerCleanupRef = useRef<(() => void) | null>(null);

  pointerCbRef.current = onAxisPointerDistance;
  chartGroupRef.current = chartGroup;
  distanceLengthRef.current = distanceLengthM;

  const resolveDataIndex = (chart: ECharts, offsetX: number, offsetY: number) => {
    const raw = chart.convertFromPixel(
      { xAxisIndex: 0, yAxisIndex: 0 },
      [offsetX, offsetY],
    );
    const idx = Array.isArray(raw) ? raw[0] : raw;
    if (typeof idx !== "number" || !Number.isFinite(idx)) return null;
    const max = distanceLengthRef.current;
    return Math.max(0, Math.min(max, Math.round(idx)));
  };

  const showPointerAt = (
    chart: ECharts,
    dataIndex: number,
    mousePixel?: [number, number],
  ) => {
    const pixel = mousePixel ?? pointerPixelForIndex(chart, dataIndex);
    if (!pixel) return;
    const [x, y] = pixel;
    chart.dispatchAction({
      type: "updateAxisPointer",
      currTrigger: "mousemove",
      x,
      y,
    });
    chart.dispatchAction({
      type: "showTip",
      currTrigger: "mousemove",
      x,
      y,
    });
  };

  const syncPeerCharts = (chart: ECharts, dataIndex: number) => {
    const group = chartGroupRef.current;
    pruneChartPool(group);
    const peers = [...getChartPool(group)].filter((c) => c !== chart);
    syncTelemetryChartsToIndex(peers, dataIndex);
  };

  const attachPointerListener = (chart: ECharts) => {
    pointerCleanupRef.current?.();
    pointerCleanupRef.current = null;

    const zr = chart.getZr();

    const handleZrMove = (event: { offsetX?: number; offsetY?: number }) => {
      if (isExternalChartSync) return;
      const x = event.offsetX;
      const y = event.offsetY;
      if (x == null || y == null) return;
      if (!chart.containPixel({ gridIndex: 0 }, [x, y])) return;

      const dataIndex = resolveDataIndex(chart, x, y);
      if (dataIndex == null) return;

      showPointerAt(chart, dataIndex, [x, y]);
      syncPeerCharts(chart, dataIndex);

      const cb = pointerCbRef.current;
      if (cb) cb(dataIndex);
    };

    zr.on("mousemove", handleZrMove);

    pointerCleanupRef.current = () => {
      zr.off("mousemove", handleZrMove);
    };
  };

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
        position: tooltipPositionNearPoint,
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
          focus: "none",
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
    addToChartPool(chartGroup, instance);
    attachPointerListener(instance);

    resizeObserverRef.current?.disconnect();
    const host = instance.getDom().parentElement;
    if (host) {
      const ro = new ResizeObserver(() => {
        if (!instance.isDisposed()) instance.resize();
      });
      ro.observe(host);
      resizeObserverRef.current = ro;
      requestAnimationFrame(() => {
        if (!instance.isDisposed()) instance.resize();
      });
    }

    if (!registeredRef.current) {
      registeredRef.current = true;
      onChartReady?.(instance);
    }
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (chart && !chart.isDisposed()) {
      chart.group = chartGroup;
      addToChartPool(chartGroup, chart);
      attachPointerListener(chart);
    }
    return () => {
      pointerCleanupRef.current?.();
      pointerCleanupRef.current = null;
    };
  }, [option, chartGroup]);

  useEffect(() => {
    return () => {
      registeredRef.current = false;
      const chart = chartRef.current;
      if (chart && !chart.isDisposed()) {
        removeFromChartPool(chartGroup, chart);
      }
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, [chartGroup]);

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
      onChartReady={handleChartReady}
    />
  );
}

function pointerPixelForIndex(chart: ECharts, dataIndex: number): [number, number] | null {
  const option = chart.getOption();
  const seriesList = (option.series ?? []) as Array<{ data?: (number | null)[] }>;

  let sumX = 0;
  let sumY = 0;
  let count = 0;

  for (let i = 0; i < seriesList.length; i++) {
    const pt = chart.convertToPixel({ seriesIndex: i }, dataIndex);
    if (!pt || !Array.isArray(pt)) continue;
    const [px, py] = pt;
    if (
      typeof px === "number" &&
      Number.isFinite(px) &&
      typeof py === "number" &&
      Number.isFinite(py)
    ) {
      sumX += px;
      sumY += py;
      count++;
    }
  }

  if (count > 0) {
    return [sumX / count, sumY / count];
  }

  // Fallback: só eixo X
  let xRaw = chart.convertToPixel({ xAxisIndex: 0 }, dataIndex);
  if (!Number.isFinite(xRaw as number)) {
    xRaw = chart.convertToPixel({ xAxisIndex: 0 }, String(dataIndex));
  }
  const x = Array.isArray(xRaw) ? xRaw[0] : xRaw;
  if (typeof x !== "number" || !Number.isFinite(x)) return null;

  const firstVal = seriesList[0]?.data?.[dataIndex];
  if (typeof firstVal === "number" && Number.isFinite(firstVal)) {
    const pt = chart.convertToPixel(
      { xAxisIndex: 0, yAxisIndex: 0 },
      [dataIndex, firstVal],
    );
    if (Array.isArray(pt) && Number.isFinite(pt[1])) {
      return [x, pt[1] as number];
    }
  }

  return null;
}

export function syncTelemetryChartsToIndex(
  charts: ECharts[],
  dataIndex: number,
) {
  isExternalChartSync = true;
  try {
    for (const chart of charts) {
      if (chart.isDisposed()) continue;
      const pixel = pointerPixelForIndex(chart, dataIndex);
      if (!pixel) continue;
      const [x, y] = pixel;
      chart.dispatchAction({
        type: "updateAxisPointer",
        currTrigger: "mousemove",
        x,
        y,
      });
      chart.dispatchAction({
        type: "showTip",
        currTrigger: "mousemove",
        x,
        y,
      });
    }
  } finally {
    requestAnimationFrame(() => {
      isExternalChartSync = false;
    });
  }
}

export function hideTelemetryChartTips(
  charts?: ECharts[],
  group = TelemetryServiceMock.getTelemetryChartGroup(),
) {
  const targets =
    charts ?? [...getChartPool(group)].filter((c) => !c.isDisposed());
  for (const chart of targets) {
    if (chart.isDisposed()) continue;
    chart.dispatchAction({ type: "hideTip" });
    chart.dispatchAction({ type: "updateAxisPointer", currTrigger: "leave" });
  }
}
