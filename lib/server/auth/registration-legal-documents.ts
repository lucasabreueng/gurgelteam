import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import {
  getPublishedRegistrationLegalDocuments,
  registrationConsentVersions,
  type RegistrationLegalDocument,
} from "@/lib/legal/registration-legal";
import { settingsContentRepository } from "@/lib/server/settings/settings-content-repository";

function businessError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.BUSINESS_RULE,
    message,
    httpStatus: 422,
  };
}

export async function loadPublishedRegistrationLegalDocuments(): Promise<
  RegistrationLegalDocument[]
> {
  const templates = await settingsContentRepository.getDocumentTemplates();
  return getPublishedRegistrationLegalDocuments(templates);
}

export async function assertRegistrationLegalConsents(input: {
  acceptedPrivacy: boolean;
  acceptedTerms: boolean;
  acceptedImageUsage?: boolean;
}): Promise<{
  documents: RegistrationLegalDocument[];
  versions: ReturnType<typeof registrationConsentVersions>;
  acceptedImageUsage: boolean;
}> {
  const documents = await loadPublishedRegistrationLegalDocuments();
  const hasPrivacy = documents.some((d) => d.key === "privacy");
  const hasTerms = documents.some((d) => d.key === "terms");

  if (!hasPrivacy || !hasTerms) {
    throw businessError(
      "Documentos legais obrigatórios indisponíveis. Entre em contato com a equipe.",
    );
  }

  if (!input.acceptedPrivacy || !input.acceptedTerms) {
    throw businessError(
      "É necessário aceitar a Política de privacidade e os Termos de uso.",
    );
  }

  return {
    documents,
    versions: registrationConsentVersions(documents),
    acceptedImageUsage: Boolean(input.acceptedImageUsage),
  };
}
