import { z } from "zod";

import { LESSON_STATUS_VALUES } from "../../enums";
import { zIsoDate, zTimeHHmm, zUuid } from "../common.schemas";

export const zLessonStatus = z.enum(LESSON_STATUS_VALUES);

export const lapRowSchema = z.object({
  id: z.string(),
  lap: z.number().int().positive(),
  s1: z.string(),
  s2: z.string(),
  s3: z.string(),
  total: z.string(),
});

export const gurgelSessionNotesSchema = z.object({
  positives: z.string().default(""),
  improvements: z.string().default(""),
  recommendations: z.string().default(""),
  general: z.string().default(""),
});

export const lessonRegistrationPayloadSchema = z.object({
  laps: z.array(lapRowSchema),
  notes: gurgelSessionNotesSchema,
  method: z.enum(["ocr", "telemetry", "manual"]),
  telemetrySessionId: zUuid.nullable().optional(),
  registeredAt: z.string(),
});

export type LessonRegistrationPayloadApiDTO = z.infer<
  typeof lessonRegistrationPayloadSchema
>;

export const lessonSessionSchema = z.object({
  id: zUuid,
  scheduleEventId: zUuid,
  clientId: zUuid.nullable().optional(),
  studentName: z.string(),
  date: zIsoDate,
  start: zTimeHHmm,
  end: zTimeHHmm,
  category: z.string(),
  typeLabel: z.string(),
  registeredByName: z.string(),
  kartNumber: z.number().int(),
  status: zLessonStatus,
  objective: z.string().nullable().optional(),
  previousNote: z.string().nullable().optional(),
  registration: lessonRegistrationPayloadSchema.nullable().optional(),
});

export type LessonSessionApiDTO = z.infer<typeof lessonSessionSchema>;

export const lessonRegistrationQuerySchema = z.object({
  date: zIsoDate,
  days: z.coerce.number().int().min(1).max(7).optional(),
  statusFilter: z
    .enum(["", "pendentes", "em_andamento", "concluidas"])
    .default(""),
  category: z.string().default(""),
  search: z.string().default(""),
});

export type LessonRegistrationQuery = z.infer<
  typeof lessonRegistrationQuerySchema
>;

export const lessonRegistrationSchema = z.object({
  sessionId: zUuid,
  laps: z.array(lapRowSchema).min(1),
  notes: gurgelSessionNotesSchema,
  method: z.enum(["ocr", "telemetry", "manual"]),
  telemetrySessionId: zUuid.optional(),
});

export type LessonRegistrationRequest = z.infer<
  typeof lessonRegistrationSchema
>;

/** Resposta OCR — alinhada a `app/api/admin/lesson-registration/ocr`. */
export const ocrLapResultSchema = z.object({
  lap: z.number().int().positive(),
  s1: z.string(),
  s2: z.string(),
  s3: z.string(),
  total: z.string(),
});

export const ocrSuccessResponseSchema = z.object({
  laps: z.array(ocrLapResultSchema),
});

export const ocrErrorResponseSchema = z.object({
  error: z.string(),
  hint: z.string().optional(),
  debug: z.string().optional(),
});

export const startLessonSchema = z.object({
  kartId: zUuid.optional(),
});

export const lessonRegistrationSavedSchema = z.object({
  sessionId: zUuid,
  status: zLessonStatus,
  lapsCount: z.number().int().min(1),
});
