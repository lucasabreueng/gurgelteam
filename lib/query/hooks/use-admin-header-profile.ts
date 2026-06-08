"use client";

import { useQuery } from "@tanstack/react-query";
import { ADMIN_PROFILE } from "@/lib/admin-dashboard-mocks";
import { mapAuthUserToAdminProfile } from "@/lib/admin/map-auth-user-to-admin-profile";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { queryKeys } from "@/lib/query/keys";
import { AuthRepositoryHttp } from "@/repositories/auth/AuthRepositoryHttp";
import { DashboardRepositoryMock } from "@/repositories/dashboard/DashboardRepositoryMock";

export function useAdminHeaderProfile() {
  const isHttpMode = getDataSourceMode() === "http";

  const { data, isPending } = useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: () => AuthRepositoryHttp.getSession(),
    enabled: isHttpMode,
    staleTime: 60_000,
  });

  if (!isHttpMode) {
    return {
      profile: DashboardRepositoryMock.getProfile(),
      isPending: false,
    };
  }

  if (data?.user) {
    return {
      profile: mapAuthUserToAdminProfile(data.user),
      isPending: false,
    };
  }

  return {
    profile: isPending
      ? { ...ADMIN_PROFILE, name: "…" }
      : DashboardRepositoryMock.getProfile(),
    isPending,
  };
}
