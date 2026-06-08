"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type { LegalComplianceResponse } from "@/lib/query/hooks/use-legal-compliance";
import { queryKeys } from "@/lib/query/keys";
import {
  CadastroLegalConsents,
  type ConsentErrors,
  type ConsentState,
} from "@/components/cadastro/cadastro-legal-consents";

export function PendingLegalTermsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const nextPath = searchParams.get("next") || "/";

  const [documents, setDocuments] = useState<
    LegalComplianceResponse["documents"]
  >([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [consents, setConsents] = useState<ConsentState>({
    acceptedPrivacy: false,
    acceptedTerms: false,
    acceptedImageUsage: false,
  });

  useEffect(() => {
    let cancelled = false;
    void apiFetch<LegalComplianceResponse>(v1ApiPaths.auth.legalCompliance).then(
      (result) => {
        if (cancelled) return;
        setLoadingDocs(false);
        if (result.success && result.data) {
          if (!result.data.required) {
            router.replace(nextPath);
            return;
          }
          setDocuments(result.data.documents);
          return;
        }
        setLoadError(
          result.error?.message ??
            "Não foi possível carregar os termos pendentes.",
        );
      },
    );
    return () => {
      cancelled = true;
    };
  }, [nextPath, router]);

  const errors = useMemo(() => {
    const next: ConsentErrors = {};
    if (submitted && !consents.acceptedPrivacy) {
      next.acceptedPrivacy =
        "Aceite a Política de privacidade para continuar.";
    }
    if (submitted && !consents.acceptedTerms) {
      next.acceptedTerms = "Aceite os Termos de uso para continuar.";
    }
    return next;
  }, [consents, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.acceptedPrivacy || errors.acceptedTerms) return;

    setSubmitting(true);
    setFormError(null);

    const result = await apiFetch<LegalComplianceResponse>(
      v1ApiPaths.auth.legalCompliance,
      {
        method: "POST",
        body: JSON.stringify({
          acceptedPrivacy: consents.acceptedPrivacy,
          acceptedTerms: consents.acceptedTerms,
        }),
      },
    );

    setSubmitting(false);

    if (result.success && result.data && !result.data.required) {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.auth.legalCompliance(),
      });
      router.replace(nextPath);
      return;
    }

    setFormError(
      result.error?.message ??
        result.message ??
        "Não foi possível registrar os aceites.",
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_8px_32px_rgba(13,31,60,0.06)] sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#0d1f3c]">
            Termos atualizados
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Publicamos uma nova revisão da Política de privacidade e/ou dos
            Termos de uso. Para continuar utilizando a plataforma, leia e aceite
            os documentos abaixo.
          </p>

          {loadError ? (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {loadError}
            </p>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
              <CadastroLegalConsents
                documents={documents}
                loading={loadingDocs}
                value={consents}
                onChange={(patch) => setConsents((prev) => ({ ...prev, ...patch }))}
                errors={errors}
                showErrors={submitted}
              />

              {formError ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  {formError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting || loadingDocs}
                className="w-full rounded-xl bg-accent px-4 py-3.5 text-[14px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(13,31,60,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Salvando aceites…" : "Continuar"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-neutral-600">
            Prefere sair?{" "}
            <Link href="/login" className="font-semibold text-[#c41e3a] hover:underline">
              Fazer logout
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
