"use client";

import { useCallback, useEffect, useState } from "react";
import type { Track } from "@/lib/telemetry-engine";
import { userTrackToEngineTrack } from "@/lib/telemetry-engine/tracks/user-track-types";
import { listUserTracks } from "@/lib/telemetry-engine/tracks/user-track-store";

export function useUserTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await listUserTracks();
      setTracks(rows.map(userTrackToEngineTrack));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { userTracks: tracks, loading, reload };
}
