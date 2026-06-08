import { ConsentStatus, ConsentType } from "@prisma/client";

import { prisma } from "@/lib/server/prisma";

export type StoredRegistrationConsents = {
  acceptedPrivacy: boolean;
  acceptedTerms: boolean;
  acceptedImageUsage: boolean;
  versions: {
    privacy: string;
    terms: string;
    image?: string;
  };
};

export async function recordRegistrationConsents(
  userId: string,
  consents: StoredRegistrationConsents,
): Promise<void> {
  const now = new Date();
  const rows: {
    userId: string;
    type: ConsentType;
    status: ConsentStatus;
    version: string;
    acceptedAt: Date | null;
  }[] = [
    {
      userId,
      type: ConsentType.privacy,
      status: ConsentStatus.ACCEPTED,
      version: consents.versions.privacy || "1",
      acceptedAt: now,
    },
    {
      userId,
      type: ConsentType.terms,
      status: ConsentStatus.ACCEPTED,
      version: consents.versions.terms || "1",
      acceptedAt: now,
    },
  ];

  if (consents.acceptedImageUsage) {
    rows.push({
      userId,
      type: ConsentType.image,
      status: ConsentStatus.ACCEPTED,
      version: consents.versions.image || "1",
      acceptedAt: now,
    });
  }

  await prisma.consent.createMany({ data: rows });
}
