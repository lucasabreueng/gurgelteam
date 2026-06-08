"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { SessionResponse } from "@/lib/contracts/api/v1/auth.api.schemas";
import type { LegalComplianceResponse } from "@/lib/query/hooks/use-legal-compliance";
import type { ServerAreaBootstrap } from "@/lib/server/auth/get-server-session";
import { queryKeys } from "@/lib/query/keys";

const AreaBootstrapContext = createContext<ServerAreaBootstrap | null>(null);

export function useAreaBootstrap() {
  return useContext(AreaBootstrapContext);
}

type Props = {
  bootstrap: ServerAreaBootstrap | null;
  children: ReactNode;
};

/** Hidrata React Query com session/termos vindos do layout server-side. */
export function AreaSessionProvider({ bootstrap, children }: Props) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!bootstrap) return;

    if (bootstrap.session) {
      queryClient.setQueryData<SessionResponse>(
        queryKeys.auth.session(),
        bootstrap.session,
      );
    }

    if (bootstrap.legalCompliance) {
      queryClient.setQueryData<LegalComplianceResponse>(
        queryKeys.auth.legalCompliance(),
        bootstrap.legalCompliance,
      );
    }
  }, [bootstrap, queryClient]);

  return (
    <AreaBootstrapContext.Provider value={bootstrap}>
      {children}
    </AreaBootstrapContext.Provider>
  );
}
