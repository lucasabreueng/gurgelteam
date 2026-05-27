import type { GpsLine, Track } from "../types";

const CENTER = {
  latitude: -15.8254576,
  longitude: -47.9743033,
};

/** Linha perpendicular ao traçado — largura ~25 m em graus aproximados */
function sectorLine(
  centerLat: number,
  centerLon: number,
  dLat: number,
  dLon: number,
  halfWidth = 0.00012,
): GpsLine {
  return {
    latA: centerLat + dLat - halfWidth,
    lonA: centerLon + dLon - halfWidth * 0.8,
    latB: centerLat + dLat + halfWidth,
    lonB: centerLon + dLon + halfWidth * 0.8,
  };
}

export const TRACK_AYRTON_SENNA: Track = {
  id: "ayrton-senna-df",
  name: "Kartódromo Internacional Ayrton Senna",
  length: 890,
  center: CENTER,
  startFinishLine: sectorLine(CENTER.latitude, CENTER.longitude, 0.00035, -0.00008),
  sectors: [
    { sector: 1, endLine: sectorLine(CENTER.latitude, CENTER.longitude, 0.00005, 0.00042) },
    { sector: 2, endLine: sectorLine(CENTER.latitude, CENTER.longitude, -0.00038, 0.00018) },
    { sector: 3, endLine: sectorLine(CENTER.latitude, CENTER.longitude, -0.00012, -0.00035) },
  ],
  bounds: {
    minLat: CENTER.latitude - 0.00055,
    maxLat: CENTER.latitude + 0.00055,
    minLon: CENTER.longitude - 0.00055,
    maxLon: CENTER.longitude + 0.00055,
  },
};

export const TRACK_GRANJA_VIANA: Track = {
  id: "granja-viana-sp",
  name: "Kartódromo Granja Viana",
  length: 920,
  center: { latitude: -23.5912, longitude: -46.8321 },
  startFinishLine: sectorLine(-23.5912, -46.8321, 0.0003, -0.0001),
  sectors: [
    { sector: 1, endLine: sectorLine(-23.5912, -46.8321, 0.00002, 0.00038) },
    { sector: 2, endLine: sectorLine(-23.5912, -46.8321, -0.00032, 0.00015) },
    { sector: 3, endLine: sectorLine(-23.5912, -46.8321, -0.00008, -0.00032) },
  ],
  bounds: {
    minLat: -23.5912 - 0.00055,
    maxLat: -23.5912 + 0.00055,
    minLon: -46.8321 - 0.00055,
    maxLon: -46.8321 + 0.00055,
  },
};

export const BUILTIN_TRACKS: Track[] = [TRACK_AYRTON_SENNA, TRACK_GRANJA_VIANA];

/** @deprecated use BUILTIN_TRACKS ou getAllTracks() */
export const TRACK_CATALOG = BUILTIN_TRACKS;

export function getBuiltinTrackById(id: string): Track | undefined {
  return BUILTIN_TRACKS.find((t) => t.id === id);
}

export function getTrackById(id: string): Track | undefined {
  return getBuiltinTrackById(id);
}

export function getDefaultTrack(): Track {
  return TRACK_AYRTON_SENNA;
}

/** Escolhe pista mais compatível com os pontos GPS */
export function detectBestTrack(
  points: { latitude: number; longitude: number }[],
): Track {
  const valid = points.filter(
    (p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude),
  );
  if (valid.length === 0) return getDefaultTrack();

  let best = getDefaultTrack();
  let bestScore = -1;

  for (const track of BUILTIN_TRACKS) {
    const inside = valid.filter((p) =>
      p.latitude >= track.bounds.minLat &&
      p.latitude <= track.bounds.maxLat &&
      p.longitude >= track.bounds.minLon &&
      p.longitude <= track.bounds.maxLon,
    ).length;
    const score = inside / valid.length;
    if (score > bestScore) {
      bestScore = score;
      best = track;
    }
  }

  return best;
}

export function cloneTrackLines(track: Track): {
  startFinishLine: GpsLine;
  sectors: Track["sectors"];
} {
  return {
    startFinishLine: { ...track.startFinishLine },
    sectors: track.sectors.map((s) => ({
      sector: s.sector,
      endLine: { ...s.endLine },
    })),
  };
}
