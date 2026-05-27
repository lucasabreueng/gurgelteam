import type { GpsLine, Track } from "../types";

/** Linha de setor — dois pontos GPS definem a reta de cruzamento */
export type SectorLineInput = GpsLine;

export type UserTrackRecord = {
  id: string;
  name: string;
  city: string;
  center: { latitude: number; longitude: number };
  /** S1 = largada/chegada (início e fim de volta) */
  lines: {
    s1: SectorLineInput;
    s2: SectorLineInput;
    s3: SectorLineInput;
  };
  length: number;
  createdAt: string;
  updatedAt: string;
};

export type UserTrackDraft = {
  name: string;
  city: string;
  latitude: string;
  longitude: string;
};

export type UserTrackLinesDraft = {
  s1: SectorLineInput;
  s2: SectorLineInput;
  s3: SectorLineInput;
};

export function createTrackId(): string {
  return `user-track-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function defaultLineAt(
  lat: number,
  lon: number,
  dLat = 0.0001,
  dLon = 0.00008,
): GpsLine {
  return {
    latA: lat - dLat,
    lonA: lon - dLon,
    latB: lat + dLat,
    lonB: lon + dLon,
  };
}

export function defaultLinesDraft(lat: number, lon: number): UserTrackLinesDraft {
  return {
    s1: defaultLineAt(lat, lon, 0.00012, 0.0001),
    s2: defaultLineAt(lat, lon, 0.00002, 0.00035),
    s3: defaultLineAt(lat, lon, -0.00028, 0.00012),
  };
}

/** Converte cadastro do usuário para Track interno (S1 = largada/chegada). */
export function userTrackToEngineTrack(record: UserTrackRecord): Track {
  const coords = [
    record.center,
    { latitude: record.lines.s1.latA, longitude: record.lines.s1.lonA },
    { latitude: record.lines.s1.latB, longitude: record.lines.s1.lonB },
    { latitude: record.lines.s2.latA, longitude: record.lines.s2.lonA },
    { latitude: record.lines.s2.latB, longitude: record.lines.s2.lonB },
    { latitude: record.lines.s3.latA, longitude: record.lines.s3.lonA },
    { latitude: record.lines.s3.latB, longitude: record.lines.s3.lonB },
  ];

  let minLat = coords[0].latitude;
  let maxLat = coords[0].latitude;
  let minLon = coords[0].longitude;
  let maxLon = coords[0].longitude;

  for (const c of coords) {
    minLat = Math.min(minLat, c.latitude);
    maxLat = Math.max(maxLat, c.latitude);
    minLon = Math.min(minLon, c.longitude);
    maxLon = Math.max(maxLon, c.longitude);
  }

  const padLat = Math.max(0.0025, (maxLat - minLat) * 0.4);
  const padLon = Math.max(0.0025, (maxLon - minLon) * 0.4);

  return {
    id: record.id,
    name: record.name,
    city: record.city,
    isUserTrack: true,
    length: record.length,
    center: record.center,
    startFinishLine: { ...record.lines.s1 },
    sectors: [
      { sector: 1, endLine: { ...record.lines.s2 } },
      { sector: 2, endLine: { ...record.lines.s3 } },
      { sector: 3, endLine: { ...record.lines.s1 } },
    ],
    bounds: {
      minLat: minLat - padLat,
      maxLat: maxLat + padLat,
      minLon: minLon - padLon,
      maxLon: maxLon + padLon,
    },
  };
}

export function parseCoord(raw: string): number | null {
  const n = Number(raw.replace(",", ".").trim());
  return Number.isFinite(n) ? n : null;
}

export type LineInputStrings = {
  latA: string;
  lonA: string;
  latB: string;
  lonB: string;
};

export type LinesInputStrings = {
  s1: LineInputStrings;
  s2: LineInputStrings;
  s3: LineInputStrings;
};

export function linesDraftToStrings(draft: UserTrackLinesDraft): LinesInputStrings {
  const line = (l: GpsLine): LineInputStrings => ({
    latA: String(l.latA),
    lonA: String(l.lonA),
    latB: String(l.latB),
    lonB: String(l.lonB),
  });
  return { s1: line(draft.s1), s2: line(draft.s2), s3: line(draft.s3) };
}

export function stringsToLinesDraft(input: LinesInputStrings): UserTrackLinesDraft | null {
  const parse = (l: LineInputStrings): GpsLine | null => {
    const latA = parseCoord(l.latA);
    const lonA = parseCoord(l.lonA);
    const latB = parseCoord(l.latB);
    const lonB = parseCoord(l.lonB);
    if (latA == null || lonA == null || latB == null || lonB == null) return null;
    return { latA, lonA, latB, lonB };
  };
  const s1 = parse(input.s1);
  const s2 = parse(input.s2);
  const s3 = parse(input.s3);
  if (!s1 || !s2 || !s3) return null;
  return { s1, s2, s3 };
}
