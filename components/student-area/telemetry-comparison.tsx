"use client";

import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";
import type { TelemetryTabKey } from "@/lib/contracts/student-area";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { ECharts } from "echarts";

import {
  buildHeatMapTrailForLap,
  heatMapColor,
  chartSeriesForProcessedLap,
  formatSessionDateTime,
  gpsPositionAtLapDistance,
  gpsTrailForLap,
  isValidGps,
  maxChartDistanceM,
  findBestLapListIndex,
  processedSessionLapsList,
  processedSessionStats,
  type SectorFilter,
} from "@/lib/telemetry-engine";
import {
  TelemetryGoogleMap,
  type MapTrail,
  type TelemetryGoogleMapHandle,
} from "./telemetry/telemetry-google-map";
import {
  TelemetryEChart,
  hideTelemetryChartTips,
} from "./telemetry-chart";
import { useTelemetryWorkspace } from "./telemetry/telemetry-workspace-context";
import { useTelemetryTabletLayout } from "@/lib/hooks/use-telemetry-tablet-layout";
import { useProcessedTelemetrySession } from "./telemetry/use-telemetry-session-data";
import { TelemetryEmptyState } from "./telemetry/telemetry-empty-state";
import { TELEMETRY_NO_SESSION } from "@/lib/telemetry-active-session";
import { isProcessedSessionId } from "@/lib/telemetry-engine";

type SectorTab = "full" | 1 | 2 | 3;

export function TelemetryComparison() {
  const pathname = usePathname();
  const { activeSessionId, openSessionsModal, openLoadModal } =
    useTelemetryWorkspace();
  const { tabletLandscape } = useTelemetryTabletLayout();
  const { session: processedSession, loading: sessionLoading } =
    useProcessedTelemetrySession(activeSessionId);

  if (!activeSessionId || activeSessionId === TELEMETRY_NO_SESSION) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f3f5f9]">
        <TelemetryEmptyState
          onOpenSessions={openSessionsModal}
          onOpenLoad={openLoadModal}
        />
      </div>
    );
  }

  if (isProcessedSessionId(activeSessionId) && sessionLoading) {
    return (
      <div className="flex h-full min-h-0 flex-col items-center justify-center bg-[#f3f5f9]">
        <p className="text-sm font-medium text-neutral-600">Carregando sessão…</p>
      </div>
    );
  }

  if (!processedSession) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f3f5f9]">
        <TelemetryEmptyState
          onOpenSessions={openSessionsModal}
          onOpenLoad={openLoadModal}
        />
      </div>
    );
  }

  return (
    <TelemetryComparisonContent
      pathname={pathname}
      tabletLandscape={tabletLandscape}
      processedSession={processedSession}
    />
  );
}

function TelemetryComparisonContent({
  pathname,
  tabletLandscape,
  processedSession,
}: {
  pathname: string;
  tabletLandscape: boolean;
  processedSession: NonNullable<
    ReturnType<typeof useProcessedTelemetrySession>["session"]
  >;
}) {
  const { heatMapEnabled, setHeatMapEnabled } = useTelemetryWorkspace();
  const [hoveredHeatMapMetric, setHoveredHeatMapMetric] =
    useState<TelemetryTabKey>("velocidade");

  const sessionLaps = useMemo(
    () => processedSessionLapsList(processedSession),
    [processedSession],
  );

  const bestLapIndex = useMemo(
    () => findBestLapListIndex(processedSession, sessionLaps),
    [processedSession, sessionLaps],
  );

  const stats = useMemo(
    () => processedSessionStats(processedSession),
    [processedSession],
  );

  const [selectedLapIndices, setSelectedLapIndices] = useState<number[]>(() => [
    findBestLapListIndex(processedSession, sessionLaps),
  ]);
  const [sectorTab, setSectorTab] = useState<SectorTab>("full");
  const mapRef = useRef<TelemetryGoogleMapHandle>(null);
  const hoverRafRef = useRef<number | null>(null);
  const pendingDistanceRef = useRef<number | null>(null);

  const activeHeatMapMetric =
    heatMapEnabled && selectedLapIndices.length === 1
      ? hoveredHeatMapMetric
      : null;

  const sectorFilter: SectorFilter =
    sectorTab === "full" ? null : sectorTab;

  const selectedLapNumbers = useMemo(
    () =>
      selectedLapIndices
        .map((idx) => sessionLaps[idx]?.lap)
        .filter((n): n is number => n != null),
    [selectedLapIndices, sessionLaps],
  );

  const chartDistanceLengthM = useMemo(
    () => maxChartDistanceM(processedSession, selectedLapNumbers, sectorFilter),
    [processedSession, sectorFilter, selectedLapNumbers],
  );

  const mapTrails = useMemo((): MapTrail[] => {
    if (!processedSession) return [];
    const out: MapTrail[] = [];
    const heatActive = activeHeatMapMetric != null;

    for (const [colorIdx, lapIdx] of selectedLapIndices.entries()) {
      const lapRow = sessionLaps[lapIdx];
      if (!lapRow) continue;

      if (heatActive && lapIdx === selectedLapIndices[0] && activeHeatMapMetric) {
        const heat = buildHeatMapTrailForLap(
          processedSession,
          lapRow.lap,
          activeHeatMapMetric,
        );
        if (heat) {
          out.push({
            id: `lap-${lapRow.lap}`,
            path: heat.segments.flatMap((s) => s.path),
            color: heatMapColor(0.5),
            heatSegments: heat.segments,
            strokeWeight: 6,
          });
          continue;
        }
      }

      const path = gpsTrailForLap(processedSession, lapRow.lap).map((p) => ({
        lat: p.latitude,
        lng: p.longitude,
      }));
      if (path.length === 0) continue;
      out.push({
        id: `lap-${lapRow.lap}`,
        path,
        color: TelemetryServiceMock.getTelemetryLapColors()[colorIdx % TelemetryServiceMock.getTelemetryLapColors().length],
      });
    }
    return out;
  }, [processedSession, selectedLapIndices, sessionLaps, activeHeatMapMetric]);

  const updateMapHoverMarkers = useCallback(
    (distanceM: number) => {
      if (!processedSession) return;
      const markers = selectedLapIndices
        .map((lapIdx, colorIdx) => {
          const lapRow = sessionLaps[lapIdx];
          if (!lapRow) return null;
          const pos = gpsPositionAtLapDistance(
            processedSession,
            lapRow.lap,
            distanceM,
            chartDistanceLengthM,
            sectorFilter,
          );
          if (!pos) return null;
          return {
            id: `hover-lap-${lapRow.lap}`,
            position: { lat: pos.latitude, lng: pos.longitude },
            color: TelemetryServiceMock.getTelemetryLapColors()[colorIdx % TelemetryServiceMock.getTelemetryLapColors().length],
            scale: 9,
          };
        })
        .filter((m): m is NonNullable<typeof m> => m != null);
      mapRef.current?.setHoverMarkers(markers);
    },
    [
      processedSession,
      selectedLapIndices,
      sessionLaps,
      chartDistanceLengthM,
      sectorFilter,
    ],
  );

  const handleAxisPointerDistance = useCallback(
    (distanceM: number | null) => {
      if (distanceM == null) return;
      pendingDistanceRef.current = distanceM;
      if (hoverRafRef.current != null) return;
      hoverRafRef.current = requestAnimationFrame(() => {
        hoverRafRef.current = null;
        const d = pendingDistanceRef.current;
        if (d == null) return;
        updateMapHoverMarkers(d);
      });
    },
    [updateMapHoverMarkers],
  );

  const toggleLap = (index: number) => {
    mapRef.current?.setHoverMarkers([]);
    setSelectedLapIndices((prev) => {
      if (prev.includes(index)) {
        if (prev.length <= 1) return prev;
        return prev.filter((i) => i !== index);
      }
      return [...prev, index].sort((a, b) => a - b);
    });
  };

  useEffect(() => {
    setSelectedLapIndices([bestLapIndex]);
  }, [processedSession.id, bestLapIndex]);

  useEffect(() => {
    if (heatMapEnabled && selectedLapIndices.length !== 1) {
      setHeatMapEnabled(false);
    }
  }, [heatMapEnabled, selectedLapIndices, setHeatMapEnabled]);

  const heatMapLegend = useMemo(() => {
    if (!activeHeatMapMetric || selectedLapIndices.length !== 1) return null;
    const lapRow = sessionLaps[selectedLapIndices[0]];
    if (!lapRow) return null;
    const heat = buildHeatMapTrailForLap(
      processedSession,
      lapRow.lap,
      activeHeatMapMetric,
    );
    if (!heat) return null;
    const metricLabel = TelemetryServiceMock.getTelemetryChartMetrics().find(
      (m) => m.key === activeHeatMapMetric,
    )?.label;
    return { ...heat, label: metricLabel ?? activeHeatMapMetric };
  }, [activeHeatMapMetric, selectedLapIndices, sessionLaps, processedSession]);

  useEffect(() => {
    return () => {
      if (hoverRafRef.current != null) cancelAnimationFrame(hoverRafRef.current);
    };
  }, []);

  const mapLines = useMemo(() => {
    if (!processedSession?.appliedLines) return [];
    const applied = processedSession.appliedLines;
    return [
      {
        id: "sf",
        line: applied.startFinishLine,
        color: "#fbbf24",
        dashed: true,
      },
      ...applied.sectors.map((s, i) => ({
        id: `s${s.sector}`,
        line: s.endLine,
        color: i === 0 ? "#60a5fa" : i === 1 ? "#a78bfa" : "#f472b6",
        dashed: false,
      })),
    ];
  }, [processedSession]);

  const mapCenter = useMemo(() => {
    for (const trail of mapTrails) {
      const first = trail.path[0];
      if (first && isValidGps(first.lat, first.lng)) return first;
    }
    const pt = processedSession.points.find((p) =>
      isValidGps(p.latitude, p.longitude),
    );
    if (pt) return { lat: pt.latitude, lng: pt.longitude };
    return { lat: 0, lng: 0 };
  }, [mapTrails, processedSession]);

  const chartInstancesRef = useRef<ECharts[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const hideAllChartTips = useCallback(() => {
    hideTelemetryChartTips();
  }, []);

  const resizeAllCharts = useCallback(() => {
    for (const chart of chartInstancesRef.current) {
      if (!chart.isDisposed()) chart.resize();
    }
  }, []);

  const registerChart = useCallback((chart: ECharts) => {
    chartInstancesRef.current = chartInstancesRef.current.filter(
      (c) => !c.isDisposed(),
    );
    if (!chartInstancesRef.current.includes(chart)) {
      chartInstancesRef.current.push(chart);
    }
  }, []);

  useEffect(() => {
    return () => {
      chartInstancesRef.current = [];
    };
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(resizeAllCharts);
    });
    ro.observe(el);
    requestAnimationFrame(resizeAllCharts);

    return () => ro.disconnect();
  }, [resizeAllCharts, tabletLandscape, pathname]);

  useEffect(() => {
    const t1 = requestAnimationFrame(resizeAllCharts);
    const t2 = window.setTimeout(resizeAllCharts, 120);
    const t3 = window.setTimeout(resizeAllCharts, 400);
    return () => {
      cancelAnimationFrame(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [pathname, tabletLandscape, resizeAllCharts]);

  const lapLinesByMetric = useMemo(() => {
    return TelemetryServiceMock.getTelemetryChartMetrics().map((metric) => {
      const lines = selectedLapIndices.map((lapIdx, colorIdx) => {
        const lapRow = sessionLaps[lapIdx];
        const data = lapRow
          ? chartSeriesForProcessedLap(
              processedSession,
              lapRow.lap,
              metric.key,
              chartDistanceLengthM,
              sectorFilter,
            )
          : [];
        return {
          name: `V${lapRow?.lap ?? lapIdx + 1}`,
          color:
            TelemetryServiceMock.getTelemetryLapColors()[colorIdx % TelemetryServiceMock.getTelemetryLapColors().length],
          data,
        };
      });
      const yExtent = computeYExtent(metric.key, lines.map((l) => l.data), selectedLapIndices);
      return { metric, lines, yExtent };
    });
  }, [selectedLapIndices, processedSession, sessionLaps, chartDistanceLengthM, sectorFilter]);

  return (
    <div
      ref={gridRef}
      className={`telemetry-comparison-grid grid h-full min-h-0 ${
        tabletLandscape
          ? "grid-cols-[minmax(0,152px)_minmax(0,1fr)_minmax(240px,300px)]"
          : "grid-cols-1 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)_minmax(0,560px)]"
      }`}
    >
        {/* Coluna esquerda — voltas */}
        <aside className="flex min-h-0 flex-col border-r border-[rgba(17,17,17,0.08)] bg-white">
          <div className="shrink-0 border-b border-[rgba(17,17,17,0.08)] px-3 py-2">
            <dl className="space-y-2">
              {[
                { label: "Melhor volta", value: `${stats.bestLap}s` },
                {
                  label: "Melhor teórica",
                  value: `${stats.bestTheoretical}s`,
                },
                { label: "Média", value: `${stats.average}s` },
                {
                  label: "Consistência",
                  value: stats.consistency,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-2"
                >
                  <dt className="text-[10px] uppercase tracking-wide text-neutral-500">
                    {row.label}
                  </dt>
                  <dd className="font-mono text-[13px] font-bold text-accent">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <ul
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2"
            role="list"
          >
            {sessionLaps.map((row, index) => {
              const selected = selectedLapIndices.includes(index);
              const isBestLap = index === bestLapIndex;
              const colorIdx = selectedLapIndices.indexOf(index);
              const color =
                selected && colorIdx >= 0
                  ? TelemetryServiceMock.getTelemetryLapColors()[
                      colorIdx % TelemetryServiceMock.getTelemetryLapColors().length
                    ]
                  : undefined;
              return (
                <li key={row.lap} className="mb-1">
                  <button
                    type="button"
                    onClick={() => toggleLap(index)}
                    className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${
                      selected
                        ? isBestLap
                          ? "border-amber-400/60 bg-amber-50/80"
                          : "border-[rgba(17,17,17,0.12)] bg-neutral-50"
                        : isBestLap
                          ? "border-amber-300/50 bg-amber-50/40 hover:bg-amber-50/70"
                          : "border-transparent bg-transparent hover:bg-neutral-50"
                    }`}
                  >
                    <span
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded border"
                      style={{
                        borderColor: selected
                          ? color
                          : isBestLap
                            ? "#f59e0b"
                            : "rgba(17,17,17,0.2)",
                        backgroundColor: selected ? color : "transparent",
                      }}
                      aria-hidden
                    >
                      {selected ? (
                        <svg
                          viewBox="0 0 12 12"
                          className="h-2.5 w-2.5 text-white"
                          fill="currentColor"
                        >
                          <path d="M10.2 2.4 4.8 8.4 1.8 5.4l1.2-1.2 1.8 1.8 6-6 1.2 1.2Z" />
                        </svg>
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`text-[12px] font-semibold ${
                            isBestLap ? "text-amber-900" : "text-neutral-800"
                          }`}
                        >
                          V{row.lap}
                        </span>
                        {isBestLap ? (
                          <span className="rounded bg-amber-500/15 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
                            Melhor
                          </span>
                        ) : null}
                      </span>
                    </span>
                    <span
                      className="font-mono text-[12px] font-bold tabular-nums"
                      style={{
                        color: selected
                          ? color
                          : isBestLap
                            ? "#b45309"
                            : "rgb(82,82,82)",
                      }}
                    >
                      {row.timeLabel}s
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Coluna central — 5 gráficos */}
        <div className="flex min-h-0 min-w-0 flex-col bg-[#f3f5f9]">
          <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-b border-[rgba(17,17,17,0.08)] bg-white px-3 py-2">
            {selectedLapIndices.map((lapIdx, colorIdx) => {
              const lap = sessionLaps[lapIdx];
              const color =
                TelemetryServiceMock.getTelemetryLapColors()[colorIdx % TelemetryServiceMock.getTelemetryLapColors().length];
              return (
                <span
                  key={lap.lap}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-700"
                >
                  <span
                    className="inline-block h-0.5 w-5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  V{lap.lap} ({lap.timeLabel}s)
                </span>
              );
            })}
          </div>
          <div
            className="flex min-h-0 flex-1 flex-col gap-1 p-1.5 pb-0"
            onMouseLeave={hideAllChartTips}
          >
            {lapLinesByMetric.map(({ metric, lines, yExtent }) => (
              <div
                key={metric.key}
                className={`flex min-h-0 flex-1 flex-col rounded-md border bg-white px-2 py-1 transition ${
                  heatMapEnabled && hoveredHeatMapMetric === metric.key
                    ? "border-accent/35 ring-1 ring-accent/20"
                    : "border-[rgba(17,17,17,0.06)]"
                }`}
                onMouseEnter={() => setHoveredHeatMapMetric(metric.key)}
              >
                <p className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  {metric.label}
                </p>
                <div className="min-h-0 flex-1">
                  <TelemetryEChart
                    telemetryTab={metric.key}
                    lapSeries={lines}
                    yExtent={yExtent}
                    chartHeight="100%"
                    compact
                    distanceLengthM={chartDistanceLengthM}
                    onChartReady={registerChart}
                    onAxisPointerDistance={handleAxisPointerDistance}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="shrink-0 border-t border-[rgba(17,17,17,0.08)] bg-white p-2">
            <div className="grid grid-cols-4 gap-1">
              {(
                [
                  { id: "full" as const, label: "Volta completa" },
                  { id: 1 as const, label: "S1" },
                  { id: 2 as const, label: "S2" },
                  { id: 3 as const, label: "S3" },
                ] as const
              ).map((tab) => {
                const active = sectorTab === tab.id;
                return (
                  <button
                    key={String(tab.id)}
                    type="button"
                    onClick={() => {
                      setSectorTab(tab.id);
                      mapRef.current?.setHoverMarkers([]);
                    }}
                    className={`w-full rounded-lg px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
                      active
                        ? "bg-[#0d1f3c] text-white ring-1 ring-[#0d1f3c]/30"
                        : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coluna direita — mapa */}
        <aside className="flex min-h-0 flex-col border-l border-[rgba(17,17,17,0.08)] bg-white">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[rgba(17,17,17,0.08)] px-3 py-2">
            <p className="min-w-0 truncate text-[12px] font-semibold text-[#0d1f3c]">
              {processedSession.trackName}
            </p>
            <p className="shrink-0 font-mono text-[11px] tabular-nums text-neutral-500">
              {formatSessionDateTime(processedSession.createdAt)}
            </p>
          </div>
          <div className="relative min-h-0 flex-1 p-2">
            {heatMapLegend ? (
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 rounded-xl border border-[rgba(17,17,17,0.1)] bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  {heatMapLegend.label}
                </p>
                <div
                  className="mt-1.5 h-2 w-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(to right, hsl(240, 88%, 46%), hsl(120, 88%, 46%), hsl(0, 88%, 46%))",
                  }}
                />
                <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums text-neutral-600">
                  <span>{formatHeatMapValue(heatMapLegend.min, activeHeatMapMetric!)}</span>
                  <span>{formatHeatMapValue(heatMapLegend.max, activeHeatMapMetric!)}</span>
                </div>
              </div>
            ) : null}
            <TelemetryGoogleMap
              ref={mapRef}
              trails={mapTrails}
              lines={mapLines}
              center={mapCenter}
              fill
              mapType="satellite"
              className="rounded-xl border border-[rgba(17,17,17,0.08)]"
            />
          </div>
        </aside>
    </div>
  );
}

function formatHeatMapValue(value: number, metric: TelemetryTabKey): string {
  if (metric === "rpm") return `${Math.round(value)}`;
  if (metric === "velocidade") return `${value.toFixed(1)} km/h`;
  if (metric === "giro") return `${value.toFixed(1)}°/s`;
  return `${value.toFixed(2)} m/s²`;
}

function computeYExtent(
  tab: TelemetryTabKey,
  seriesList: number[][],
  lapIndices: number[],
) {
  if (seriesList.every((s) => s.some((v) => v !== 0))) {
    const flat = seriesList.flat();
    const min = Math.min(...flat);
    const max = Math.max(...flat);
    const pad = (max - min) * 0.06 || 1;
    return { min: min - pad, max: max + pad };
  }
  return TelemetryServiceMock.telemetryYExtentForLaps(tab, lapIndices);
}
