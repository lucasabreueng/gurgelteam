import { z } from "zod";

import {
  zClientAvatarUrlNullable,
  zIsoDate,
  zIsoDateTime,
  zTimeHHmm,
  zUuid,
} from "../common.schemas";
import { upsertConsentSchema } from "./consents.api.schemas";

export const pilotDashboardSchema = z.object({
  clientId: zUuid,
  nextEvents: z.array(
    z.object({
      id: zUuid,
      date: zIsoDate,
      start: zTimeHHmm,
      typeLabel: z.string(),
      status: z.string(),
    }),
  ),
  kpis: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      value: z.string(),
    }),
  ),
});

export const pilotProfileSchema = z.object({
  id: zUuid,
  name: z.string(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  avatarUrl: zClientAvatarUrlNullable.optional(),
  birthDate: zIsoDate.nullable().optional(),
  cpf: z.string().nullable().optional(),
  weightKg: z.string().nullable().optional(),
  heightCm: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  notifyWhatsapp: z.boolean().optional(),
  notifyEmail: z.boolean().optional(),
  emergencyName: z.string().nullable().optional(),
  emergencyPhone: z.string().nullable().optional(),
  emergencyRelation: z.string().nullable().optional(),
  favoriteNumber: z.string().nullable().optional(),
  categoryIds: z.array(zUuid),
  categorySlugs: z.array(z.string()),
  skillLevelId: zUuid,
  skillLevelSlug: z.string(),
  isMinor: z.boolean(),
});

export const updatePilotProfileSchema = pilotProfileSchema
  .pick({
    name: true,
    email: true,
    phone: true,
    avatarUrl: true,
    weightKg: true,
    heightCm: true,
    city: true,
    state: true,
    notifyWhatsapp: true,
    notifyEmail: true,
    emergencyName: true,
    emergencyPhone: true,
    emergencyRelation: true,
    favoriteNumber: true,
  })
  .partial();

export const pilotScheduleQuerySchema = z.object({
  from: zIsoDate.optional(),
  to: zIsoDate.optional(),
});

export const pilotFinanceQuerySchema = z.object({
  status: z.string().optional(),
});

export const pilotConsentRequestSchema = upsertConsentSchema;

export const pilotTelemetryQuerySchema = z.object({
  from: zIsoDateTime.optional(),
  to: zIsoDateTime.optional(),
});

export const pilotActiveSessionSchema = z.object({
  id: zUuid,
  device: z.string(),
  deviceKind: z.enum(["desktop", "mobile", "tablet"]),
  browser: z.string(),
  lastActive: z.string(),
  current: z.boolean().optional(),
});

export const pilotLinkedPilotCardSchema = z.object({
  profileId: zUuid,
  fullName: z.string(),
  avatarUrl: z.string(),
  category: z.string(),
  level: z.string(),
  nextTraining: z.string(),
  bestTime: z.string(),
});

export const pilotLegalDocumentSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const pilotProfileExtrasSchema = z.object({
  privacyAcceptedAt: z.string().optional(),
  termsAcceptedAt: z.string().optional(),
  mediaConsentAccepted: z.boolean().optional(),
  mediaAcceptedAt: z.string().optional(),
  mediaRevokedAt: z.string().optional(),
});

export const pilotLinkedProfileSchema = pilotProfileSchema.extend({
  guardianName: z.string().optional(),
  guardianEmail: z.string().nullable().optional(),
  guardianPhone: z.string().nullable().optional(),
  guardianRelationship: z.string().optional(),
});

export const pilotAccountSchema = z.object({
  profile: pilotProfileSchema.merge(pilotProfileExtrasSchema),
  linkedPilots: z.array(pilotLinkedPilotCardSchema),
  linkedProfiles: z.array(pilotLinkedProfileSchema).optional(),
  sessions: z.array(pilotActiveSessionSchema),
  legalDocuments: z.object({
    privacy: pilotLegalDocumentSchema.optional(),
    terms: pilotLegalDocumentSchema.optional(),
    media: pilotLegalDocumentSchema.optional(),
  }),
});

export const registerLinkedPilotSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    username: z.string().min(3),
    birthDate: z.string().min(8),
    cpf: z.string().min(11),
    city: z.string().min(1),
    state: z.string().min(2),
    phone: z.string().optional(),
    relationship: z.string().min(1),
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres.")
      .refine((v) => !v.includes(" "), "Senha não pode conter espaços."),
    confirmPassword: z.string().min(8),
    avatarUrl: zClientAvatarUrlNullable.optional(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const setLinkedPilotPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres.")
      .refine((v) => !v.includes(" "), "Senha não pode conter espaços."),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type PilotDashboardApiDTO = z.infer<typeof pilotDashboardSchema>;
export type PilotProfileApiDTO = z.infer<typeof pilotProfileSchema>;
export type UpdatePilotProfileRequest = z.infer<typeof updatePilotProfileSchema>;
export type PilotAccountApiDTO = z.infer<typeof pilotAccountSchema>;
export type RegisterLinkedPilotRequest = z.infer<typeof registerLinkedPilotSchema>;
export type SetLinkedPilotPasswordRequest = z.infer<
  typeof setLinkedPilotPasswordSchema
>;

export const pilotEvolutionPointSchema = z.object({
  sessionDate: z.string(),
  seconds: z.number(),
});

export const pilotEvolutionSchema = z.object({
  lapSeries: z.array(pilotEvolutionPointSchema),
  goal: z.object({
    title: z.string(),
    description: z.string(),
    targetLap: z.string(),
    currentBest: z.string(),
    deadlineLabel: z.string(),
    deadlineIso: z.string(),
    progressPercent: z.number(),
  }),
});

export const pilotAchievementSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  category: z.enum(["participacao", "evolucao", "desempenho", "consistencia"]),
  unlocked: z.boolean(),
});

export const pilotAchievementsSchema = z.object({
  achievements: z.array(pilotAchievementSchema),
});

export const pilotBookingSlotsQuerySchema = z.object({
  date: zIsoDate,
});

export const pilotBookingEligiblePilotSchema = z.object({
  clientId: zUuid,
  fullName: z.string(),
  avatarUrl: z.string().optional(),
  categoryName: z.string(),
  levelName: z.string(),
});

export const pilotBookingSlotSchema = z.object({
  slotId: z.string(),
  time: zTimeHHmm,
  end: zTimeHHmm,
  durationMinutes: z.number(),
  durationLabel: z.string(),
  status: z.enum([
    "available",
    "busy",
    "break",
    "conflict",
    "level_mismatch",
  ]),
  title: z.string(),
  detail: z.string().optional(),
  categoryName: z.string(),
  levelName: z.string(),
  eligiblePilots: z.array(pilotBookingEligiblePilotSchema),
});

export const pilotBookingSlotsSchema = z.object({
  date: zIsoDate,
  dateLabel: z.string(),
  slots: z.array(pilotBookingSlotSchema),
});

export const pilotBookingConfirmRequestSchema = z.object({
  date: zIsoDate,
  slotId: z.string().min(1),
  clientIds: z.array(zUuid).min(1),
});

export const pilotBookingConfirmEntrySchema = z.object({
  clientId: zUuid,
  clientName: z.string(),
  eventId: zUuid,
  kartNumber: z.number().int().optional(),
});

export const pilotBookingConfirmResponseSchema = z.object({
  eventId: zUuid,
  message: z.string(),
  date: zIsoDate,
  time: zTimeHHmm,
  end: zTimeHHmm,
  dateLabel: z.string(),
  bookings: z.array(pilotBookingConfirmEntrySchema).optional(),
});

export type PilotEvolutionApiDTO = z.infer<typeof pilotEvolutionSchema>;
export type PilotAchievementsApiDTO = z.infer<typeof pilotAchievementsSchema>;
export type PilotBookingSlotsApiDTO = z.infer<typeof pilotBookingSlotsSchema>;
export type PilotBookingConfirmRequest = z.infer<
  typeof pilotBookingConfirmRequestSchema
>;
export type PilotBookingConfirmResponse = z.infer<
  typeof pilotBookingConfirmResponseSchema
>;
