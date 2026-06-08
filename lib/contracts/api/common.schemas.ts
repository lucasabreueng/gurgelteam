import { z } from "zod";

import { apiErrorSchema } from "./api-error";

/** UUID v4 — IDs persistidos (Prisma). */
export const zUuid = z.string().uuid();

/** Data ISO `YYYY-MM-DD`. */
export const zIsoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD.");

/** Date-time ISO 8601 com offset. */
export const zIsoDateTime = z.string().datetime({ offset: true });

/** Horário `HH:mm` (grade operacional). */
export const zTimeHHmm = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário deve estar no formato HH:mm.");

/** Avatar persistido em `/uploads/clients/`, URL absoluta ou data URL no upload. */
export const zClientAvatarUrl = z.string().refine(
  (value) => {
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (trimmed.startsWith("/uploads/clients/")) return true;
    if (/^data:image\/(jpeg|png|webp|gif);base64,/i.test(trimmed)) return true;
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  },
  { message: "URL de avatar inválida." },
);

export const zClientAvatarUrlNullable = z.union([z.null(), zClientAvatarUrl]);

/** Valores monetários em centavos (BRL). */
export const zMoneyCents = z.number().int().min(0);

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const paginatedMetaSchema = z.object({
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int(),
  totalPages: z.number().int(),
});

export type PaginatedMeta = z.infer<typeof paginatedMetaSchema>;

export function paginatedDataSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    meta: paginatedMetaSchema,
  });
}

export const apiSuccessEnvelopeSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
  });

export const apiFailureEnvelopeSchema = z.object({
  success: z.literal(false),
  error: apiErrorSchema,
  message: z.string().optional(),
});

export type ApiFailureEnvelope = z.infer<typeof apiFailureEnvelopeSchema>;
