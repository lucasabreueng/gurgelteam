import type { TelemetryStatus } from "../enums";

export type TelemetryPointDTO = {
  index: number;
  sessionTime: number;
  latitude: number;
  longitude: number;
  speed?: number | null;
  rpm?: number | null;
};

export type SectorDTO = {
  sector: 1 | 2 | 3;
  sectorTime: number;
  startTime: number;
  endTime: number;
  avgSpeed?: number | null;
  maxSpeed?: number | null;
};

export type LapDTO = {
  lapNumber: number;
  lapTime: number;
  sectors: SectorDTO[];
  isValid: boolean;
};

export type TelemetrySessionDTO = {
  id: string;
  source: string;
  trackId: string;
  trackName: string;
  status: TelemetryStatus;
  sourceFileName: string;
  createdAt?: string;
  dateLabel?: string;

  points: TelemetryPointDTO[];
  laps: LapDTO[];
};

// Opcao compacta usada no fluxo de vincular telemetria ao registro de aula
export type TelemetrySessionOptionDTO = {
  id: string;
  pilotName: string;
  date: string;
  device: string;
  bestLap: string;
  consistency: number;
  idealLap: string;
  lapCount: number;
};

