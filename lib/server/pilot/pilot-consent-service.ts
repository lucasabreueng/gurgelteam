import { ConsentStatus, ConsentType } from "@prisma/client";

import type { UpsertConsentRequest } from "@/lib/contracts/api/v1/consents.api.schemas";
import { loadPublishedRegistrationLegalDocuments } from "@/lib/server/auth/registration-legal-documents";
import { prisma } from "@/lib/server/prisma";

async function resolveConsentVersion(
  type: UpsertConsentRequest["type"],
  version?: string,
): Promise<string> {
  if (version?.trim()) return version.trim();

  const docs = await loadPublishedRegistrationLegalDocuments();
  const doc = docs.find((item) => item.key === type);
  if (doc?.revision) return String(doc.revision);
  return "1";
}

export async function upsertPilotConsent(
  userId: string,
  input: UpsertConsentRequest,
): Promise<void> {
  const version = await resolveConsentVersion(input.type, input.version);
  const now = new Date();
  const consentType = input.type as ConsentType;

  if (input.status === ConsentStatus.ACCEPTED) {
    await prisma.consent.upsert({
      where: {
        userId_type_version: {
          userId,
          type: consentType,
          version,
        },
      },
      update: {
        status: ConsentStatus.ACCEPTED,
        acceptedAt: now,
        revokedAt: null,
      },
      create: {
        userId,
        type: consentType,
        status: ConsentStatus.ACCEPTED,
        version,
        acceptedAt: now,
      },
    });
    return;
  }

  await prisma.consent.upsert({
    where: {
      userId_type_version: {
        userId,
        type: consentType,
        version,
      },
    },
    update: {
      status: ConsentStatus.REVOKED,
      revokedAt: now,
    },
    create: {
      userId,
      type: consentType,
      status: ConsentStatus.REVOKED,
      version,
      revokedAt: now,
    },
  });
}
