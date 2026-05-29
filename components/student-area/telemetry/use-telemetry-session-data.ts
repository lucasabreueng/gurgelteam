"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProcessedTelemetrySession } from "@/lib/telemetry-engine";
import {
  getProcessedSession,
  isProcessedSessionId,
  processedSessionToSectorsPage,
} from "@/lib/telemetry-engine";

export function useProcessedTelemetrySession(sessionId: string) {
  const [session, setSession] = useState<ProcessedTelemetrySession | null>(null);
  const [loading, setLoading] = useState(isProcessedSessionId(sessionId));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!isProcessedSessionId(sessionId)) {
      setSession(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getProcessedSession(sessionId);
      setSession(data);
      if (!data) setError("Sessão processada não encontrada.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar sessão.");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { session, loading, error, reload, isProcessed: isProcessedSessionId(sessionId) };
}

export function useSectorsPageData(sessionId: string) {
  const { session, loading, isProcessed } = useProcessedTelemetrySession(sessionId);

  if (!sessionId) {
    return { data: null, loading: false, isProcessed: false, session: null };
  }

  const data =
    isProcessed && session ? processedSessionToSectorsPage(session) : null;

  return { data, loading: isProcessed && loading, isProcessed, session };
}
