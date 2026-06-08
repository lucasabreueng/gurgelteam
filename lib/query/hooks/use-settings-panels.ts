"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { queryKeys } from "@/lib/query/keys";

const http = () => getDataSourceMode() === "http";

export function useSettingsCatalog() {
  return useQuery({
    queryKey: queryKeys.settings.catalog(),
    enabled: http(),
    queryFn: () => getAppServices().settings.getSettingsCatalog(),
  });
}

export function useSettingsNotifications() {
  return useQuery({
    queryKey: queryKeys.settings.notifications(),
    enabled: http(),
    queryFn: () => getAppServices().settings.getNotificationEvents(),
  });
}

export function useSettingsDocuments() {
  return useQuery({
    queryKey: queryKeys.settings.documents(),
    enabled: http(),
    queryFn: () => getAppServices().settings.getDocumentTemplates(),
  });
}

export function useSettingsTermsRegistry() {
  return useQuery({
    queryKey: queryKeys.settings.termsRegistry(),
    enabled: http(),
    queryFn: () => getAppServices().settings.getTermsRegistry(),
  });
}

export function useSettingsOrganization() {
  return useQuery({
    queryKey: queryKeys.settings.organization(),
    enabled: http(),
    queryFn: () => getAppServices().settings.getGeneralSettings(),
  });
}
