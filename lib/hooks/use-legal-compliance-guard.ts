"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getDataSourceMode } from "@/lib/data-source/mode";
import { useLegalCompliance } from "@/lib/query/hooks/use-legal-compliance";

const LEGAL_COMPLIANCE_PATH = "/termos-pendentes";

export function useLegalComplianceGuard(enabled = true) {
  const router = useRouter();
  const pathname = usePathname();
  const isHttpMode = getDataSourceMode() === "http";
  const { data, isPending, isError } = useLegalCompliance();

  useEffect(() => {
    if (!enabled || !isHttpMode || isPending || isError) return;
    if (pathname === LEGAL_COMPLIANCE_PATH) return;
    if (data?.required) {
      const next = encodeURIComponent(pathname);
      router.replace(`${LEGAL_COMPLIANCE_PATH}?next=${next}`);
    }
  }, [enabled, isHttpMode, isPending, isError, data?.required, pathname, router]);

  return {
    isPending: isHttpMode && isPending,
    isBlocked: isHttpMode && Boolean(data?.required),
  };
}
