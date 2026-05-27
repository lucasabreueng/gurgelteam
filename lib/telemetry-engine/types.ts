/** Formato interno unificado de telemetria — independente da fonte */

export type ProcessingStatus =
  | "uploaded"
  | "parsing"
  | "normalizing"
  | "reconstructing_laps"
  | "calculating_sectors"
  | "completed"
  | "failed";

export type TelemetrySource = "mychron" | "alfano" | "gopro" | "generic_gps";

export type GpsLine = {
  latA: number;
  lonA: number;
  latB: number;
  lonB: number;
};

export type TrackSectorConfig = {
  sector: 1 | 2 | 3;
  /** Linha no fim do setor */
  endLine: GpsLine;
};

export type Track = {
  id: string;
  name: string;
  city?: string;
  isUserTrack?: boolean;
  length: number;
  center: { latitude: number; longitude: number };
  /** Linha de largada/chegada (= S1 nas pistas cadastradas pelo usuário) */
  startFinishLine: GpsLine;
  sectors: TrackSectorConfig[];
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
};

export type TelemetryPoint = {
  index: number;
  timestamp: number | null;
  sessionTime: number;
  latitude: number;
  longitude: number;
  speed: number | null;
  rpm: number | null;
  longitudinalG: number | null;
  lateralG: number | null;
  gyro: number | null;
  heading: number | null;
  altitude: number | null;
  rawDistance: number | null;
  lapDistance: number | null;
  lapNumber: number | null;
  sectorNumber: number | null;
};

export type LapSector = {
  sector: 1 | 2 | 3;
  sectorTime: number;
  startTime: number;
  endTime: number;
  avgSpeed: number | null;
  maxSpeed: number | null;
  avgRpm: number | null;
  avgLongitudinalG: number | null;
};

export type SessionLap = {
  lapNumber: number;
  lapTime: number;
  sectors: LapSector[];
  isValid: boolean;
  isOutLap: boolean;
  isIncomplete: boolean;
  startTime: number;
  endTime: number;
  startIndex: number;
  endIndex: number;
};

export type IdealLapResult = {
  bestS1: number;
  bestS2: number;
  bestS3: number;
  idealTime: number;
  bestRealLap: number;
  potentialGain: number;
};

export type LineCrossing = {
  lineId: "start_finish" | "sector_1" | "sector_2" | "sector_3";
  sessionTime: number;
  pointIndex: number;
  latitude: number;
  longitude: number;
};

export type ValidationIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

export type ProcessedTelemetrySession = {
  id: string;
  source: TelemetrySource;
  sourceFileName: string;
  trackId: string;
  trackName: string;
  status: ProcessingStatus;
  createdAt: string;
  dateLabel: string;
  adapterId: string;
  points: TelemetryPoint[];
  laps: SessionLap[];
  crossings: LineCrossing[];
  idealLap: IdealLapResult;
  validations: ValidationIssue[];
  /** Linhas efetivamente usadas (podem ter sido ajustadas no preview) */
  appliedLines: {
    startFinishLine: GpsLine;
    sectors: TrackSectorConfig[];
  };
  meta: {
    totalPoints: number;
    validLapCount: number;
    bestLapTime: number | null;
    averageLapTime: number | null;
    outLapDetected: boolean;
    incompleteLapDetected: boolean;
    traceCorrectedLapCount?: number;
  };
  lapIssues?: LapQualityIssue[];
  lapCorrections?: LapManualCorrection[];
};

export type RawCsvRow = Record<string, string>;

export type ColumnMapping = {
  timestamp?: string;
  sessionTime?: string;
  latitude?: string;
  longitude?: string;
  speed?: string;
  rpm?: string;
  longitudinalG?: string;
  lateralG?: string;
  gyro?: string;
  heading?: string;
  altitude?: string;
  rawDistance?: string;
};

export type ParseResult = {
  headers: string[];
  rows: RawCsvRow[];
  delimiter: string;
  headerRowIndex: number;
  skippedLines: number;
};

export type AdapterDetectResult = {
  adapterId: string;
  confidence: number;
  mapping: ColumnMapping;
};

export type PipelineProgress = {
  status: ProcessingStatus;
  percent: number;
  message: string;
};

export type LapQualityIssue = {
  lapNumber: number;
  missingSectors: (1 | 2 | 3)[];
  presentSectors: (1 | 2 | 3)[];
  lapTime: number;
  reason: string;
};

export type LapCorrectionAction =
  | { type: "trace_offset"; dLat: number; dLon: number }
  | { type: "exclude" };

export type LapManualCorrection = {
  lapNumber: number;
  action: LapCorrectionAction;
};

export type ImportPreviewData = {
  source: TelemetrySource;
  sourceFileName: string;
  adapterId: string;
  trackId: string;
  trackName: string;
  points: TelemetryPoint[];
  laps: SessionLap[];
  crossings: LineCrossing[];
  validations: ValidationIssue[];
  appliedLines: ProcessedTelemetrySession["appliedLines"];
  meta: ProcessedTelemetrySession["meta"];
  /** Voltas sem S1/S2/S3 — corrigir arrastando o traçado */
  lapIssues: LapQualityIssue[];
  lapCorrections: LapManualCorrection[];
};
