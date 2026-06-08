import { getDataSourceMode } from "@/lib/data-source/mode";
import { TelemetryRepositoryHttp } from "@/repositories/telemetry/TelemetryRepositoryHttp";
import { StudentAreaRepositoryMock } from "@/repositories/student/StudentAreaRepositoryMock";
import { SectorsRepositoryMock } from "@/repositories/telemetry/SectorsRepositoryMock";
import { listUserTracks } from "@/lib/telemetry-engine/tracks/user-track-store";
import { mapTelemetrySessionToPilotSession } from "@/services/telemetry/map-telemetry-api";
import { apiSessionToSectorsPage } from "@/lib/telemetry-engine/bridge/api-sectors-data";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

export function createTelemetryService() {
  return {
    listUserTracks,
    listSessions: () =>
      isHttpMode()
        ? TelemetryRepositoryHttp.listSessions()
        : Promise.resolve([]),
    getTelemetryDeviceOptions: StudentAreaRepositoryMock.getTelemetryDeviceOptions,
    getTelemetryStats: StudentAreaRepositoryMock.getTelemetryStats,
    getTelemetryPilotSessions: () =>
      isHttpMode()
        ? TelemetryRepositoryHttp.listSessions().then((sessions) =>
            sessions.map(mapTelemetrySessionToPilotSession),
          )
        : StudentAreaRepositoryMock.getTelemetryPilotSessions(),
    getTelemetryDefaultSessionId: () =>
      isHttpMode()
        ? TelemetryRepositoryHttp.listSessions().then((s) => s[0]?.id ?? null)
        : Promise.resolve(StudentAreaRepositoryMock.getTelemetryDefaultSessionId()),
    getTelemetryPilotSession: (sessionId: string) =>
      isHttpMode()
        ? TelemetryRepositoryHttp.getSessionById(sessionId).then(
            mapTelemetrySessionToPilotSession,
          )
        : StudentAreaRepositoryMock.getTelemetryPilotSession(sessionId),
    getSectorsPageDataFromApi: (sessionId: string) =>
      isHttpMode()
        ? TelemetryRepositoryHttp.getSessionById(sessionId).then((s) =>
            apiSessionToSectorsPage(s),
          )
        : Promise.resolve(null),
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
}

export type TelemetryService = ReturnType<typeof createTelemetryService>;
export const TelemetryServiceMock = createTelemetryService();
