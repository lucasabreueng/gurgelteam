"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useAdminInboxNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.inbox(),
    queryFn: () => getAppServices().notifications.getUnreadInbox(),
    staleTime: 30_000,
  });
}
