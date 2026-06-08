"use client";



import { useQuery } from "@tanstack/react-query";

import { getAppServices } from "@/lib/data-source/app-services";

import type { FinanceMetaPayload } from "@/lib/server/finance/meta-builder";

import { queryKeys } from "@/lib/query/keys";



export function useFinanceMeta() {

  return useQuery({

    queryKey: [...queryKeys.finance.all, "meta"] as const,

    queryFn: (): Promise<FinanceMetaPayload> =>

      getAppServices().finance.getMeta() as Promise<FinanceMetaPayload>,

    staleTime: 5 * 60_000,

  });

}

