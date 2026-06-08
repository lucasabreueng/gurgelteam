"use client";

import { useQuery } from "@tanstack/react-query";
import type { DrePeriodFilter } from "@/lib/admin-dre-mocks";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useDreAccountEntries(
  accountId: string | null | undefined,
  filter: DrePeriodFilter,
  enabled: boolean,
) {
  return useQuery({
    queryKey: queryKeys.finance.dreEntries(accountId ?? "", filter),
    queryFn: () =>
      getAppServices().finance.getDreAccountEntries(accountId!, filter),
    enabled: enabled && Boolean(accountId),
  });
}
