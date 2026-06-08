import { z } from "zod";

import { CONSENT_TYPES, ConsentStatus } from "../../enums";
import { zIsoDateTime, zUuid } from "../common.schemas";

export const zConsentType = z.enum(CONSENT_TYPES);
export const zConsentStatus = z.nativeEnum(ConsentStatus);

export const consentSchema = z.object({
  id: zUuid,
  userId: zUuid,
  type: zConsentType,
  status: zConsentStatus,
  version: z.string().min(1),
  acceptedAt: zIsoDateTime.nullable().optional(),
  revokedAt: zIsoDateTime.nullable().optional(),
});

export const upsertConsentSchema = z.object({
  type: zConsentType,
  status: z.enum([ConsentStatus.ACCEPTED, ConsentStatus.REVOKED]),
  version: z.string().min(1),
});

export type UpsertConsentRequest = z.infer<typeof upsertConsentSchema>;
