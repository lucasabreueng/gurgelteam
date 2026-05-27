import { isValidGps } from "../geometry/geo";

/** AiM/MyChron frequentemente exporta graus × 1e7 (ex.: -158254576 → -15.8254576) */
export function normalizeGpsCoordinate(
  raw: number | null,
  kind: "lat" | "lon",
): number | null {
  if (raw == null || !Number.isFinite(raw)) return null;

  let v = raw;

  if (Math.abs(v) > 180) {
    if (Math.abs(v) >= 1e6) v = v / 1e7;
    else if (Math.abs(v) >= 1e4) v = v / 1e5;
    else if (Math.abs(v) >= 1e3) v = v / 1e3;
  }

  if (kind === "lat" && Math.abs(v) > 90) return null;
  if (kind === "lon" && Math.abs(v) > 180) return null;

  return v;
}

/** Corrige lat/lon invertidos quando detectável */
export function fixSwappedCoordinates(
  lat: number | null,
  lon: number | null,
): { latitude: number; longitude: number } | null {
  let la = lat;
  let lo = lon;

  if (la != null && lo != null) {
    if (Math.abs(la) > 90 && Math.abs(lo) <= 90) {
      [la, lo] = [lo, la];
    }
  }

  const latitude = la ?? NaN;
  const longitude = lo ?? NaN;

  if (!isValidGps(latitude, longitude)) return null;
  return { latitude, longitude };
}

export function parseGpsPair(
  latRaw: number | null,
  lonRaw: number | null,
): { latitude: number; longitude: number } | null {
  const lat = normalizeGpsCoordinate(latRaw, "lat");
  const lon = normalizeGpsCoordinate(lonRaw, "lon");
  return fixSwappedCoordinates(lat, lon);
}
