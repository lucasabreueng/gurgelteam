"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ImportPreviewData, SessionLap, TelemetryPoint } from "@/lib/telemetry-engine";
import {
  commitTraceCorrectionsToPreview,
  formatLapTime,
  lapTrailCentroid,
  lapTrailPath,
  previewLapWithTraceOffset,
  refreshLapMeta,
} from "@/lib/telemetry-engine";
import {
  isGoogleMapsConfigured,
  loadGoogleMaps,
} from "@/lib/google-maps-loader";

type Props = {
  preview: ImportPreviewData;
  baselinePoints: TelemetryPoint[];
  baselineLaps: SessionLap[];
  onPreviewChange: (next: ImportPreviewData) => void;
};

function isIssueResolved(
  lapNumber: number,
  corrections: ImportPreviewData["lapCorrections"],
): boolean {
  return corrections.some((c) => c.lapNumber === lapNumber);
}

export function TelemetryLapTraceEditor({
  preview,
  baselinePoints,
  baselineLaps,
  onPreviewChange,
}: Props) {
  const issues = preview.lapIssues;
  const [selectedLap, setSelectedLap] = useState<number | null>(
    issues[0]?.lapNumber ?? null,
  );
  const [offset, setOffset] = useState({ dLat: 0, dLon: 0 });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const dragMarkerRef = useRef<google.maps.Marker | null>(null);
  const overlaysRef = useRef<google.maps.Polyline[]>([]);
  const baseCentroidRef = useRef<{ lat: number; lng: number } | null>(null);
  const didFitBoundsRef = useRef(false);

  const lap = useMemo(
    () => preview.laps.find((l) => l.lapNumber === selectedLap && !l.isOutLap),
    [preview.laps, selectedLap],
  );

  const corrected = useMemo(() => {
    if (!lap) return null;
    return previewLapWithTraceOffset(
      preview.points,
      lap,
      offset,
      preview.appliedLines,
    );
  }, [lap, offset, preview.points, preview.appliedLines]);


  useEffect(() => {
    if (!selectedLap && issues.length > 0) {
      setSelectedLap(issues[0].lapNumber);
    }
  }, [issues, selectedLap]);

  useEffect(() => {
    setOffset({ dLat: 0, dLon: 0 });
    if (lap) {
      baseCentroidRef.current = lapTrailCentroid(preview.points, lap);
    }
  }, [selectedLap, lap, preview.points]);

  const drawMap = useCallback(() => {
    const map = mapRef.current;
    if (!map || !window.google?.maps || !lap) return;
    const maps = window.google.maps;

    for (const o of overlaysRef.current) o.setMap(null);
    overlaysRef.current = [];

    const applied = preview.appliedLines;
    // Convenção: S1 = start/finish. S2 = fim do setor 1. S3 = fim do setor 2.
    const lineOverlays = [
      { line: applied.startFinishLine, color: "#0ea5e9" }, // S1
      { line: applied.sectors[0]?.endLine, color: "#a78bfa" }, // S2
      { line: applied.sectors[1]?.endLine, color: "#f472b6" }, // S3
    ].filter((x) => x.line);

    for (const { line, color } of lineOverlays) {
      if (!line) continue;
      const pl = new maps.Polyline({
        path: [
          { lat: line.latA, lng: line.lonA },
          { lat: line.latB, lng: line.lonB },
        ],
        strokeColor: color,
        strokeWeight: 4,
        map,
      });
      overlaysRef.current.push(pl);
    }

    const originalPath = lapTrailPath(preview.points, lap);
    if (originalPath.length > 0) {
      overlaysRef.current.push(
        new maps.Polyline({
          path: originalPath,
          strokeColor: "#94a3b8",
          strokeOpacity: 0.7,
          strokeWeight: 2,
          icons: [
            {
              icon: { path: "M 0,-1 0,1", scale: 2 },
              offset: "0",
              repeat: "8px",
            },
          ],
          map,
        }),
      );
    }

    const adjustedPath = lapTrailPath(preview.points, lap, offset);
    if (adjustedPath.length > 0) {
      overlaysRef.current.push(
        new maps.Polyline({
          path: adjustedPath,
          strokeColor: corrected?.isValid ? "#10b981" : "#f59e0b",
          strokeOpacity: 0.95,
          strokeWeight: 4,
          map,
        }),
      );
    }

    const base = baseCentroidRef.current ?? adjustedPath[0];
    if (!base) return;

    const markerPos = {
      lat: base.lat + offset.dLat,
      lng: base.lng + offset.dLon,
    };

    if (!dragMarkerRef.current) {
      dragMarkerRef.current = new maps.Marker({
        map,
        position: markerPos,
        draggable: true,
        title: "Arraste para alinhar o traçado aos setores",
        icon: {
          path: maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#0d1f3c",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        zIndex: 1000,
      });
      dragMarkerRef.current.addListener("drag", () => {
        const pos = dragMarkerRef.current?.getPosition();
        const c = baseCentroidRef.current;
        if (!pos || !c) return;
        setOffset({
          dLat: pos.lat() - c.lat,
          dLon: pos.lng() - c.lng,
        });
      });
    } else {
      dragMarkerRef.current.setPosition(markerPos);
    }

    // Mantém o zoom fixo durante o ajuste: só enquadra na 1ª renderização da volta.
    if (!didFitBoundsRef.current) {
      const bounds = new maps.LatLngBounds();
      adjustedPath.forEach((p) => bounds.extend(p));
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, 40);
        didFitBoundsRef.current = true;
      }
    }
  }, [lap, offset, preview, corrected?.isValid]);

  useEffect(() => {
    dragMarkerRef.current?.setMap(null);
    dragMarkerRef.current = null;
    didFitBoundsRef.current = false;
  }, [selectedLap]);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || !lap || issues.length === 0) return;
    let cancelled = false;

    void (async () => {
      if (!isGoogleMapsConfigured()) return;
      const maps = await loadGoogleMaps();
      if (cancelled || !mapContainerRef.current) return;

      if (!mapRef.current) {
        const c = baseCentroidRef.current ?? { lat: -15.826, lng: -47.971 };
        mapRef.current = new maps.Map(mapContainerRef.current, {
          center: c,
          zoom: 18,
          mapTypeId: "satellite",
          tilt: 0,
          heading: 0,
          streetViewControl: false,
        });
      }
      drawMap();
    })();

    return () => {
      cancelled = true;
    };
  }, [lap, selectedLap, drawMap, issues.length]);

  useEffect(() => {
    drawMap();
  }, [drawMap, offset]);

  if (issues.length === 0) return null;

  const applyCorrection = () => {
    if (!lap || !corrected?.isValid) return;
    const corrections = [
      ...preview.lapCorrections.filter((c) => c.lapNumber !== lap.lapNumber),
      {
        lapNumber: lap.lapNumber,
        action: {
          type: "trace_offset" as const,
          dLat: offset.dLat,
          dLon: offset.dLon,
        },
      },
    ];
    const points = baselinePoints.map((p) => ({ ...p }));
    const { laps, lapIssues } = commitTraceCorrectionsToPreview(
      points,
      baselineLaps.map((l) => ({
        ...l,
        sectors: l.sectors.map((s) => ({ ...s })),
      })),
      corrections,
      preview.appliedLines,
    );
    onPreviewChange({
      ...preview,
      points,
      laps,
      lapCorrections: corrections,
      lapIssues,
      meta: { ...preview.meta, ...refreshLapMeta(laps) },
    });
    setOffset({ dLat: 0, dLon: 0 });
  };

  const excludeLap = () => {
    if (!lap) return;
    const corrections = [
      ...preview.lapCorrections.filter((c) => c.lapNumber !== lap.lapNumber),
      { lapNumber: lap.lapNumber, action: { type: "exclude" as const } },
    ];
    const points = baselinePoints.map((p) => ({ ...p }));
    const { laps, lapIssues } = commitTraceCorrectionsToPreview(
      points,
      baselineLaps.map((l) => ({
        ...l,
        sectors: l.sectors.map((s) => ({ ...s })),
      })),
      corrections,
      preview.appliedLines,
    );
    onPreviewChange({
      ...preview,
      points,
      laps,
      lapCorrections: corrections,
      lapIssues,
      meta: { ...preview.meta, ...refreshLapMeta(laps) },
    });
  };

  const pending = issues.filter(
    (i) => !isIssueResolved(i.lapNumber, preview.lapCorrections),
  );

  return (
    <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-950">
        Voltas com setores ausentes ({pending.length} pendente
        {pending.length !== 1 ? "s" : ""})
      </p>
      <p className="mt-1 text-[12px] text-amber-950/85">
        Selecione a volta e arraste o ponto no mapa para mover o traçado GPS até
        cruzar S1, S2 e S3. Linha tracejada = original; linha sólida = ajustada.
      </p>

      <div className="mt-3 flex flex-col gap-3 lg:flex-row">
        <ul className="max-h-52 shrink-0 space-y-1 overflow-y-auto lg:w-44">
          {issues.map((issue) => {
            const done = isIssueResolved(issue.lapNumber, preview.lapCorrections);
            const active = selectedLap === issue.lapNumber;
            return (
              <li key={issue.lapNumber}>
                <button
                  type="button"
                  onClick={() => setSelectedLap(issue.lapNumber)}
                  className={`w-full rounded-lg px-2.5 py-2 text-left text-[12px] transition ${
                    active
                      ? "bg-accent text-white"
                      : "bg-white/80 text-[#0d1f3c] hover:bg-white"
                  }`}
                >
                  <span className="font-bold">Volta {issue.lapNumber}</span>
                  <span className="mt-0.5 block font-mono text-[11px] opacity-90">
                    {formatLapTime(issue.lapTime)}
                  </span>
                  <span className="mt-0.5 block text-[10px] opacity-80">
                    {done ? "Corrigida" : issue.reason}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="min-w-0 flex-1">
          <div
            ref={mapContainerRef}
            className="h-[280px] w-full overflow-hidden rounded-lg border border-[rgba(17,17,17,0.1)]"
          />
          {lap && corrected ? (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="font-mono text-neutral-700">
                Setores:{" "}
                {corrected.sectors.length === 3
                  ? corrected.sectors
                      .map((s) => formatLapTime(s.sectorTime))
                      .join(" · ")
                  : "—"}
                {corrected.isValid ? (
                  <span className="ml-2 font-sans font-bold text-emerald-700">
                    OK para aplicar
                  </span>
                ) : (
                  <span className="ml-2 font-sans text-amber-800">
                    Ainda não cruza todos os setores
                  </span>
                )}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOffset({ dLat: 0, dLon: 0 })}
                  className="rounded-lg border border-neutral-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600"
                >
                  Resetar
                </button>
                <button
                  type="button"
                  onClick={excludeLap}
                  className="rounded-lg border border-red-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700"
                >
                  Excluir volta
                </button>
                <button
                  type="button"
                  disabled={!corrected.isValid}
                  onClick={applyCorrection}
                  className="rounded-lg bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white disabled:opacity-40"
                >
                  Aplicar traçado
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
