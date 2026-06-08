"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useSettingsUsers() {
  return useQuery({
    queryKey: queryKeys.settings.users(),
    queryFn: () => getAppServices().settings.getSettingsUsers(),
  });
}
