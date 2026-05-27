"use client";

import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";
import type { TelemetryPilotSession } from "@/lib/contracts/student-area";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getStoredTelemetrySessionId,
  setStoredTelemetrySessionId,
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
};

const TelemetryWorkspaceContext = createContext<TelemetryWorkspaceValue | null>(
  null,
);

export function TelemetryWorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeSessionId, setActiveSessionIdState] = useState(
    TelemetryServiceMock.getTelemetryDefaultSessionId(),
  );
  const [hydrated, setHydrated] = useState(false);
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [sessionsModalOpen, setSessionsModalOpen] = useState(false);
  const [tracksModalOpen, setTracksModalOpen] = useState(false);
  const [tracksRevision, setTracksRevision] = useState(0);
  const [loadedFileLabel, setLoadedFileLabel] = useState<string | null>(null);

  useEffect(() => {
    setActiveSessionIdState(getStoredTelemetrySessionId());
    setHydrated(true);
  }, []);

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
      activeSessionId: hydrated ? activeSessionId : TelemetryServiceMock.getTelemetryDefaultSessionId(),
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
    }),
    [
      activeSessionId,
      hydrated,
      loadModalOpen,
      sessionsModalOpen,
      tracksModalOpen,
      tracksRevision,
      loadedFileLabel,
      selectSession,
      setActiveSessionId,
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
