"use client";

import { useMemo } from "react";
import type { ImportPreviewData } from "@/lib/telemetry-engine";
import { isValidGps } from "@/lib/telemetry-engine";
import {
  TelemetryGoogleMap,
  type MapLatLng,
  type MapMarker,
} from "../telemetry-google-map";

type Props = {
  preview: ImportPreviewData;
  height?: number;
};

export function TelemetryImportMap({ preview, height = 360 }: Props) {
  const { trail, lines, markers, center, gpsValidCount } = useMemo(() => {
    const trail: MapLatLng[] = preview.points
      .filter((p) => isValidGps(p.latitude, p.longitude))
      .map((p) => ({ lat: p.latitude, lng: p.longitude }));

    const applied = preview.appliedLines;
    const lines = [
      { id: "sf", line: applied.startFinishLine, color: "#fbbf24", dashed: true },
      ...applied.sectors.map((s, i) => ({
        id: `s${s.sector}`,
        line: s.endLine,
        color: i === 0 ? "#60a5fa" : i === 1 ? "#a78bfa" : "#f472b6",
        dashed: false,
      })),
    ];

    const markers: MapMarker[] = preview.crossings
      .filter((c) => c.lineId === "start_finish")
      .map((c, i) => ({
        id: `sf-${i}`,
        position: { lat: c.latitude, lng: c.longitude },
        color: "#fbbf24",
      }));

    const center: MapLatLng | undefined = trail[0]
      ? { lat: trail[0].lat, lng: trail[0].lng }
      : undefined;

    return {
      trail,
      lines,
      markers,
      center,
      gpsValidCount: trail.length,
    };
  }, [preview]);

  return (
    <div>
      <TelemetryGoogleMap
        trail={trail}
        lines={lines}
        markers={markers}
        center={center}
        height={height}
        mapType="satellite"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-[10px] text-neutral-600">
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-4 bg-emerald-400" /> Trajetória GPS
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-amber-400" />{" "}
            Largada/chegada
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-4 bg-blue-400" /> S1 · S2 · S3
          </span>
        </div>
        <span className="font-mono tabular-nums">
          {gpsValidCount} / {preview.meta.totalPoints} pts GPS válidos
        </span>
      </div>
    </div>
  );
}
