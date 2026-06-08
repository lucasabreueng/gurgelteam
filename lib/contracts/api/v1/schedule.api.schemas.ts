import { z } from "zod";

import {
  PAYMENT_STATUSES,
  SCHEDULE_EVENT_STATUSES,
  SCHEDULE_EVENT_TYPES,
} from "../../enums";
import { zIsoDate, zIsoDateTime, zTimeHHmm, zUuid } from "../common.schemas";

export const zScheduleEventType = z.enum(SCHEDULE_EVENT_TYPES);
export const zScheduleEventStatus = z.enum(SCHEDULE_EVENT_STATUSES);
export const zPaymentStatus = z.enum(PAYMENT_STATUSES);

export const scheduleEventSchema = z.object({
  id: zUuid,
  startsAt: zIsoDateTime,
  endsAt: zIsoDateTime,
  type: zScheduleEventType,
  typeLabel: z.string(),
  status: zScheduleEventStatus,
  clientId: zUuid.nullable().optional(),
  clientName: z.string().nullable().optional(),
  registeredById: zUuid.nullable().optional(),
  registeredByName: z.string().nullable().optional(),
  kartId: zUuid.nullable().optional(),
  kartNumber: z.number().int().nullable().optional(),
  categoryId: zUuid.nullable().optional(),
  categoryLabel: z.string().nullable().optional(),
  paymentStatus: zPaymentStatus.nullable().optional(),
  maxStudents: z.number().int().positive().nullable().optional(),
  notes: z.string().nullable().optional(),
  objective: z.string().nullable().optional(),
  createdAt: zIsoDateTime.optional(),
  updatedAt: zIsoDateTime.optional(),
});

export type ScheduleEventDTO = z.infer<typeof scheduleEventSchema>;

export const scheduleEventsQuerySchema = z.object({
  from: zIsoDate.optional(),
  to: zIsoDate.optional(),
  status: zScheduleEventStatus.optional(),
  type: zScheduleEventType.optional(),
  clientId: zUuid.optional(),
  kartId: zUuid.optional(),
});

export type ScheduleEventsQuery = z.infer<typeof scheduleEventsQuerySchema>;

const scheduleEventWriteFieldsSchema = z.object({
  startsAt: zIsoDateTime,
  endsAt: zIsoDateTime,
  type: zScheduleEventType,
  clientId: zUuid.optional(),
  kartId: zUuid.optional(),
  categoryId: zUuid.optional(),
  maxStudents: z.number().int().positive().optional(),
  notes: z.string().optional(),
  objective: z.string().optional(),
});

function endsAfterStartsRefine(v: { startsAt?: string; endsAt?: string }) {
  if (!v.startsAt || !v.endsAt) return true;
  return new Date(v.endsAt) > new Date(v.startsAt);
}

export const createScheduleEventSchema = scheduleEventWriteFieldsSchema.refine(
  endsAfterStartsRefine,
  {
    message: "endsAt deve ser posterior a startsAt.",
    path: ["endsAt"],
  },
);

export type CreateScheduleEventRequest = z.infer<
  typeof createScheduleEventSchema
>;

export const updateScheduleEventSchema = scheduleEventWriteFieldsSchema
  .partial()
  .extend({
    status: zScheduleEventStatus.optional(),
    paymentStatus: zPaymentStatus.optional(),
  })
  .refine(endsAfterStartsRefine, {
    message: "endsAt deve ser posterior a startsAt.",
    path: ["endsAt"],
  });

export type UpdateScheduleEventRequest = z.infer<
  typeof updateScheduleEventSchema
>;

export const scheduleBlockSchema = z.object({
  id: zUuid,
  blockDate: zIsoDate,
  slotIds: z.array(z.string()),
  reason: z.string().nullable().optional(),
  fullDay: z.boolean(),
});

export type ScheduleBlockDTO = z.infer<typeof scheduleBlockSchema>;

export const createScheduleBlockSchema = z.object({
  blockDate: zIsoDate,
  slotIds: z.array(z.string()).min(1),
  reason: z.string().optional(),
  fullDay: z.boolean().default(false),
});

export const rescheduleEventSchema = z.object({
  startsAt: zIsoDateTime,
  endsAt: zIsoDateTime,
  kartId: zUuid.optional(),
  reason: z.string().optional(),
});

export type RescheduleEventRequest = z.infer<typeof rescheduleEventSchema>;

export const swapKartSchema = z.object({
  kartId: zUuid,
  reason: z.string().optional(),
});

export const upcomingDaysQuerySchema = z.object({
  from: zIsoDate.optional(),
  days: z.coerce.number().int().min(1).max(14).default(7),
});

export const scheduleBlocksQuerySchema = z.object({
  from: zIsoDate.optional(),
  to: zIsoDate.optional(),
});

export const scheduleSlotsQuerySchema = z.object({
  date: zIsoDate,
});

export const scheduleSlotUiSchema = z.object({
  id: z.string(),
  start: zTimeHHmm,
  end: zTimeHHmm,
  categoryIds: z.array(z.string()).min(1),
  levelIds: z.array(z.string()).min(1),
});

export type ScheduleSlotUiDTO = z.infer<typeof scheduleSlotUiSchema>;

export const scheduleSlotsForDateSchema = z.object({
  slots: z.array(scheduleSlotUiSchema),
  configBlockedSlotIds: z.array(z.string()),
});

export type ScheduleSlotsForDateDTO = z.infer<typeof scheduleSlotsForDateSchema>;

export const zWeekDayKey = z.enum([
  "dom",
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
  "sab",
]);

export const weekScheduleDaySchema = z.object({
  dayKey: zWeekDayKey,
  label: z.string(),
  shortLabel: z.string(),
  slots: z.array(scheduleSlotUiSchema),
});

export type WeekScheduleDayDTO = z.infer<typeof weekScheduleDaySchema>;

export const replaceWeekScheduleSchema = z.object({
  days: z.array(weekScheduleDaySchema).min(1).max(7),
});

export type ReplaceWeekScheduleRequest = z.infer<
  typeof replaceWeekScheduleSchema
>;

export const specificDateScheduleSchema = z.object({
  id: z.string(),
  date: zIsoDate,
  slots: z.array(scheduleSlotUiSchema),
});

export type SpecificDateScheduleDTO = z.infer<
  typeof specificDateScheduleSchema
>;

export const scheduleExceptionSchema = z.object({
  id: z.string(),
  date: zIsoDate,
  slotIds: z.array(z.string()),
  reason: z.string().optional().default(""),
});

export type ScheduleExceptionDTO = z.infer<typeof scheduleExceptionSchema>;

export const scheduleHoursConfigSchema = z.object({
  days: z.array(weekScheduleDaySchema).min(1).max(7),
  specificDates: z.array(specificDateScheduleSchema),
  exceptions: z.array(scheduleExceptionSchema),
});

export type ScheduleHoursConfigDTO = z.infer<typeof scheduleHoursConfigSchema>;

export const replaceScheduleHoursSchema = z.object({
  days: z.array(weekScheduleDaySchema).min(1).max(7),
  specificDates: z.array(specificDateScheduleSchema).optional(),
  exceptions: z.array(scheduleExceptionSchema).optional(),
});

export const cancelEventSchema = z.object({
  reason: z.string().optional(),
});

/** Compatível com rotas legadas `/api/admin/schedule/*` (date + start/end). */
export const legacyScheduleEventSchema = scheduleEventSchema.extend({
  date: zIsoDate,
  start: zTimeHHmm,
  end: zTimeHHmm,
  student: z.string(),
  payment: zPaymentStatus,
});
