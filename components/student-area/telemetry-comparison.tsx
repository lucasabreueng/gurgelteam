"use client";

import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";
import type { TelemetryTabKey } from "@/lib/contracts/student-area";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ECharts } from "echarts";

import {
  chartSeriesForProcessedLap,
  formatSessionDateTime,
  gpsPositionAtLapDistance,
  gpsTrailForLap,
  isValidGps,
  maxSectorLengthM,
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
  connectTelemetryCharts,
  disconnectTelemetryCharts,
} from "./telemetry-chart";
import { useTelemetryWorkspace } from "./telemetry/telemetry-workspace-context";
import { useProcessedTelemetrySession } from "./telemetry/use-telemetry-session-data";

const EXPECTED_CHART_COUNT = TelemetryServiceMock.getTelemetryChartMetrics().length;

type SectorTab = "full" | 1 | 2 | 3;

export function TelemetryComparison() {
  const { activeSessionId } = useTelemetryWorkspace();
  const { session: processedSession } =
    useProcessedTelemetrySession(activeSessionId);

  const sessionLaps = useMemo(() => {
    if (processedSession) return processedSessionLapsList(processedSession);
    return TelemetryServiceMock.getTelemetrySessionLaps().map((l) => ({
      lap: l.lap,
      timeLabel: l.timeLabel,
      invalid: false,
    }));
  }, [processedSession]);

  const stats = useMemo(() => {
    if (processedSession) return processedSessionStats(processedSession);
    return TelemetryServiceMock.getTelemetryStats();
  }, [processedSession]);

  const [selectedLapIndices, setSelectedLapIndices] = useState<number[]>([0, 1]);
  const [sectorTab, setSectorTab] = useState<SectorTab>("full");
  const mapRef = useRef<TelemetryGoogleMapHandle>(null);
  const hoverRafRef = useRef<number | null>(null);
  const pendingDistanceRef = useRef<number | null>(null);

  const sectorFilter: SectorFilter =
    sectorTab === "full" ? null : sectorTab;

  const selectedLapNumbers = useMemo(
    () =>
      selectedLapIndices
        .map((idx) => sessionLaps[idx]?.lap)
        .filter((n): n is number => n != null),
    [selectedLapIndices, sessionLaps],
  );

  const chartDistanceLengthM = useMemo(() => {
    if (!processedSession || sectorFilter == null) {
      return TelemetryServiceMock.getTelemetryTrackLengthM();
    }
    return maxSectorLengthM(processedSession, selectedLapNumbers, sectorFilter);
  }, [processedSession, sectorFilter, selectedLapNumbers]);

  const mapTrails = useMemo((): MapTrail[] => {
    if (!processedSession) return [];
    const out: MapTrail[] = [];
    for (const [colorIdx, lapIdx] of selectedLapIndices.entries()) {
      const lapRow = sessionLaps[lapIdx];
      if (!lapRow) continue;
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
  }, [processedSession, selectedLapIndices, sessionLaps]);

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
    if (processedSession) {
      const pt = processedSession.points.find((p) =>
        isValidGps(p.latitude, p.longitude),
      );
      if (pt) return { lat: pt.latitude, lng: pt.longitude };
    }
    return {
      lat: TelemetryServiceMock.getTelemetryTrackMap().latitude,
      lng: TelemetryServiceMock.getTelemetryTrackMap().longitude,
    };
  }, [mapTrails, processedSession]);

  const chartInstancesRef = useRef<ECharts[]>([]);
  const connectScheduledRef = useRef(false);

  const scheduleConnect = useCallback(() => {
    if (connectScheduledRef.current) return;
    if (chartInstancesRef.current.length < EXPECTED_CHART_COUNT) return;
    connectScheduledRef.current = true;
    requestAnimationFrame(() => {
      connectTelemetryCharts(TelemetryServiceMock.getTelemetryChartGroup());
    });
  }, []);

  const registerChart = useCallback(
    (chart: ECharts) => {
      if (!chartInstancesRef.current.includes(chart)) {
        chartInstancesRef.current.push(chart);
      }
      scheduleConnect();
    },
    [scheduleConnect]
  );

  useEffect(() => {
    disconnectTelemetryCharts(TelemetryServiceMock.getTelemetryChartGroup());
    connectScheduledRef.current = false;
    if (chartInstancesRef.current.length >= EXPECTED_CHART_COUNT) {
      requestAnimationFrame(() => {
        connectTelemetryCharts(TelemetryServiceMock.getTelemetryChartGroup());
      });
    }
  }, [selectedLapIndices, sectorTab]);

  useEffect(() => {
    return () => {
      disconnectTelemetryCharts(TelemetryServiceMock.getTelemetryChartGroup());
    };
  }, []);

  const lapLinesByMetric = useMemo(() => {
    return TelemetryServiceMock.getTelemetryChartMetrics().map((metric) => {
      const lines = selectedLapIndices.map((lapIdx, colorIdx) => {
        const lapRow = sessionLaps[lapIdx];
        const data =
          processedSession && lapRow
            ? chartSeriesForProcessedLap(
                processedSession,
                lapRow.lap,
                metric.key,
                chartDistanceLengthM,
                sectorFilter,
              )
            : TelemetryServiceMock.telemetryLapSeries(metric.key, lapIdx);
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
    <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)_minmax(0,560px)]">
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
                        ? "border-[rgba(17,17,17,0.12)] bg-neutral-50"
                        : "border-transparent bg-transparent hover:bg-neutral-50"
                    }`}
                  >
                    <span
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded border"
                      style={{
                        borderColor: selected ? color : "rgba(17,17,17,0.2)",
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
                      <span className="block text-[12px] font-semibold text-neutral-800">
                        Volta {row.lap}
                      </span>
                    </span>
                    <span
                      className="font-mono text-[12px] font-bold tabular-nums"
                      style={{ color: selected ? color : "rgb(82,82,82)" }}
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
          <div className="flex min-h-0 flex-1 flex-col gap-1 p-1.5 pb-0">
            {lapLinesByMetric.map(({ metric, lines, yExtent }, chartIdx) => (
              <div
                key={metric.key}
                className="flex min-h-0 flex-1 flex-col rounded-md border border-[rgba(17,17,17,0.06)] bg-white px-2 py-1"
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
                    syncPointer={chartIdx === 0}
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
              {processedSession?.trackName ?? TelemetryServiceMock.getTelemetryTrackMap().title}
            </p>
            {processedSession ? (
              <p className="shrink-0 font-mono text-[11px] tabular-nums text-neutral-500">
                {formatSessionDateTime(processedSession.createdAt)}
              </p>
            ) : null}
          </div>
          <div className="relative min-h-0 flex-1 p-2">
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
