import type { User } from "@prisma/client";

import type { AuthUserDTO } from "@/lib/contracts/api/v1/auth.api.schemas";
import type { RoleKey } from "@/lib/contracts/enums";
import { resolvePostLoginPath as resolvePostLoginPathFromUser } from "@/lib/auth/resolve-post-login-path";

export function mapUserToAuthDTO(user: User): AuthUserDTO {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    roleKey: user.roleKey as RoleKey,
    clientId: user.clientId,
    active: user.active,
  };
}

export function resolvePostLoginPath(user: User): string {
  return resolvePostLoginPathFromUser(mapUserToAuthDTO(user));
}

export function isStaffUser(user: User): boolean {
  return user.clientId == null;
}
