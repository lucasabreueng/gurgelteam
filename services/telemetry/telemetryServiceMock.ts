import { listUserTracks } from "@/lib/telemetry-engine/tracks/user-track-store";
import { StudentAreaRepositoryMock } from "@/repositories/student/StudentAreaRepositoryMock";
import { SectorsRepositoryMock } from "@/repositories/telemetry/SectorsRepositoryMock";

export const TelemetryServiceMock = {
  listUserTracks,
  getTelemetryDeviceOptions: StudentAreaRepositoryMock.getTelemetryDeviceOptions,
  getTelemetryStats: StudentAreaRepositoryMock.getTelemetryStats,
  getTelemetryPilotSessions: StudentAreaRepositoryMock.getTelemetryPilotSessions,
  getTelemetryDefaultSessionId:
    StudentAreaRepositoryMock.getTelemetryDefaultSessionId,
  getTelemetryPilotSession: StudentAreaRepositoryMock.getTelemetryPilotSession,
  getTelemetrySectorsForSession:
    StudentAreaRepositoryMock.getTelemetrySectorsForSession,
  getTelemetryChartMetrics: StudentAreaRepositoryMock.getTelemetryChartMetrics,
  getTelemetryTabs: StudentAreaRepositoryMock.getTelemetryTabs,
  getTelemetryLapColors: StudentAreaRepositoryMock.getTelemetryLapColors,
  getTelemetryChartGroup: StudentAreaRepositoryMock.getTelemetryChartGroup,
  getTelemetryTrackMap: StudentAreaRepositoryMock.getTelemetryTrackMap,
  getTelemetryTrackLengthM: StudentAreaRepositoryMock.getTelemetryTrackLengthM,
  getTelemetryDistanceM: StudentAreaRepositoryMock.getTelemetryDistanceM,
  getTelemetryYAxis: StudentAreaRepositoryMock.getTelemetryYAxis,
  getTelemetryChartByTab: StudentAreaRepositoryMock.getTelemetryChartByTab,
  getTelemetrySessionLaps: StudentAreaRepositoryMock.getTelemetrySessionLaps,
  telemetrySeriesForLap: StudentAreaRepositoryMock.telemetrySeriesForLap,
  telemetryLapSeries: StudentAreaRepositoryMock.telemetryLapSeries,
  telemetryYExtentForLaps: StudentAreaRepositoryMock.telemetryYExtentForLaps,
  telemetrySharedYExtent: StudentAreaRepositoryMock.telemetrySharedYExtent,
  getSectorsPageData: SectorsRepositoryMock.getSectorsPageData,
  parseSectorTime: SectorsRepositoryMock.parseSectorTime,
  formatSectorTime: SectorsRepositoryMock.formatSectorTime,
  formatDelta: SectorsRepositoryMock.formatDelta,
  getLapCellHighlight: SectorsRepositoryMock.getLapCellHighlight,
  compareLaps: SectorsRepositoryMock.compareLaps,
};

export type { TelemetryDeviceType } from "@/lib/contracts/student-area";
