"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/http-client";
import { useAreaBootstrap } from "@/components/auth/area-session-provider";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type { RegistrationLegalDocument } from "@/lib/legal/registration-legal";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { queryKeys } from "@/lib/query/keys";

export type LegalComplianceResponse = {
  required: boolean;
  documents: RegistrationLegalDocument[];
};

export async function fetchLegalCompliance(): Promise<LegalComplianceResponse> {
  const res = await apiFetch<LegalComplianceResponse>(
    v1ApiPaths.auth.legalCompliance,
  );
  if (!res.success || !res.data) {
    throw new Error(
      res.error?.message ?? "Não foi possível verificar os termos pendentes.",
    );
  }
  return res.data;
}

export function useLegalCompliance() {
  const http = getDataSourceMode() === "http";
  const bootstrap = useAreaBootstrap();
  const initialData = bootstrap?.legalCompliance ?? undefined;

  return useQuery({
    queryKey: queryKeys.auth.legalCompliance(),
    enabled: http,
    queryFn: fetchLegalCompliance,
    initialData,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
