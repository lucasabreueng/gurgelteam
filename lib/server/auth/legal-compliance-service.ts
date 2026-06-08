import { ConsentStatus, ConsentType } from "@prisma/client";

import type { RegistrationLegalDocument } from "@/lib/legal/registration-legal";
import {
  complianceConsentVersions,
  getPublishedComplianceDocuments,
} from "@/lib/legal/platform-compliance";
import { settingsContentRepository } from "@/lib/server/settings/settings-content-repository";
import { prisma } from "@/lib/server/prisma";

import { recordRegistrationConsents } from "./record-registration-consents";

export type LegalComplianceStatus = {
  required: boolean;
  documents: RegistrationLegalDocument[];
};

async function hasAcceptedConsentVersion(
  userId: string,
  type: ConsentType,
  version: string,
): Promise<boolean> {
  if (!version) return false;
  const consent = await prisma.consent.findFirst({
    where: {
      userId,
      type,
      status: ConsentStatus.ACCEPTED,
      version,
    },
  });
  return Boolean(consent);
}

export async function getUserLegalComplianceStatus(
  userId: string,
): Promise<LegalComplianceStatus> {
  const templates = await settingsContentRepository.getDocumentTemplates();
  const published = getPublishedComplianceDocuments(templates);
  const pending: RegistrationLegalDocument[] = [];

  for (const doc of published) {
    const type =
      doc.key === "privacy" ? ConsentType.privacy : ConsentType.terms;
    const version = String(doc.revision);
    const accepted = await hasAcceptedConsentVersion(userId, type, version);
    if (!accepted) {
      pending.push(doc);
    }
  }

  return {
    required: pending.length > 0,
    documents: pending,
  };
}

export async function acceptUserLegalCompliance(
  userId: string,
  input: { acceptedPrivacy: boolean; acceptedTerms: boolean },
): Promise<void> {
  const templates = await settingsContentRepository.getDocumentTemplates();
  const published = getPublishedComplianceDocuments(templates);
  const versions = complianceConsentVersions(published);

  if (!input.acceptedPrivacy || !input.acceptedTerms) {
    throw new Error(
      "É necessário aceitar a Política de privacidade e os Termos de uso.",
    );
  }

  if (!versions.privacy || !versions.terms) {
    throw new Error("Documentos legais obrigatórios indisponíveis.");
  }

  await recordRegistrationConsents(userId, {
    acceptedPrivacy: true,
    acceptedTerms: true,
    acceptedImageUsage: false,
    versions: {
      privacy: versions.privacy,
      terms: versions.terms,
    },
  });
}
