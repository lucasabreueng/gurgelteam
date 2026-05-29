"use client";

import type { TelemetryPilotSession } from "@/lib/contracts/student-area";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import {
  exitDocumentFullscreen,
  getFullscreenElement,
  requestDocumentFullscreen,
} from "@/lib/telemetry-fullscreen";

import {
  getStoredTelemetrySessionId,
  setStoredTelemetrySessionId,
  TELEMETRY_NO_SESSION,
} from "@/lib/telemetry-active-session";

type TelemetryWorkspaceValue = {
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  selectSession: (session: TelemetryPilotSession) => void;
  loadModalOpen: boolean;
  openLoadModal: () => void;
  closeLoadModal: () => void;
  sessionsModalOpen: boolean;
  openSessionsModal: () => void;
  closeSessionsModal: () => void;
  tracksModalOpen: boolean;
  openTracksModal: () => void;
  closeTracksModal: () => void;
  tracksRevision: number;
  notifyTracksChanged: () => void;
  loadedFileLabel: string | null;
  setLoadedFileLabel: (label: string | null) => void;
  /** Modo tela cheia: sem shell + fullscreen nativo do navegador. */
  immersive: boolean;
  immersiveRootRef: RefObject<HTMLDivElement | null>;
  toggleImmersive: () => void;
  exitImmersive: () => void;
  /** Mapa de calor no traçado (métrica segue o gráfico sob o cursor; apenas 1 volta). */
  heatMapEnabled: boolean;
  toggleHeatMap: () => void;
  setHeatMapEnabled: (enabled: boolean) => void;
};

const TelemetryWorkspaceContext = createContext<TelemetryWorkspaceValue | null>(
  null,
);

export function TelemetryWorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeSessionId, setActiveSessionIdState] = useState(TELEMETRY_NO_SESSION);
  const [hydrated, setHydrated] = useState(false);
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [sessionsModalOpen, setSessionsModalOpen] = useState(false);
  const [tracksModalOpen, setTracksModalOpen] = useState(false);
  const [tracksRevision, setTracksRevision] = useState(0);
  const [loadedFileLabel, setLoadedFileLabel] = useState<string | null>(null);
  const [immersive, setImmersive] = useState(false);
  const [heatMapEnabled, setHeatMapEnabled] = useState(false);
  const immersiveRootRef = useRef<HTMLDivElement | null>(null);

  const toggleHeatMap = useCallback(() => {
    setHeatMapEnabled((prev) => !prev);
  }, []);

  useEffect(() => {
    setActiveSessionIdState(getStoredTelemetrySessionId());
    setHydrated(true);
  }, []);

  const exitImmersive = useCallback(async () => {
    if (getFullscreenElement()) {
      try {
        await exitDocumentFullscreen();
      } catch {
        /* ignore */
      }
    }
    setImmersive(false);
  }, []);

  const toggleImmersive = useCallback(() => {
    if (immersive) {
      void exitImmersive();
      return;
    }
    setImmersive(true);
    void requestDocumentFullscreen().catch(() => {
      /* Safari/iOS pode não suportar — mantém modo imersivo sem FS nativo */
    });
  }, [immersive, exitImmersive]);

  useEffect(() => {
    const syncFromBrowser = () => {
      if (!immersive) return;
      if (!getFullscreenElement()) {
        setImmersive(false);
      }
    };

    document.addEventListener("fullscreenchange", syncFromBrowser);
    document.addEventListener("webkitfullscreenchange", syncFromBrowser);
    return () => {
      document.removeEventListener("fullscreenchange", syncFromBrowser);
      document.removeEventListener("webkitfullscreenchange", syncFromBrowser);
    };
  }, [immersive]);

  useEffect(() => {
    if (!immersive) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (getFullscreenElement()) return;
      void exitImmersive();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [immersive, exitImmersive]);

  const setActiveSessionId = useCallback((id: string) => {
    setActiveSessionIdState(id);
    setStoredTelemetrySessionId(id);
  }, []);

  const selectSession = useCallback(
    (session: TelemetryPilotSession) => {
      setActiveSessionId(session.id);
    },
    [setActiveSessionId],
  );

  const value = useMemo<TelemetryWorkspaceValue>(
    () => ({
      activeSessionId: hydrated ? activeSessionId : TELEMETRY_NO_SESSION,
      setActiveSessionId,
      selectSession,
      loadModalOpen,
      openLoadModal: () => setLoadModalOpen(true),
      closeLoadModal: () => setLoadModalOpen(false),
      sessionsModalOpen,
      openSessionsModal: () => setSessionsModalOpen(true),
      closeSessionsModal: () => setSessionsModalOpen(false),
      tracksModalOpen,
      openTracksModal: () => setTracksModalOpen(true),
      closeTracksModal: () => setTracksModalOpen(false),
      tracksRevision,
      notifyTracksChanged: () => setTracksRevision((n) => n + 1),
      loadedFileLabel,
      setLoadedFileLabel,
      immersive,
      immersiveRootRef,
      toggleImmersive,
      exitImmersive,
      heatMapEnabled,
      toggleHeatMap,
      setHeatMapEnabled,
    }),
    [
      activeSessionId,
      hydrated,
      immersive,
      loadModalOpen,
      sessionsModalOpen,
      tracksModalOpen,
      tracksRevision,
      loadedFileLabel,
      selectSession,
      setActiveSessionId,
      exitImmersive,
      toggleImmersive,
      heatMapEnabled,
      toggleHeatMap,
    ],
  );

  return (
    <TelemetryWorkspaceContext.Provider value={value}>
      {children}
    </TelemetryWorkspaceContext.Provider>
  );
}

export function useTelemetryWorkspace(): TelemetryWorkspaceValue {
  const ctx = useContext(TelemetryWorkspaceContext);
  if (!ctx) {
    throw new Error(
      "useTelemetryWorkspace deve ser usado dentro de TelemetryWorkspaceProvider",
    );
  }
  return ctx;
}
