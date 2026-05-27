export enum LessonStatus {
  // Mapeamento para compatibilidade com o status legada no frontend
  // (sera substituido por enums backend-first no futuro).
  SCHEDULED = "aguardando",
  CONFIRMED = "pendente_registro",
  IN_PROGRESS = "em_andamento",
  PENDING_REGISTRATION = "pendente_registro",
  COMPLETED = "concluida",
  CANCELLED = "cancelada",
}

export enum TelemetryStatus {
  UPLOADED = "UPLOADED",
  PROCESSING = "PROCESSING",
  NORMALIZING = "NORMALIZING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum ConsentStatus {
  ACCEPTED = "ACCEPTED",
  REVOKED = "REVOKED",
  PENDING = "PENDING",
}

