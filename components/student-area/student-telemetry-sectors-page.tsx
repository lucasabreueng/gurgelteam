"use client";

import { useCallback, useEffect, useState } from "react";
import { TELEMETRY_NO_SESSION } from "@/lib/telemetry-active-session";
import { useSectorsPageData } from "./telemetry/use-telemetry-session-data";
import { useTelemetryWorkspace } from "./telemetry/telemetry-workspace-context";
import { SectorModuleCard } from "./telemetry/sectors/sector-module-card";
import { SectorsChartsSection } from "./telemetry/sectors/sectors-charts-section";
import { SectorsLapsTable } from "./telemetry/sectors/sectors-laps-table";
import { SectorsPageSkeleton } from "./telemetry/sectors/sectors-page-skeleton";
import { SectorsSessionHeader } from "./telemetry/sectors/sectors-session-header";
import { TelemetryEmptyState } from "./telemetry/telemetry-empty-state";
import { SECTION_TITLE } from "./telemetry/sectors/sectors-styles";
import { telemetryWorkspaceBgClass } from "@/lib/design";

/** Página dedicada de setores — `/piloto/telemetria/setores` */
export function StudentTelemetrySectorsPage() {
  const { activeSessionId, openSessionsModal, openLoadModal } =
    useTelemetryWorkspace();
  const [selectedLaps, setSelectedLaps] = useState<number[]>([]);

  const { data, loading: processedLoading } = useSectorsPageData(activeSessionId);

  const toggleLap = useCallback((lap: number) => {
    setSelectedLaps((prev) => {
      if (prev.includes(lap)) return prev.filter((l) => l !== lap);
      if (prev.length >= 2) return [prev[1], lap];
      return [...prev, lap];
    });
  }, []);

  useEffect(() => {
    setSelectedLaps([]);
  }, [activeSessionId]);

  if (!activeSessionId || activeSessionId === TELEMETRY_NO_SESSION) {
    return (
      <div className={`flex h-full min-h-0 flex-col overflow-hidden ${telemetryWorkspaceBgClass}`}>
        <TelemetryEmptyState
          onOpenSessions={openSessionsModal}
          onOpenLoad={openLoadModal}
        />
      </div>
    );
  }

  if (processedLoading) {
    return (
      <div className={`flex h-full min-h-0 flex-col overflow-hidden ${telemetryWorkspaceBgClass}`}>
        <SectorsPageSkeleton />
      </div>
    );
  }

  if (!data || !data.laps.some((l) => !l.invalid)) {
    return (
      <div className={`flex h-full min-h-0 flex-col overflow-hidden ${telemetryWorkspaceBgClass}`}>
        <TelemetryEmptyState
          onOpenSessions={openSessionsModal}
          onOpenLoad={openLoadModal}
        />
      </div>
    );
  }

  return (
    <div className="telemetry-sectors-page flex h-full min-h-0 flex-col overflow-hidden bg-[#f3f5f9]">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="telemetry-sectors-stack admin-page-stack p-4 md:p-6">
          <SectorsSessionHeader summary={data.summary} />

          <section>
            <h2 className={SECTION_TITLE}>Módulos de setor</h2>
            <div className="telemetry-sectors-modules-grid admin-page-grid mt-3 grid sm:grid-cols-2 lg:grid-cols-3">
              {data.sectors.map((sector) => (
                <SectorModuleCard key={sector.id} sector={sector} />
              ))}
            </div>
          </section>

          <SectorsChartsSection
            lapEvolution={data.lapEvolution}
            cumulativeDelta={data.cumulativeDelta}
            laps={data.laps}
          />

          <SectorsLapsTable
            laps={data.laps}
            selectedLaps={selectedLaps}
            onToggleLap={toggleLap}
          />
        </div>
      </div>
    </div>
  );
}
