import { z } from "zod";

import {
  FINANCIAL_REPORT_IDS,
  OPERATIONAL_REPORT_IDS,
  REPORT_DOMAINS,
  REPORT_EXPORT_FORMATS,
  REPORT_RUN_STATUSES,
} from "../../enums";
import { zIsoDate, zUuid } from "../common.schemas";

export const zReportDomain = z.enum(REPORT_DOMAINS);
export const zReportExportFormat = z.enum(REPORT_EXPORT_FORMATS);
export const zReportRunStatus = z.enum(REPORT_RUN_STATUSES);

export const operationalReportIdSchema = z.enum(OPERATIONAL_REPORT_IDS);
export const financialReportIdSchema = z.enum(FINANCIAL_REPORT_IDS);

export const reportDefinitionIdSchema = z.union([
  operationalReportIdSchema,
  financialReportIdSchema,
  z.literal("audit_log"),
]);

export const createReportRunSchema = z
  .object({
    definitionId: reportDefinitionIdSchema,
    periodFrom: zIsoDate,
    periodTo: zIsoDate,
    exportFormat: zReportExportFormat,
    categoryId: zUuid.optional(),
    clientId: zUuid.optional(),
  })
  .refine((v) => v.periodTo >= v.periodFrom, {
    message: "periodTo deve ser >= periodFrom.",
    path: ["periodTo"],
  });

export type CreateReportRunRequest = z.infer<typeof createReportRunSchema>;

export const reportRunSchema = z.object({
  id: zUuid,
  definitionId: reportDefinitionIdSchema,
  domain: zReportDomain,
  periodFrom: zIsoDate,
  periodTo: zIsoDate,
  exportFormat: zReportExportFormat,
  status: zReportRunStatus,
  fileUrl: z.string().url().nullable().optional(),
  errorMessage: z.string().nullable().optional(),
  generatedByUserId: zUuid,
  createdAt: zIsoDate,
  completedAt: z.string().nullable().optional(),
});

export type ReportRunApiDTO = z.infer<typeof reportRunSchema>;

export const reportRunsQuerySchema = z.object({
  status: zReportRunStatus.optional(),
  domain: zReportDomain.optional(),
  definitionId: reportDefinitionIdSchema.optional(),
});
