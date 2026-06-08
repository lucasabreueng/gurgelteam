import { randomBytes } from "crypto";
import type { Prisma } from "@prisma/client";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import type {
  CreateTeamMemberRequest,
  TeamMemberApiDTO,
  TeamQuery,
  UpdateTeamMemberRequest,
} from "@/lib/contracts/api/v1/team.api.schemas";
import type { RoleKey } from "@/lib/contracts/enums";
import { hashPassword } from "@/lib/server/auth/password";
import {
  createSignedResetToken,
  hashRecoveryCode,
} from "@/lib/server/auth/signed-token";
import { revokeAllUserSessions } from "@/lib/server/auth/session-service";
import {
  INVITE_EXPIRES_HOURS,
  sendTeamInviteEmail,
} from "@/lib/server/email/send-team-invite-email";
import { prisma } from "@/lib/server/prisma";
import { isProtectedAdminMember } from "@/lib/team/team-rules";
import { resolveRoleKeyForPermissionProfile } from "@/lib/settings/permission-profile-ids";
import {
  applyPermissionProfileById,
  getPermissionProfileNameById,
} from "@/lib/server/settings/permission-profiles";
import { mapStaffUserToTeamMember } from "@/lib/server/team/map-team";

const INVITE_TTL_MS = INVITE_EXPIRES_HOURS * 60 * 60 * 1000;

function conflictError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.CONFLICT,
    message,
    httpStatus: 409,
  };
}

function notFoundError(): ApiError {
  return {
    code: API_ERROR_CODES.NOT_FOUND,
    message: "Usuário da equipe não encontrado.",
    httpStatus: 404,
  };
}

function forbiddenRemoveAdmin(): ApiError {
  return {
    code: API_ERROR_CODES.FORBIDDEN,
    message: "O usuário administrador não pode ser removido.",
    httpStatus: 403,
  };
}

function forbiddenEditAdmin(): ApiError {
  return {
    code: API_ERROR_CODES.FORBIDDEN,
    message: "O usuário administrador não pode ser editado.",
    httpStatus: 403,
  };
}

function staffWhere(query: TeamQuery): Prisma.UserWhereInput {
  return {
    clientId: null,
    ...(query.query.trim()
      ? {
          OR: [
            { firstName: { contains: query.query.trim(), mode: "insensitive" } },
            { lastName: { contains: query.query.trim(), mode: "insensitive" } },
            { email: { contains: query.query.trim(), mode: "insensitive" } },
            { username: { contains: query.query.trim(), mode: "insensitive" } },
          ],
        }
      : {}),
    ...(query.permissionProfileId
      ? { permissionProfileId: query.permissionProfileId }
      : query.roleKey
        ? { roleKey: query.roleKey as RoleKey }
        : {}),
    ...(query.status === "ativo" ? { active: true } : {}),
    ...(query.status === "inativo" ? { active: false } : {}),
  };
}

export function isTeamApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value
  );
}

export const teamRepository = {
  async list(query: TeamQuery): Promise<TeamMemberApiDTO[]> {
    const [rows, profileNames] = await Promise.all([
      prisma.user.findMany({
        where: staffWhere(query),
        orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
      }),
      getPermissionProfileNameById(),
    ]);
    return rows.map((row) =>
      mapStaffUserToTeamMember(
        {
          ...row,
          roleKey: row.roleKey as RoleKey,
          permissionProfileId: row.permissionProfileId,
        },
        profileNames,
      ),
    );
  },

  async getKpis(): Promise<
    { id: string; label: string; value: string; delta: string; deltaPositive: boolean }[]
  > {
    const rows = await prisma.user.findMany({
      where: { clientId: null },
      select: { active: true, roleKey: true },
    });
    const active = rows.filter((r) => r.active).length;
    const admins = rows.filter((r) => r.roleKey === "admin").length;
    const operational = rows.filter(
      (r) => r.roleKey !== "admin" && r.active,
    ).length;

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
  },

  async create(data: CreateTeamMemberRequest): Promise<TeamMemberApiDTO> {
    const email = data.email.trim().toLowerCase();
    const username = data.username.trim().toLowerCase();

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      throw conflictError(
        existing.email === email
          ? "E-mail já cadastrado."
          : "Nome de usuário já em uso.",
      );
    }

    const profileId = data.permissionProfileId;
    const roleKey = resolveRoleKeyForPermissionProfile(profileId);
    const placeholderPassword = randomBytes(32).toString("base64url");

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email,
        username,
        passwordHash: hashPassword(placeholderPassword),
        roleKey,
        permissionProfileId: profileId,
        active: data.active,
        clientId: null,
      },
    });

    await applyPermissionProfileById(user.id, profileId);

    const inviteCode = randomBytes(16).toString("hex");
    const reset = await prisma.passwordReset.create({
      data: {
        userId: user.id,
        codeHash: hashRecoveryCode(inviteCode),
        expiresAt: new Date(Date.now() + INVITE_TTL_MS),
      },
    });

    const resetToken = createSignedResetToken(
      { resetId: reset.id, userId: user.id },
      INVITE_TTL_MS,
    );

    await sendTeamInviteEmail({
      to: email,
      firstName: user.firstName,
      resetToken,
    });

    const profileNames = await getPermissionProfileNameById();
    return mapStaffUserToTeamMember(
      {
        ...user,
        roleKey: user.roleKey as RoleKey,
        permissionProfileId: user.permissionProfileId,
      },
      profileNames,
    );
  },

  async update(
    userId: string,
    data: UpdateTeamMemberRequest,
  ): Promise<TeamMemberApiDTO> {
    const existing = await prisma.user.findFirst({
      where: { id: userId, clientId: null },
    });
    if (!existing) throw notFoundError();

    if (
      isProtectedAdminMember({
        roleKey: existing.roleKey as RoleKey,
        permissionProfileId: existing.permissionProfileId,
      })
    ) {
      throw forbiddenEditAdmin();
    }

    const profileChanged =
      data.permissionProfileId !== existing.permissionProfileId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        permissionProfileId: data.permissionProfileId,
        roleKey: resolveRoleKeyForPermissionProfile(data.permissionProfileId),
      },
    });

    if (profileChanged) {
      await applyPermissionProfileById(user.id, data.permissionProfileId);
    }

    const profileNames = await getPermissionProfileNameById();
    return mapStaffUserToTeamMember(
      {
        ...user,
        roleKey: user.roleKey as RoleKey,
        permissionProfileId: user.permissionProfileId,
      },
      profileNames,
    );
  },

  async remove(userId: string): Promise<void> {
    const existing = await prisma.user.findFirst({
      where: { id: userId, clientId: null },
    });
    if (!existing) throw notFoundError();
    if (
      isProtectedAdminMember({
        roleKey: existing.roleKey as RoleKey,
        permissionProfileId: existing.permissionProfileId,
      })
    ) {
      throw forbiddenRemoveAdmin();
    }

    await revokeAllUserSessions(userId);
    await prisma.modulePermission.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  },
};
