import type { DocumentTemplate } from "@/lib/contracts/settings";

import { normalizeDocumentTemplate } from "@/lib/legal/document-template-utils";

import {

  REGISTRATION_LEGAL_DOCUMENT_IDS,

  type RegistrationLegalDocKey,

  type RegistrationLegalDocument,

} from "@/lib/legal/registration-legal";



export const PLATFORM_COMPLIANCE_DOCUMENT_IDS = {

  privacy: REGISTRATION_LEGAL_DOCUMENT_IDS.privacy,

  terms: REGISTRATION_LEGAL_DOCUMENT_IDS.terms,

} as const;



export function getPublishedComplianceDocuments(

  templates: DocumentTemplate[],

): RegistrationLegalDocument[] {

  const byId = new Map(

    templates.map((doc) => [doc.id, normalizeDocumentTemplate(doc)]),

  );



  return (

    Object.entries(PLATFORM_COMPLIANCE_DOCUMENT_IDS) as [

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



      const meta = {

        privacy: { title: "Política de privacidade", required: true },

        terms: { title: "Termos de uso", required: true },

        image: { title: "Direito de uso de imagem", required: false },

      } as const;



      return {

        id: doc.id,

        key,

        title: doc.title.trim() || meta[key].title,

        content: doc.content.trim(),

        lastUpdated: doc.lastUpdated,

        revision: doc.publishedRevision,

        required: meta[key].required,

      } satisfies RegistrationLegalDocument;

    })

    .filter((doc): doc is RegistrationLegalDocument => doc !== null);

}



export function complianceConsentVersions(

  documents: RegistrationLegalDocument[],

): { privacy: string; terms: string } {

  const privacy = documents.find((d) => d.key === "privacy");

  const terms = documents.find((d) => d.key === "terms");

  return {

    privacy: privacy ? String(privacy.revision) : "",

    terms: terms ? String(terms.revision) : "",

  };

}

