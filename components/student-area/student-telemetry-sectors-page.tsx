"use client";

import { useCallback, useEffect, useState } from "react";
import { useSectorsPageData } from "./telemetry/use-telemetry-session-data";
import { useTelemetryWorkspace } from "./telemetry/telemetry-workspace-context";
import { SectorModuleCard } from "./telemetry/sectors/sector-module-card";
import { SectorsChartsSection } from "./telemetry/sectors/sectors-charts-section";
import { SectorsEmptyState } from "./telemetry/sectors/sectors-empty-state";
import { SectorsLapsTable } from "./telemetry/sectors/sectors-laps-table";
import { SectorsPageSkeleton } from "./telemetry/sectors/sectors-page-skeleton";
import { SectorsSessionHeader } from "./telemetry/sectors/sectors-session-header";
import { SECTION_TITLE } from "./telemetry/sectors/sectors-styles";

const LOAD_MS = 480;

/** Página dedicada de setores — `/piloto/telemetria/setores` */
export function StudentTelemetrySectorsPage() {
  const { activeSessionId, openSessionsModal } = useTelemetryWorkspace();
  const [loading, setLoading] = useState(true);
  const [selectedLaps, setSelectedLaps] = useState<number[]>([]);

  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), LOAD_MS);
    return () => window.clearTimeout(t);
  }, [activeSessionId]);

  const { data, loading: processedLoading } = useSectorsPageData(activeSessionId);

  const toggleLap = useCallback((lap: number) => {
    setSelectedLaps((prev) => {
      if (prev.includes(lap)) return prev.filter((l) => l !== lap);
      if (prev.length >= 2) return [prev[1], lap];
      return [...prev, lap];
    });
  }, []);

  const hasLaps = data.laps.some((l) => !l.invalid);

  if (loading || processedLoading) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f3f5f9]">
        <SectorsPageSkeleton />
      </div>
    );
  }

  if (!hasLaps) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f3f5f9]">
        <SectorsEmptyState onChangeSession={openSessionsModal} />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f3f5f9]">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="admin-page-stack p-4 md:p-6">
          <SectorsSessionHeader summary={data.summary} />

          <section>
            <h2 className={SECTION_TITLE}>Módulos de setor</h2>
            <div className="admin-page-grid mt-3 grid lg:grid-cols-3">
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
