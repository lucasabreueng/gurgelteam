import { RoleKey } from "@prisma/client";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import type { RegisterLinkedPilotRequest } from "@/lib/contracts/api/v1/pilot.api.schemas";
import { brazilDateToIso } from "@/lib/brazil-date-input";
import { getAutoPilotCategory } from "@/lib/student-profile-mocks";
import { grantPilotPermissions } from "@/lib/server/auth/pilot-account";
import { hashPassword } from "@/lib/server/auth/password";
import { persistClientAvatarUrl } from "@/lib/server/clients/save-client-avatar";
import { suggestAvailableUsername } from "@/lib/server/auth/username-reservation";
import { clientInclude } from "@/lib/server/clients/map-client";
import { prisma } from "@/lib/server/prisma";
import {
  buildPilotAccountBundle,
  categorySlugForAge,
  ensureGuardianForUser,
} from "@/lib/server/pilot/pilot-account-bundle";
import type { User } from "@prisma/client";

function validationError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.VALIDATION_ERROR,
    message,
    httpStatus: 400,
  };
}

function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

async function resolveCategoryId(birthDateIso: string): Promise<string> {
  const auto = getAutoPilotCategory(birthDateIso);
  if (!auto) {
    throw validationError(
      "Idade fora da faixa permitida para cadastro de piloto vinculado.",
    );
  }
  const slug = categorySlugForAge(auto.value);
  const category = await prisma.kartCategory.findFirst({
    where: { slug, active: true },
  });
  if (!category) {
    throw validationError("Categoria não configurada no sistema.");
  }
  return category.id;
}

export async function registerLinkedPilot(
  guardianUser: User,
  input: RegisterLinkedPilotRequest,
) {
  if (!guardianUser.clientId) {
    throw validationError("Conta sem perfil de piloto vinculado.");
  }

  const birthIso = brazilDateToIso(input.birthDate);
  if (!birthIso) {
    throw validationError("Informe uma data de nascimento válida.");
  }

  const username = input.username.trim().toLowerCase();
  const [usernameTaken, pendingUsername] = await Promise.all([
    prisma.user.findUnique({ where: { username } }),
    prisma.pendingRegistration.findFirst({
      where: {
        reservedUsername: username,
        expiresAt: { gt: new Date() },
      },
    }),
  ]);
  if (usernameTaken || pendingUsername) {
    throw validationError("Este usuário já está em uso.");
  }

  const cpf = normalizeCpf(input.cpf);
  const cpfTaken = await prisma.user.findUnique({ where: { cpf } });
  if (cpfTaken) {
    throw validationError("CPF já cadastrado no sistema.");
  }

  const categoryId = await resolveCategoryId(birthIso);
  const skillLevel = await prisma.skillLevel.findFirst({
    where: { slug: "iniciante" },
  });
  if (!skillLevel) {
    throw validationError("Nível iniciante não configurado.");
  }

  const fullName = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();
  const email = `${username}@piloto-vinculado.local`;
  const passwordHash = hashPassword(input.password);
  const avatarUrl = input.avatarUrl
    ? await persistClientAvatarUrl(input.avatarUrl)
    : null;

  const adult = await prisma.client.findUnique({
    where: { id: guardianUser.clientId },
    select: { phone: true },
  });
  const guardianId = await ensureGuardianForUser(
    guardianUser,
    adult?.phone ?? null,
  );

  const minorUserId = await prisma.$transaction(async (tx) => {
    const minorClient = await tx.client.create({
      data: {
        name: fullName,
        email: null,
        phone: input.phone?.trim() || null,
        avatarUrl,
        city: input.city.trim(),
        state: input.state.trim() || "DF",
        skillLevelId: skillLevel.id,
        isMinor: true,
        status: "Ativo",
        memberSince: new Date(),
        categories: { create: [{ categoryId }] },
      },
    });

    const minorUser = await tx.user.create({
      data: {
        email,
        username,
        passwordHash,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        cpf,
        birthDate: new Date(`${birthIso}T12:00:00.000Z`),
        roleKey: RoleKey.recepcao,
        clientId: minorClient.id,
        active: true,
      },
    });

    await tx.guardianLink.create({
      data: {
        guardianId,
        clientId: minorClient.id,
        authorizationSigned: true,
        documentsOnFile: true,
        relationship: input.relationship,
      } as {
        guardianId: string;
        clientId: string;
        authorizationSigned: boolean;
        documentsOnFile: boolean;
        relationship: string;
      },
    });

    return minorUser.id;
  });

  await grantPilotPermissions(minorUserId);

  return buildPilotAccountBundle(guardianUser);
}

export async function suggestLinkedPilotUsername(
  firstName: string,
  lastName: string,
): Promise<string> {
  return suggestAvailableUsername(firstName, lastName);
}
