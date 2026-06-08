"use client";

import { useEffect, useState } from "react";
import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type { SuggestUsernameResponse } from "@/lib/contracts/api/v1/auth.api.schemas";
import { generateAvailableUsername } from "@/lib/auth-accounts-mocks";
import { getDataSourceMode } from "@/lib/data-source/mode";

export type SuggestedUsernameState = {
  username: string;
  loading: boolean;
};

/**
 * Sugere usuário de login a partir de nome/sobrenome (padrão dos drawers de cliente).
 */
export function useSuggestedUsername(
  firstName: string,
  lastName: string,
  enabled = true,
): SuggestedUsernameState {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const isHttp = getDataSourceMode() === "http";

  useEffect(() => {
    if (!enabled) {
      setUsername("");
      setLoading(false);
      return;
    }

    const fn = firstName.trim();
    const ln = lastName.trim();
    if (!fn || !ln) {
      setUsername("");
      setLoading(false);
      return;
    }

    const local = generateAvailableUsername(fn, ln);
    setUsername(local);

    if (!isHttp) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams({
        firstName: fn,
        lastName: ln,
      });
      void apiFetch<SuggestUsernameResponse>(
        `${v1ApiPaths.auth.registerSuggestUsername}?${params.toString()}`,
      )
        .then((res) => {
          const data = unwrapApiResponse(res);
          if (data.username) setUsername(data.username);
        })
        .catch(() => setUsername(local))
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      window.clearTimeout(timer);
      setLoading(false);
    };
  }, [firstName, lastName, enabled, isHttp]);

  return { username, loading };
}
