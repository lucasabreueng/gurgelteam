import { getTeamMembers } from "@/lib/admin-team-mocks";
import { resolveMemberPermissionProfileId } from "@/lib/team/staff-roles";

export type ProfileAssignee = {
  id: string;
  name: string;
  email: string;
};

/** Contas da equipe (mock) vinculadas ao perfil de permissões. */
export function listMockPermissionProfileAssignees(
  profileId: string,
): ProfileAssignee[] {
  return getTeamMembers()
    .filter(
      (member) => resolveMemberPermissionProfileId(member) === profileId,
    )
    .map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
    }));
}
