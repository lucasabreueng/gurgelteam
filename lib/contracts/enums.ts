/**
 * Enums e unions de domínio — fonte única para mocks, contratos e (futuro) Prisma/API.
 * Valores alinhados a `docs/STATE_MACHINES.md` e `docs/ENTITY_CATALOG.md`.
 */

// --- Agenda / Schedule ---

export const SCHEDULE_EVENT_TYPES = [
  "aula_individual",
  "aula_grupo",
  "treino_livre",
  "treino_avancado",
  "telemetria",
  "manutencao",
  "reserva_kart",
  "bloqueio_pista",
] as const;

export type ScheduleEventType = (typeof SCHEDULE_EVENT_TYPES)[number];

export const SCHEDULE_EVENT_STATUSES = [
  "confirmado",
  "pendente",
  "em_andamento",
  "finalizado",
  "cancelado",
  "reagendado",
  "no_show",
  "aguardando_pagamento",
] as const;

export type ScheduleEventStatus = (typeof SCHEDULE_EVENT_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pago",
  "pendente",
  "vencido",
  "pacote",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const KART_SCHEDULE_STATUSES = [
  "disponivel",
  "reservado",
  "em_treino",
  "manutencao",
  "bloqueado_checklist",
] as const;

export type KartScheduleStatus = (typeof KART_SCHEDULE_STATUSES)[number];

// --- Frota / Karts ---

export const KART_OWNERSHIP_TYPES = ["rental", "client"] as const;

export type KartOwnership = (typeof KART_OWNERSHIP_TYPES)[number];

export const KART_STATUSES = [
  "disponivel",
  "em_treino",
  "reservado",
  "manutencao",
  "aguardando_peca",
  "indisponivel",
  "preparacao",
  "lavagem",
] as const;

export type KartStatus = (typeof KART_STATUSES)[number];

export const KART_OPERATIONAL_STATUSES = [
  "operacional",
  "atencao",
  "em_manutencao",
  "indisponivel",
] as const;

export type KartOperationalStatus = (typeof KART_OPERATIONAL_STATUSES)[number];

// --- Financeiro ---

export const RECEIVABLE_STATUSES = [
  "pago",
  "pendente",
  "vencido",
  "parcial",
] as const;

export type ReceivableStatus = (typeof RECEIVABLE_STATUSES)[number];

export const PACKAGE_CREDIT_STATUSES = [
  "ativo",
  "expirando",
  "esgotado",
] as const;

export type PackageCreditStatus = (typeof PACKAGE_CREDIT_STATUSES)[number];

// --- Clientes ---

export const CLIENT_STATUSES = ["Ativo", "Inativo"] as const;

export type ClientStatus = (typeof CLIENT_STATUSES)[number];

// --- Manutenção ---

export const SIMPLE_MAINTENANCE_STATUSES = [
  "pendente",
  "em_andamento",
  "concluida",
] as const;

export type SimpleMaintenanceStatus =
  (typeof SIMPLE_MAINTENANCE_STATUSES)[number];

export const CHECKLIST_FINAL_STATUSES = [
  "aprovado",
  "aprovado_ressalvas",
  "reprovado",
] as const;

export type ChecklistFinalStatus = (typeof CHECKLIST_FINAL_STATUSES)[number];

// --- Relatórios ---

export const REPORT_DOMAINS = [
  "operacional",
  "financeiro",
  "auditoria",
] as const;

export type ReportDomain = (typeof REPORT_DOMAINS)[number];

export const OPERATIONAL_REPORT_IDS = [
  "track_occupancy",
  "schedule_utilization",
  "pilot_performance",
  "fleet_usage",
  "maintenance_summary",
] as const;

export type OperationalReportId = (typeof OPERATIONAL_REPORT_IDS)[number];

export const FINANCIAL_REPORT_IDS = [
  "daily",
  "monthly",
  "service",
  "client",
  "kart",
  "costs",
  "delinq",
  "cashflow",
] as const;

export type FinancialReportId = (typeof FINANCIAL_REPORT_IDS)[number];

export const REPORT_RUN_STATUSES = [
  "pending",
  "processing",
  "completed",
  "failed",
] as const;

export type ReportRunStatus = (typeof REPORT_RUN_STATUSES)[number];

export const REPORT_EXPORT_FORMATS = ["pdf", "xlsx", "csv"] as const;

export type ReportExportFormat = (typeof REPORT_EXPORT_FORMATS)[number];

// --- Aulas (enum legado — valores string para compatibilidade UI) ---

export enum LessonStatus {
  SCHEDULED = "aguardando",
  IN_PROGRESS = "em_andamento",
  PENDING_REGISTRATION = "pendente_registro",
  COMPLETED = "concluida",
  CANCELLED = "cancelada",
}

export const LESSON_STATUS_VALUES = [
  LessonStatus.SCHEDULED,
  LessonStatus.IN_PROGRESS,
  LessonStatus.PENDING_REGISTRATION,
  LessonStatus.COMPLETED,
  LessonStatus.CANCELLED,
] as const;

// --- Telemetria ---

export enum TelemetryStatus {
  UPLOADED = "UPLOADED",
  PROCESSING = "PROCESSING",
  NORMALIZING = "NORMALIZING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

// --- Consentimentos ---

export const CONSENT_TYPES = ["terms", "privacy", "image"] as const;

export type ConsentType = (typeof CONSENT_TYPES)[number];

export enum ConsentStatus {
  ACCEPTED = "ACCEPTED",
  REVOKED = "REVOKED",
  PENDING = "PENDING",
}

// --- Identidade & permissões ---

export const ROLE_KEYS = [
  "admin",
  "recepcao",
  "financeiro",
  "mecanico",
] as const;

export type RoleKey = (typeof ROLE_KEYS)[number];

export const MODULE_KEYS = [
  "dashboard",
  "agenda",
  "registroAulas",
  "alunos",
  "equipe",
  "karts",
  "manutencao",
  "estoque",
  "telemetria",
  "financeiro",
  "relatorios",
  "configuracoes",
  "pilotoDashboard",
  "pilotoAgenda",
  "pilotoEvolucao",
  "pilotoFeedbacks",
  "pilotoPlano",
  "pilotoTelemetria",
  "pilotoResultados",
  "pilotoMateriais",
  "pilotoConquistas",
  "pilotoRanking",
] as const;

export type ModuleKey = (typeof MODULE_KEYS)[number];

/** Módulos do painel admin (exclui área piloto). */
export const ADMIN_MODULE_KEYS = [
  "dashboard",
  "agenda",
  "registroAulas",
  "alunos",
  "equipe",
  "karts",
  "manutencao",
  "estoque",
  "telemetria",
  "financeiro",
  "relatorios",
  "configuracoes",
] as const satisfies readonly ModuleKey[];

export const MODULE_GROUP_KEYS = ["admin", "piloto"] as const;

export type ModuleGroupKey = (typeof MODULE_GROUP_KEYS)[number];
