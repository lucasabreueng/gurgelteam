"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProcessedTelemetrySession } from "@/lib/telemetry-engine";
import {
  getProcessedSession,
  isProcessedSessionId,
  processedSessionToSectorsPage,
} from "@/lib/telemetry-engine";
import type { SectorsPageData } from "@/lib/contracts/telemetry/sectors";
import { apiSessionToSectorsPage } from "@/lib/telemetry-engine/bridge/api-sectors-data";
import {
  isApiSessionId,
  parseApiSessionUuid,
} from "@/lib/telemetry-api-session";
import { TelemetryRepositoryHttp } from "@/repositories/telemetry/TelemetryRepositoryHttp";

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

export function useApiTelemetrySession(sessionId: string) {
  const [sectorsData, setSectorsData] = useState<SectorsPageData | null>(null);
  const [loading, setLoading] = useState(isApiSessionId(sessionId));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const uuid = parseApiSessionUuid(sessionId);
    if (!uuid) {
      setSectorsData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const dto = await TelemetryRepositoryHttp.getSessionById(uuid);
      const page = apiSessionToSectorsPage(dto);
      setSectorsData(page);
      if (!page) {
        setError("Sessão sem voltas com setores para exibir.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar sessão da nuvem.");
      setSectorsData(null);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    sectorsData,
    loading,
    error,
    reload,
    isApi: isApiSessionId(sessionId),
  };
}

export function useSectorsPageData(sessionId: string) {
  const processed = useProcessedTelemetrySession(sessionId);
  const api = useApiTelemetrySession(sessionId);

  if (!sessionId) {
    return { data: null, loading: false, isProcessed: false, isApi: false, session: null, error: null };
  }

  if (isProcessedSessionId(sessionId)) {
    const data =
      processed.session ? processedSessionToSectorsPage(processed.session) : null;
    return {
      data,
      loading: processed.loading,
      isProcessed: true,
      isApi: false,
      session: processed.session,
      error: processed.error,
    };
  }

  if (isApiSessionId(sessionId)) {
    return {
      data: api.sectorsData,
      loading: api.loading,
      isProcessed: false,
      isApi: true,
      session: null,
      error: api.error,
    };
  }

  return {
    data: null,
    loading: false,
    isProcessed: false,
    isApi: false,
    session: null,
    error: null,
  };
}
