"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { GpsLine } from "@/lib/telemetry-engine";
import { isValidGps } from "@/lib/telemetry-engine";
import {
  isGoogleMapsConfigured,
  loadGoogleMaps,
  MAP_TYPE,
  MARKER_CIRCLE_PATH,
} from "@/lib/google-maps-loader";

export type MapLatLng = { lat: number; lng: number };

export type MapMarker = {
  id: string;
  position: MapLatLng;
  color?: string;
  scale?: number;
};

export type MapTrail = {
  id: string;
  path: MapLatLng[];
  color: string;
  /** Segmentos coloridos para mapa de calor. */
  heatSegments?: { path: MapLatLng[]; color: string }[];
  strokeWeight?: number;
};

export type TelemetryGoogleMapHandle = {
  setHoverMarkers: (markers: MapMarker[]) => void;
};

type Props = {
  /** @deprecated use trails */
  trail?: MapLatLng[];
  trailColor?: string;
  trails?: MapTrail[];
  lines?: { id: string; line: GpsLine; color: string; dashed?: boolean }[];
  /** Marcadores estáticos (não seguem o cursor). */
  markers?: MapMarker[];
  center?: MapLatLng;
  className?: string;
  height?: number;
  fill?: boolean;
  mapType?: "satellite" | "roadmap";
};

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
];

function lineToPath(line: GpsLine): MapLatLng[] {
  return [
    { lat: line.latA, lng: line.lonA },
    { lat: line.latB, lng: line.lonB },
  ];
}

function downsample(path: MapLatLng[], maxPoints = 4000): MapLatLng[] {
  if (path.length <= maxPoints) return path;
  const step = Math.ceil(path.length / maxPoints);
  const out: MapLatLng[] = [];
  for (let i = 0; i < path.length; i += step) out.push(path[i]);
  if (out[out.length - 1] !== path[path.length - 1]) {
    out.push(path[path.length - 1]);
  }
  return out;
}

function triggerMapResize(map: google.maps.Map): void {
  if (window.google?.maps?.event?.trigger) {
    window.google.maps.event.trigger(map, "resize");
  } else {
    window.dispatchEvent(new Event("resize"));
  }
}

function enforceTopDownView(map: google.maps.Map): void {
  map.setTilt(0);
  map.setHeading(0);
}

function waitForContainerHeight(el: HTMLElement, minPx = 120): Promise<void> {
  return new Promise((resolve) => {
    let attempts = 0;
    const tick = () => {
      if (el.clientHeight >= minPx || attempts > 60) {
        resolve();
        return;
      }
      attempts += 1;
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function buildMarkerIcon(
  maps: typeof google.maps,
  m: MapMarker,
): google.maps.Symbol {
  return {
    path: maps.SymbolPath?.CIRCLE ?? MARKER_CIRCLE_PATH,
    scale: m.scale ?? 6,
    fillColor: m.color ?? "#fbbf24",
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
  };
}

export const TelemetryGoogleMap = forwardRef<TelemetryGoogleMapHandle, Props>(
  function TelemetryGoogleMap(
    {
      trail = [],
      trailColor = "#0d1f3c",
      trails,
      lines = [],
      markers = [],
      center,
      className = "",
      height = 360,
      fill = false,
      mapType = "satellite",
    },
    ref,
  ) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const staticOverlaysRef = useRef<(google.maps.Polyline | google.maps.Marker)[]>([]);
    const hoverMarkerRefs = useRef<Map<string, google.maps.Marker>>(new Map());
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const statusRef = useRef(status);
    statusRef.current = status;

    const resolvedTrails = useMemo<MapTrail[]>(
      () =>
        trails ??
        (trail.length > 0
          ? [{ id: "legacy", path: trail, color: trailColor }]
          : []),
      [trails, trail, trailColor],
    );

    useImperativeHandle(ref, () => ({
      setHoverMarkers(next: MapMarker[]) {
        const map = mapRef.current;
        if (!map || statusRef.current !== "ready" || !window.google?.maps) return;
        const maps = window.google.maps;
        const activeIds = new Set<string>();

        for (const m of next) {
          if (!isValidGps(m.position.lat, m.position.lng)) continue;
          activeIds.add(m.id);
          let marker = hoverMarkerRefs.current.get(m.id);
          if (!marker) {
            marker = new maps.Marker({
              map,
              icon: buildMarkerIcon(maps, m),
              optimized: true,
              zIndex: 1000,
            });
            hoverMarkerRefs.current.set(m.id, marker);
          } else {
            marker.setIcon(buildMarkerIcon(maps, m));
          }
          marker.setPosition(m.position);
          marker.setVisible(true);
        }

        for (const [id, marker] of hoverMarkerRefs.current) {
          if (!activeIds.has(id)) marker.setVisible(false);
        }
      },
    }));

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      let cancelled = false;

      void (async () => {
        try {
          if (!isGoogleMapsConfigured()) {
            throw new Error(
              "Defina NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no .env.local e reinicie o servidor (npm run dev).",
            );
          }

          await waitForContainerHeight(container);
          const maps = await loadGoogleMaps();
          if (cancelled || !containerRef.current) return;

          const fallbackCenter = center ?? {
            lat: -15.8254576,
            lng: -47.9743033,
          };

          if (!mapRef.current) {
            mapRef.current = new maps.Map(containerRef.current, {
              center: fallbackCenter,
              zoom: 17,
              tilt: 0,
              heading: 0,
              mapTypeId:
                mapType === "satellite" ? MAP_TYPE.satellite : MAP_TYPE.roadmap,
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: true,
              streetViewControl: false,
              fullscreenControl: true,
              rotateControl: false,
              styles: mapType === "roadmap" ? DARK_MAP_STYLE : undefined,
            });
            enforceTopDownView(mapRef.current);
            triggerMapResize(mapRef.current);
          }

          setStatus("ready");
        } catch (err) {
          if (!cancelled) {
            setStatus("error");
            setErrorMsg(
              err instanceof Error ? err.message : "Erro ao carregar Google Maps.",
            );
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [center, mapType]);

    useEffect(() => {
      const map = mapRef.current;
      if (!map || status !== "ready" || !window.google?.maps) return;

      const maps = window.google.maps;

      for (const o of staticOverlaysRef.current) o.setMap(null);
      staticOverlaysRef.current = [];

      const bounds = new maps.LatLngBounds();

      for (const t of resolvedTrails) {
        const weight = t.strokeWeight ?? (t.heatSegments?.length ? 5 : 3);

        if (t.heatSegments?.length) {
          for (const seg of t.heatSegments) {
            const path = downsample(seg.path.filter((p) => isValidGps(p.lat, p.lng)));
            if (path.length < 2) continue;
            const polyline = new maps.Polyline({
              path,
              strokeColor: seg.color,
              strokeOpacity: 0.96,
              strokeWeight: weight,
              geodesic: true,
              map,
            });
            staticOverlaysRef.current.push(polyline);
            path.forEach((p) => bounds.extend(p));
          }
          continue;
        }

        const path = downsample(t.path.filter((p) => isValidGps(p.lat, p.lng)));
        if (path.length === 0) continue;
        const polyline = new maps.Polyline({
          path,
          strokeColor: t.color,
          strokeOpacity: 0.92,
          strokeWeight: weight,
          geodesic: true,
          map,
        });
        staticOverlaysRef.current.push(polyline);
        path.forEach((p) => bounds.extend(p));
      }

      for (const { line, color, dashed } of lines) {
        const path = lineToPath(line);
        const polyline = new maps.Polyline({
          path,
          strokeColor: color,
          strokeOpacity: 0.95,
          strokeWeight: dashed ? 3 : 4,
          geodesic: true,
          map,
          icons: dashed
            ? [{ icon: { path: "M 0,-1 0,1", scale: 3 }, offset: "0" }]
            : undefined,
        });
        staticOverlaysRef.current.push(polyline);
        path.forEach((p) => bounds.extend(p));
      }

      for (const m of markers) {
        if (!isValidGps(m.position.lat, m.position.lng)) continue;
        const marker = new maps.Marker({
          position: m.position,
          map,
          icon: buildMarkerIcon(maps, m),
        });
        staticOverlaysRef.current.push(marker);
        bounds.extend(m.position);
      }

      triggerMapResize(map);

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, 48);
        maps.event.addListenerOnce(map, "idle", () => {
          enforceTopDownView(map);
        });
      } else if (center) {
        map.setCenter(center);
        map.setZoom(17);
        enforceTopDownView(map);
      }

      window.setTimeout(() => {
        triggerMapResize(map);
        enforceTopDownView(map);
      }, 250);
    }, [resolvedTrails, lines, markers, center, status]);

    useEffect(() => {
      const el = containerRef.current;
      const map = mapRef.current;
      if (!el || !map || status !== "ready") return;

      const ro = new ResizeObserver(() => {
        triggerMapResize(map);
        enforceTopDownView(map);
      });
      ro.observe(el);
      if (wrapperRef.current) ro.observe(wrapperRef.current);

      return () => ro.disconnect();
    }, [status]);

    if (status === "error") {
      return (
        <div
          className={`flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-8 text-center ${className}`}
          style={{ minHeight: fill ? 280 : height }}
        >
          <div>
            <p className="text-[13px] font-semibold text-amber-900">
              Google Maps indisponível
            </p>
            <p className="mt-1 text-[12px] text-amber-800">{errorMsg}</p>
          </div>
        </div>
      );
    }

    const shellClass = fill
      ? `relative h-full w-full min-h-[280px] ${className}`
      : `relative overflow-hidden rounded-xl border border-[rgba(17,17,17,0.1)] ${className}`;

    const mapClass = fill ? "absolute inset-0 h-full w-full" : "w-full";

    return (
      <div ref={wrapperRef} className={shellClass}>
        {status === "loading" ? (
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-[12px] text-neutral-600 ${fill ? "" : "rounded-xl"}`}
          >
            Carregando Google Maps…
          </div>
        ) : null}
        <div
          ref={containerRef}
          className={mapClass}
          style={fill ? undefined : { minHeight: height, height }}
        />
      </div>
    );
  },
);
