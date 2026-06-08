"use client";

import type { RegistrationLegalDocument } from "@/lib/legal/registration-legal";

import { useState } from "react";

import { SettingsCheckbox } from "@/components/admin/settings/settings-checkbox";
import { FieldError } from "./field-error";
import { LegalDocumentDialog } from "./legal-document-dialog";

type ConsentState = {
  acceptedPrivacy: boolean;
  acceptedTerms: boolean;
  acceptedImageUsage: boolean;
};

type ConsentErrors = {
  acceptedPrivacy?: string;
  acceptedTerms?: string;
};

type Props = {
  documents: RegistrationLegalDocument[];
  value: ConsentState;
  onChange: (patch: Partial<ConsentState>) => void;
  errors: ConsentErrors;
  showErrors: boolean;
  loading?: boolean;
};

export function CadastroLegalConsents({
  documents,
  value,
  onChange,
  errors,
  showErrors,
  loading = false,
}: Props) {
  const [openDoc, setOpenDoc] = useState<RegistrationLegalDocument | null>(null);

  const privacyDoc = documents.find((d) => d.key === "privacy");
  const termsDoc = documents.find((d) => d.key === "terms");
  const imageDoc = documents.find((d) => d.key === "image");

  if (loading) {
    return (
      <p className="text-sm text-neutral-500">Carregando termos legais…</p>
    );
  }

  if (!privacyDoc || !termsDoc) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      >
        Os documentos legais obrigatórios ainda não estão publicados nas
        configurações. Tente novamente mais tarde ou contate a equipe.
      </p>
    );
  }

  const rows: {
    key: keyof ConsentState;
    doc: RegistrationLegalDocument;
    checked: boolean;
    error?: string;
  }[] = [
    {
      key: "acceptedPrivacy",
      doc: privacyDoc,
      checked: value.acceptedPrivacy,
      error: errors.acceptedPrivacy,
    },
    {
      key: "acceptedTerms",
      doc: termsDoc,
      checked: value.acceptedTerms,
      error: errors.acceptedTerms,
    },
  ];

  if (imageDoc) {
    rows.push({
      key: "acceptedImageUsage",
      doc: imageDoc,
      checked: value.acceptedImageUsage,
    });
  }

  return (
    <>
      <fieldset className="space-y-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-4 py-4">
        <legend className="px-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
          Termos e consentimentos
        </legend>
        {rows.map((row) => (
          <div key={row.key}>
            <label className="flex cursor-pointer items-start gap-3">
              <SettingsCheckbox
                checked={row.checked}
                onChange={(checked) => onChange({ [row.key]: checked })}
                aria-label={row.doc.title}
              />
              <span className="text-sm leading-snug text-neutral-700">
                {row.doc.required ? (
                  <span className="font-semibold text-[#0d1f3c]">
                    Li e aceito a{" "}
                  </span>
                ) : (
                  <span className="font-semibold text-[#0d1f3c]">
                    Autorizo o{" "}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenDoc(row.doc);
                  }}
                  className="font-semibold text-[#c41e3a] underline-offset-2 hover:underline"
                >
                  {row.doc.title}
                </button>
                {row.doc.required ? (
                  <span className="text-red-600"> *</span>
                ) : (
                  <span className="text-neutral-500"> (opcional)</span>
                )}
              </span>
            </label>
            {showErrors && row.error ? (
              <FieldError message={row.error} />
            ) : null}
          </div>
        ))}
      </fieldset>

      <LegalDocumentDialog
        open={openDoc !== null}
        title={openDoc?.title ?? ""}
        content={openDoc?.content ?? ""}
        lastUpdated={openDoc?.lastUpdated}
        revision={openDoc?.revision}
        onClose={() => setOpenDoc(null)}
      />
    </>
  );
}

export type { ConsentState, ConsentErrors };
