"use client";

import { TELEMETRY_NO_SESSION } from "@/lib/telemetry-active-session";

import type { ReactNode } from "react";

import { TelemetryLoadModal } from "../telemetry-load-modal";
import { TelemetrySessionsModal } from "../telemetry-sessions-modal";
import { TelemetryToolbar } from "../telemetry-toolbar";
import { TracksModal } from "./tracks/tracks-modal";
import { useTelemetryWorkspace } from "./telemetry-workspace-context";
import { telemetryWorkspaceBgClass } from "@/lib/design";

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

  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden ${telemetryWorkspaceBgClass}`}
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
            setActiveSessionId(TELEMETRY_NO_SESSION);
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
  return <TelemetryWorkspaceChrome>{children}</TelemetryWorkspaceChrome>;
}
