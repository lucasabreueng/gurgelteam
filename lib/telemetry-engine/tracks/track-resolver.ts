import type { Track } from "../types";
import { BUILTIN_TRACKS, getBuiltinTrackById } from "./catalog";
import { listUserTracks } from "./user-track-store";
import { userTrackToEngineTrack } from "./user-track-types";

export async function getAllTracks(): Promise<Track[]> {
  const user = await listUserTracks();
  const userEngine = user.map(userTrackToEngineTrack);
  return [...userEngine, ...BUILTIN_TRACKS];
}

export async function getTrackByIdAsync(id: string): Promise<Track | undefined> {
  if (id.startsWith("user-track-")) {
    const user = await listUserTracks();
    const found = user.find((t) => t.id === id);
    return found ? userTrackToEngineTrack(found) : undefined;
  }
  return getBuiltinTrackById(id);
}

export async function detectBestTrackAsync(
  points: { latitude: number; longitude: number }[],
): Promise<Track> {
  const tracks = await getAllTracks();
  const valid = points.filter(
    (p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude),
  );
  if (valid.length === 0) {
    return tracks[0] ?? BUILTIN_TRACKS[0];
  }

  let best = tracks[0] ?? BUILTIN_TRACKS[0];
  let bestScore = -1;

  for (const track of tracks) {
    const inside = valid.filter(
      (p) =>
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
