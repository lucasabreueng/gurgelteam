"use client";

import { TelemetryServiceMock } from "@/services/telemetry/telemetryServiceMock";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { TelemetryLoadModal } from "../telemetry-load-modal";
import { TelemetrySessionsModal } from "../telemetry-sessions-modal";
import { TelemetryToolbar } from "../telemetry-toolbar";
import { TracksModal } from "./tracks/tracks-modal";
import { TelemetryWorkspaceProvider, useTelemetryWorkspace } from "./telemetry-workspace-context";

function TelemetryWorkspaceChrome({ children }: { children: ReactNode }) {
  const {
    activeSessionId,
    loadModalOpen,
    openLoadModal,
    closeLoadModal,
    sessionsModalOpen,
    openSessionsModal,
    closeSessionsModal,
    tracksModalOpen,
    openTracksModal,
    closeTracksModal,
    notifyTracksChanged,
    tracksRevision,
    setLoadedFileLabel,
    setActiveSessionId,
  } = useTelemetryWorkspace();

  const pathname = usePathname();
  const isLightPage =
    pathname === "/piloto/telemetria" ||
    pathname === "/piloto/telemetria/" ||
    pathname.startsWith("/piloto/telemetria/setores");

  return (
    <div
      className={
        isLightPage
          ? "flex h-full min-h-0 flex-col overflow-hidden bg-[#f3f5f9]"
          : "flex h-full min-h-0 flex-col overflow-hidden bg-[#0d1f3c]"
      }
    >
      <TelemetryToolbar
        onOpenLoad={openLoadModal}
        onOpenSessions={openSessionsModal}
        onOpenTracks={openTracksModal}
      />
      <TelemetryLoadModal
        open={loadModalOpen}
        onClose={closeLoadModal}
        tracksRevision={tracksRevision}
        onOpenTracks={openTracksModal}
        onImported={({ sessionId, fileName, device }) => {
          const deviceLabel =
            device === "gopro"
              ? "GoPro"
              : device === "alfano"
                ? "Alfano"
                : "MyChron";
          setLoadedFileLabel(`${deviceLabel}: ${fileName}`);
          setActiveSessionId(sessionId);
        }}
      />
      <TelemetrySessionsModal
        open={sessionsModalOpen}
        activeSessionId={activeSessionId}
        onClose={closeSessionsModal}
        onSelectProcessed={setActiveSessionId}
        onSessionRemoved={(removedId) => {
          if (activeSessionId === removedId) {
            setActiveSessionId(TelemetryServiceMock.getTelemetryDefaultSessionId());
            setLoadedFileLabel(null);
          }
        }}
      />
      <TracksModal
        open={tracksModalOpen}
        onClose={closeTracksModal}
        onChanged={notifyTracksChanged}
      />
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

export function TelemetryWorkspace({ children }: { children: ReactNode }) {
  return (
    <TelemetryWorkspaceProvider>
      <TelemetryWorkspaceChrome>{children}</TelemetryWorkspaceChrome>
    </TelemetryWorkspaceProvider>
  );
}
