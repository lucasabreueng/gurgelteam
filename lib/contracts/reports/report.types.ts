/**
 * Contratos de relatórios — domínio `[PLANEJADO]`.
 * Sem rota `/admin/relatorios`; catálogo alvo em report-definitions.ts.
 * Relatórios financeiros parciais: ver `/admin/financeiro` (financial-reports-section).
 */
import type {
  FinancialReportId,
  OperationalReportId,
  ReportDomain,
  ReportExportFormat,
  ReportRunStatus,
} from "../enums";

/** Definição estática de um relatório (catálogo alvo — sem tela admin dedicada). */
export type ReportDefinitionDTO = {
  id: OperationalReportId | FinancialReportId | "audit_log";
  domain: ReportDomain;
  label: string;
  description: string;
  exportFormats: ReportExportFormat[];
};

/** Execução assíncrona de geração — Fase 4/5. */
export type ReportRunDTO = {
  id: string;
  definitionId: ReportDefinitionDTO["id"];
  periodFrom: string;
  periodTo: string;
  status: ReportRunStatus;
  generatedByUserId: string;
  fileUrl?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
};

/** Filtros comuns para relatórios operacionais. */
export type OperationalReportFilterDTO = {
  periodFrom: string;
  periodTo: string;
  categoryId?: string;
  exportFormat: ReportExportFormat;
};
