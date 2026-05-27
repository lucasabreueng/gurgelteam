/** Página de setores (telemetria) — via TelemetryServiceMock */
export type {
  SectorId,
  SectorPerformance,
  SectorsLapRecord,
  SectorModuleData,
  SectorsInsight,
  SectorsPageSummary,
  IdealLapData,
  TrackMapSegment,
  SectorsPageData,
  LapCellHighlight,
} from "@/lib/telemetry-sectors-mocks";

export {
  parseSectorTime,
  formatSectorTime,
  formatDelta,
} from "@/lib/telemetry-sectors-mocks";
