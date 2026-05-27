export type {
  ColumnMapping,
  GpsLine,
  IdealLapResult,
  ImportPreviewData,
  LapSector,
  LineCrossing,
  PipelineProgress,
  ProcessedTelemetrySession,
  ProcessingStatus,
  RawCsvRow,
  SessionLap,
  TelemetryPoint,
  TelemetrySource,
  Track,
  TrackSectorConfig,
  ValidationIssue,
  LapQualityIssue,
} from "./types";

export { parseCsvContent, readFileAsText } from "./csv/parse-csv";
export { buildColumnMapping } from "./csv/column-mapper";

export { mychronAdapter } from "./adapters/mychron-adapter";
export { alfanoAdapter } from "./adapters/alfano-adapter";
export { genericGpsAdapter } from "./adapters/generic-gps-adapter";
export {
  detectAdapter,
  getAdapterById,
  normalizeWithAdapter,
  TELEMETRY_ADAPTERS,
} from "./adapters/registry";

export {
  TRACK_CATALOG,
  BUILTIN_TRACKS,
  TRACK_AYRTON_SENNA,
  getTrackById,
  getBuiltinTrackById,
  getDefaultTrack,
  detectBestTrack,
  cloneTrackLines,
} from "./tracks/catalog";

export {
  getAllTracks,
  getTrackByIdAsync,
  detectBestTrackAsync,
} from "./tracks/track-resolver";

export {
  listUserTracks,
  saveUserTrack,
  deleteUserTrack,
  getUserTrack,
} from "./tracks/user-track-store";

export {
  userTrackToEngineTrack,
  createTrackId,
  defaultLinesDraft,
  parseCoord,
  type UserTrackRecord,
} from "./tracks/user-track-types";

export { detectLineCrossings, buildLineDefinitions } from "./geometry/line-crossing";
export {
  haversineMeters,
  isValidGps,
  projectToLocal,
  unprojectFromLocal,
  offsetLine,
  computeBounds,
} from "./geometry/geo";

export {
  reconstructLapsAndSectors,
  validateTelemetryInput,
  computeLapDistance,
  MIN_LAP_TIME_SEC,
  MIN_GPS_POINTS,
} from "./processing/reconstruct";
export { diagnoseLapSectorIssues } from "./processing/lap-quality";
export {
  lapTrailCentroid,
  lapTrailPath,
  previewLapWithTraceOffset,
  commitTraceCorrectionsToPreview,
} from "./processing/lap-trace-correction";
export {
  calculateIdealLap,
  formatLapTime,
  formatSessionDate,
  formatSessionDateTime,
} from "./processing/ideal-lap";
export {
  processCsvFile,
  processCsvText,
  previewToSession,
  hasBlockingErrors,
  refreshLapMeta,
  type ProcessOptions,
} from "./processing/pipeline";
export { telemetryQueue } from "./processing/queue";

export {
  saveProcessedSession,
  getProcessedSession,
  listProcessedSessions,
  deleteProcessedSession,
  isProcessedSessionId,
} from "./storage/session-store";
export type { SessionListEntry } from "./storage/session-store";

export {
  chartSeriesForProcessedLap,
  processedSessionLapsList,
  processedSessionStats,
  gpsTrailForSession,
  gpsTrailForLap,
  gpsPositionAtLapDistance,
  maxSectorLengthM,
  sectorDistanceRange,
  type SectorFilter,
} from "./bridge/chart-data";
export { processedSessionToSectorsPage } from "./bridge/sectors-data";

export function createSessionId(): string {
  return `proc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
