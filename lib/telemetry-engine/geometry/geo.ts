/** Utilitários geográficos e projeção */

export function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isValidGps(lat: number, lon: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180 &&
    !(lat === 0 && lon === 0)
  );
}

/** Sinal do lado da linha AB em relação ao ponto P (produto vetorial 2D) */
export function lineSideSign(
  lat: number,
  lon: number,
  latA: number,
  lonA: number,
  latB: number,
  lonB: number,
): number {
  return (
    (lonB - lonA) * (lat - latA) - (latB - latA) * (lon - lonA)
  );
}

function onSegment(
  lat: number,
  lon: number,
  latA: number,
  lonA: number,
  latB: number,
  lonB: number,
  eps = 1e-12,
): boolean {
  return (
    Math.min(latA, latB) - eps <= lat &&
    lat <= Math.max(latA, latB) + eps &&
    Math.min(lonA, lonB) - eps <= lon &&
    lon <= Math.max(lonA, lonB) + eps
  );
}

/**
 * Verifica se o segmento GPS P1–P2 cruza o segmento finito A–B (portão da pista).
 * Evita falsos positivos da reta infinita fora da largura da linha.
 */
export function segmentsCross(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  latA: number,
  lonA: number,
  latB: number,
  lonB: number,
): boolean {
  const d1 = lineSideSign(lat1, lon1, latA, lonA, latB, lonB);
  const d2 = lineSideSign(lat2, lon2, latA, lonA, latB, lonB);

  if (d1 === 0 && onSegment(lat1, lon1, latA, lonA, latB, lonB)) return true;
  if (d2 === 0 && onSegment(lat2, lon2, latA, lonA, latB, lonB)) return true;
  if (d1 * d2 >= 0) return false;

  const d3 = lineSideSign(latA, lonA, lat1, lon1, lat2, lon2);
  const d4 = lineSideSign(latB, lonB, lat1, lon1, lat2, lon2);
  if (d3 * d4 >= 0) return false;

  return true;
}

/** Interpola posição/tempo no cruzamento entre dois pontos consecutivos */
export function interpolateCrossing(
  lat1: number,
  lon1: number,
  t1: number,
  lat2: number,
  lon2: number,
  t2: number,
  latA: number,
  lonA: number,
  latB: number,
  lonB: number,
): { sessionTime: number; latitude: number; longitude: number; ratio: number } {
  const s1 = lineSideSign(lat1, lon1, latA, lonA, latB, lonB);
  const s2 = lineSideSign(lat2, lon2, latA, lonA, latB, lonB);
  const denom = Math.abs(s1) + Math.abs(s2);
  const ratio = denom > 0 ? Math.abs(s1) / denom : 0.5;
  return {
    sessionTime: t1 + ratio * (t2 - t1),
    latitude: lat1 + ratio * (lat2 - lat1),
    longitude: lon1 + ratio * (lon2 - lon1),
    ratio,
  };
}

/** Estende a linha A–B nas duas direções (metros) para tolerar imprecisão GPS. */
export function extendLineSegment(
  latA: number,
  lonA: number,
  latB: number,
  lonB: number,
  extraMeters = 4,
): { latA: number; lonA: number; latB: number; lonB: number } {
  const len = haversineMeters(latA, lonA, latB, lonB);
  if (len < 1e-6) {
    return { latA, lonA, latB, lonB };
  }
  const dLat = latB - latA;
  const dLon = lonB - lonA;
  const scale = extraMeters / len;
  return {
    latA: latA - dLat * scale,
    lonA: lonA - dLon * scale,
    latB: latB + dLat * scale,
    lonB: lonB + dLon * scale,
  };
}

export function lineLengthMeters(
  latA: number,
  lonA: number,
  latB: number,
  lonB: number,
): number {
  return haversineMeters(latA, lonA, latB, lonB);
}

/** Distância do ponto ao segmento finito A–B (metros, projeção local). */
export function pointToSegmentDistanceMeters(
  lat: number,
  lon: number,
  latA: number,
  lonA: number,
  latB: number,
  lonB: number,
): number {
  const centerLat = (lat + latA + latB) / 3;
  const centerLon = (lon + lonA + lonB) / 3;
  const scale = 80000;
  const p = projectToLocal(lat, lon, centerLat, centerLon, scale);
  const a = projectToLocal(latA, lonA, centerLat, centerLon, scale);
  const b = projectToLocal(latB, lonB, centerLat, centerLon, scale);

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-9) {
    return Math.hypot(p.x - a.x, p.y - a.y);
  }

  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const qx = a.x + t * dx;
  const qy = a.y + t * dy;
  return Math.hypot(p.x - qx, p.y - qy);
}

/** Projeção simples lat/lon → coordenadas SVG (equirectangular local) */
export function projectToLocal(
  lat: number,
  lon: number,
  centerLat: number,
  centerLon: number,
  scale = 80000,
): { x: number; y: number } {
  const x = (lon - centerLon) * scale * Math.cos((centerLat * Math.PI) / 180);
  const y = -(lat - centerLat) * scale;
  return { x, y };
}

export function unprojectFromLocal(
  x: number,
  y: number,
  centerLat: number,
  centerLon: number,
  scale = 80000,
): { latitude: number; longitude: number } {
  const latitude = centerLat - y / scale;
  const longitude =
    centerLon + x / (scale * Math.cos((centerLat * Math.PI) / 180));
  return { latitude, longitude };
}

export function offsetLine(
  line: { latA: number; lonA: number; latB: number; lonB: number },
  dLat: number,
  dLon: number,
): { latA: number; lonA: number; latB: number; lonB: number } {
  return {
    latA: line.latA + dLat,
    lonA: line.lonA + dLon,
    latB: line.latB + dLat,
    lonB: line.lonB + dLon,
  };
}

export function linesEquivalent(
  a: { latA: number; lonA: number; latB: number; lonB: number },
  b: { latA: number; lonA: number; latB: number; lonB: number },
  eps = 1e-7,
): boolean {
  const eq = (x: number, y: number) => Math.abs(x - y) <= eps;
  return (
    (eq(a.latA, b.latA) && eq(a.lonA, b.lonA) && eq(a.latB, b.latB) && eq(a.lonB, b.lonB)) ||
    (eq(a.latA, b.latB) && eq(a.lonA, b.lonB) && eq(a.latB, b.latA) && eq(a.lonB, b.lonA))
  );
}

export function computeBounds(
  points: { latitude: number; longitude: number }[],
  padding = 0.0003,
): { minLat: number; maxLat: number; minLon: number; maxLon: number } {
  if (points.length === 0) {
    return {
      minLat: -15.826,
      maxLat: -15.825,
      minLon: -47.975,
      maxLon: -47.974,
    };
  }
  const lats = points.map((p) => p.latitude);
  const lons = points.map((p) => p.longitude);
  return {
    minLat: Math.min(...lats) - padding,
    maxLat: Math.max(...lats) + padding,
    minLon: Math.min(...lons) - padding,
    maxLon: Math.max(...lons) + padding,
  };
}

export function pointInBounds(
  lat: number,
  lon: number,
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number },
): boolean {
  return (
    lat >= bounds.minLat &&
    lat <= bounds.maxLat &&
    lon >= bounds.minLon &&
    lon <= bounds.maxLon
  );
}

export function avg(values: (number | null | undefined)[]): number | null {
  const nums = values.filter(
    (v): v is number => v != null && Number.isFinite(v),
  );
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function max(values: (number | null | undefined)[]): number | null {
  const nums = values.filter(
    (v): v is number => v != null && Number.isFinite(v),
  );
  if (nums.length === 0) return null;
  return Math.max(...nums);
}
