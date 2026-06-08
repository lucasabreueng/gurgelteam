"use client";

import { useMemo } from "react";
import {
  fallbackTeamProfileOptions,
  teamAssignableProfileOptions,
} from "@/lib/team/staff-roles";
import { ROLE_TO_PERMISSION_PROFILE } from "@/lib/settings/permission-profile-ids";
import { useSettingsUsers } from "@/lib/query/hooks/use-settings-users";

/** Perfis atribuíveis à equipe (Configurações → Usuários e permissões). */
export function useStaffRoleOptions() {
  const { data: profiles = [], isPending } = useSettingsUsers();

  const options = useMemo(() => {
    const fromProfiles = teamAssignableProfileOptions(profiles);
    return fromProfiles.length > 0 ? fromProfiles : fallbackTeamProfileOptions();
  }, [profiles]);

  const defaultPermissionProfileId =
    options[0]?.value ?? ROLE_TO_PERMISSION_PROFILE.recepcao;

  return { options, defaultPermissionProfileId, isPending };
}
