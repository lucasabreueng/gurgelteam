import { RoleKey } from "@prisma/client";

import { PILOT_MODULE_KEYS } from "@/lib/contracts/module-registry";
import { suggestAvailableUsername } from "@/lib/server/auth/username-reservation";
import { prisma } from "@/lib/server/prisma";

export type CreatePilotAccountInput = {
  email: string;
  cpf: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  skillLevelId: string;
  categoryIds: string[];
  username: string;
};

export async function grantPilotPermissions(userId: string): Promise<void> {
  await prisma.modulePermission.createMany({
    data: PILOT_MODULE_KEYS.map((moduleKey) => ({
      userId,
      moduleKey,
      canView: true,
      canEdit: moduleKey === "pilotoAgenda",
      canDelete: false,
    })),
    skipDuplicates: true,
  });

  await prisma.modulePermission.updateMany({
    where: { userId, moduleKey: "pilotoAgenda" },
    data: { canEdit: true },
  });
}

export async function createPilotAccount(input: CreatePilotAccountInput) {
  const email = input.email.trim().toLowerCase();
  const username = input.username.trim().toLowerCase();
  const fullName = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();

  const [existingUsername, pendingConflict] = await Promise.all([
    prisma.user.findUnique({ where: { username } }),
    prisma.pendingRegistration.findFirst({
      where: {
        reservedUsername: username,
        email: { not: email },
        expiresAt: { gt: new Date() },
      },
    }),
  ]);

  if (existingUsername || pendingConflict) {
    throw new Error("Usuário reservado não está mais disponível.");
  }

  const user = await prisma.$transaction(async (tx) => {
    const client = await tx.client.create({
      data: {
        name: fullName,
        email,
        skillLevelId: input.skillLevelId,
        isMinor: false,
        status: "Ativo",
        memberSince: new Date(),
        categories: {
          create: input.categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
    });

    return tx.user.create({
      data: {
        email,
        username,
        passwordHash: input.passwordHash,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        cpf: input.cpf,
        birthDate: input.birthDate,
        roleKey: RoleKey.recepcao,
        clientId: client.id,
        active: true,
      },
    });
  });

  await grantPilotPermissions(user.id);
  return user;
}

export async function suggestPilotUsername(
  firstName: string,
  lastName: string,
): Promise<string> {
  return suggestAvailableUsername(firstName, lastName);
}
