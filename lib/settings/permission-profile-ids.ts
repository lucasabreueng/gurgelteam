import type { RoleKey } from "@/lib/contracts/enums";
import { ROLE_KEYS } from "@/lib/contracts/enums";

/** Perfil de permissões padrão para cada função da equipe (staff). */
export const ROLE_TO_PERMISSION_PROFILE: Record<
  (typeof ROLE_KEYS)[number],
  string
> = {
  admin: "user-administrador",
  recepcao: "user-recepcao",
  financeiro: "user-financeiro",
  mecanico: "user-mecanico",
};

export const PERMISSION_PROFILE_TO_ROLE = Object.fromEntries(
  Object.entries(ROLE_TO_PERMISSION_PROFILE).map(([roleKey, profileId]) => [
    profileId,
    roleKey as RoleKey,
  ]),
) as Record<string, RoleKey>;

/** Perfis da área piloto/responsável — não atribuíveis à equipe interna. */
export const PILOT_PERMISSION_PROFILE_IDS = new Set([
  "user-piloto",
  "user-responsavel",
  "user-piloto-menor",
]);

/** `roleKey` no banco para perfis customizados (permissões vêm do perfil). */
export const DEFAULT_ROLE_FOR_CUSTOM_PROFILE: RoleKey = "recepcao";

export function resolveRoleKeyForPermissionProfile(profileId: string): RoleKey {
  return (
    PERMISSION_PROFILE_TO_ROLE[profileId] ?? DEFAULT_ROLE_FOR_CUSTOM_PROFILE
  );
}
