import type { DocumentTemplate } from "@/lib/contracts/settings";
import { normalizeDocumentTemplate } from "@/lib/legal/document-template-utils";

export const REGISTRATION_LEGAL_DOCUMENT_IDS = {
  privacy: "privacidade",
  terms: "termos-uso",
  image: "imagem",
} as const;

export type RegistrationLegalDocKey = keyof typeof REGISTRATION_LEGAL_DOCUMENT_IDS;

export type RegistrationLegalDocument = {
  id: string;
  key: RegistrationLegalDocKey;
  title: string;
  content: string;
  lastUpdated: string;
  revision: number;
  required: boolean;
};

const REGISTRATION_DOC_META: Record<
  RegistrationLegalDocKey,
  { required: boolean; fallbackTitle: string }
> = {
  privacy: { required: true, fallbackTitle: "Política de privacidade" },
  terms: { required: true, fallbackTitle: "Termos de uso" },
  image: { required: false, fallbackTitle: "Direito de uso de imagem" },
};

export function getPublishedRegistrationLegalDocuments(
  templates: DocumentTemplate[],
): RegistrationLegalDocument[] {
  const byId = new Map(
    templates.map((doc) => [doc.id, normalizeDocumentTemplate(doc)]),
  );

  return (
    Object.entries(REGISTRATION_LEGAL_DOCUMENT_IDS) as [
      RegistrationLegalDocKey,
      string,
    ][]
  )
    .map(([key, id]) => {
      const doc = byId.get(id);
      if (
        !doc ||
        doc.status !== "publicado" ||
        doc.publishedRevision < 1 ||
        !doc.content.trim()
      ) {
        return null;
      }
      return {
        id: doc.id,
        key,
        title: doc.title.trim() || REGISTRATION_DOC_META[key].fallbackTitle,
        content: doc.content.trim(),
        lastUpdated: doc.lastUpdated,
        revision: doc.publishedRevision,
        required: REGISTRATION_DOC_META[key].required,
      } satisfies RegistrationLegalDocument;
    })
    .filter((doc): doc is RegistrationLegalDocument => doc !== null);
}

export function registrationConsentVersions(
  documents: RegistrationLegalDocument[],
): { privacy: string; terms: string; image?: string } {
  const privacy = documents.find((d) => d.key === "privacy");
  const terms = documents.find((d) => d.key === "terms");
  const image = documents.find((d) => d.key === "image");
  return {
    privacy: privacy ? String(privacy.revision) : "",
    terms: terms ? String(terms.revision) : "",
    ...(image ? { image: String(image.revision) } : {}),
  };
}
