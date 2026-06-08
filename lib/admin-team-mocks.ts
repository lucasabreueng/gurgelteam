import { ROLES } from "@/lib/admin-settings-mocks";
import type { TeamKpi, TeamMemberListItem } from "@/lib/contracts/team";
import type { RoleKey } from "@/lib/contracts/enums";
import { resolveRoleKeyForPermissionProfile } from "@/lib/settings/permission-profile-ids";
import { resolveRoleLabel } from "@/lib/team/role-labels";

const SEED_TEAM: TeamMemberListItem[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    name: "Ana Silva",
    email: "ana.silva@gurgelteam.com.br",
    username: "ana.silva",
    roleKey: "admin",
    permissionProfileId: "user-administrador",
    roleLabel: "Administrador",
    active: true,
    createdAtLabel: "01/jan/2026",
    avatar: "/images/team-1.png",
  },
  {
    id: "22222222-2222-4222-8222-222222222202",
    name: "Carla Financeiro",
    email: "financeiro@gurgelteam.com.br",
    username: "financeiro",
    roleKey: "financeiro",
    permissionProfileId: "user-financeiro",
    roleLabel: "Financeiro",
    active: true,
    createdAtLabel: "01/jan/2026",
    avatar: "/images/team-3.png",
  },
];

let runtimeTeam = [...SEED_TEAM];
let nextSeq = 1;

export function getTeamMembers(): TeamMemberListItem[] {
  return runtimeTeam.map((m) => ({ ...m }));
}

export function getTeamKpis(): TeamKpi[] {
  const rows = getTeamMembers();
  const active = rows.filter((r) => r.active).length;
  const admins = rows.filter((r) => r.roleKey === "admin").length;
  const operational = rows.filter((r) => r.roleKey !== "admin" && r.active).length;
  return [
    {
      id: "total",
      label: "Membros da equipe",
      value: String(rows.length),
      delta: "Contas internas",
      deltaPositive: true,
    },
    {
      id: "ativos",
      label: "Ativos",
      value: String(active),
      delta: `${rows.length - active} inativo(s)`,
      deltaPositive: active === rows.length,
    },
    {
      id: "admin",
      label: "Administradores",
      value: String(admins),
      delta: "Acesso total",
      deltaPositive: admins > 0,
    },
    {
      id: "operacao",
      label: "Operação",
      value: String(operational),
      delta: "Recepção, financeiro, mecânico",
      deltaPositive: operational > 0,
    },
  ];
}

export function getTeamRoleOptions(): { value: RoleKey | ""; label: string }[] {
  return [
    { value: "", label: "Função" },
    ...ROLES.map((r) => ({ value: r.key, label: r.title })),
  ];
}

export function getTeamStatusOptions(): { value: "" | "ativo" | "inativo"; label: string }[] {
  return [
    { value: "", label: "Status" },
    { value: "ativo", label: "Ativo" },
    { value: "inativo", label: "Inativo" },
  ];
}

export function getTablePageSizes(): number[] {
  return [10, 25, 50];
}

export function registerTeamMember(input: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  permissionProfileId: string;
  roleLabel?: string;
  active: boolean;
}): TeamMemberListItem {
  const roleKey = resolveRoleKeyForPermissionProfile(input.permissionProfileId);
  const row: TeamMemberListItem = {
    id: `team-mock-${nextSeq++}`,
    name: `${input.firstName} ${input.lastName}`.trim(),
    email: input.email,
    username: input.username,
    roleKey,
    permissionProfileId: input.permissionProfileId,
    roleLabel: input.roleLabel ?? resolveRoleLabel(roleKey),
    active: input.active,
    createdAtLabel: new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    avatar: "/images/team-2.png",
  };
  runtimeTeam = [...runtimeTeam, row];
  return row;
}

export function removeTeamMember(id: string): boolean {
  const target = runtimeTeam.find((m) => m.id === id);
  if (
    !target ||
    target.permissionProfileId === "user-administrador" ||
    target.roleKey === "admin"
  ) {
    return false;
  }
  runtimeTeam = runtimeTeam.filter((m) => m.id !== id);
  return true;
}

export function updateTeamMember(
  id: string,
  patch: Partial<
    Pick<
      TeamMemberListItem,
      | "name"
      | "email"
      | "username"
      | "roleKey"
      | "permissionProfileId"
      | "roleLabel"
      | "active"
    >
  >,
): TeamMemberListItem | null {
  let updated: TeamMemberListItem | null = null;
  runtimeTeam = runtimeTeam.map((m) => {
    if (m.id !== id) return m;
    const next = {
      ...m,
      ...patch,
      ...(patch.permissionProfileId
        ? {
            permissionProfileId: patch.permissionProfileId,
            roleKey: resolveRoleKeyForPermissionProfile(patch.permissionProfileId),
          }
        : {}),
      ...(patch.roleLabel ? { roleLabel: patch.roleLabel } : {}),
      ...(patch.roleKey && !patch.roleLabel
        ? { roleLabel: resolveRoleLabel(patch.roleKey) }
        : {}),
    };
    updated = next;
    return next;
  });
  return updated;
}
