import { RoleKey, type PrismaClient } from "@prisma/client";

import { REFERENCE_SEED_IDS } from "../lib/reference-data/seed-reference-ids";
import { grantPilotPermissions } from "../lib/server/auth/pilot-account";

/** Pilotos menores vinculados a Lucas Mendes (piloto@gurgelteam.com.br). */
export const LINKED_PILOT_SEED_IDS = {
  guardianLucas: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbb001",
  clientTheo: "33333333-3333-4333-8333-333333333304",
  clientLara: "33333333-3333-4333-8333-333333333305",
  userTheo: "55555555-5555-4555-8555-555555555502",
  userLara: "55555555-5555-4555-8555-555555555503",
} as const;

type SeedLinkedPilotsParams = {
  userPilotoId: string;
  userPilotoEmail: string;
  userPilotoPhone?: string | null;
  passwordHash: string;
};

export async function seedLinkedPilotsForLucas(
  prisma: PrismaClient,
  params: SeedLinkedPilotsParams,
): Promise<void> {
  await prisma.guardian.upsert({
    where: { id: LINKED_PILOT_SEED_IDS.guardianLucas },
    update: {
      name: "Lucas Mendes",
      email: params.userPilotoEmail,
      phone: params.userPilotoPhone ?? null,
    },
    create: {
      id: LINKED_PILOT_SEED_IDS.guardianLucas,
      name: "Lucas Mendes",
      email: params.userPilotoEmail,
      phone: params.userPilotoPhone ?? null,
    },
  });

  const minors = [
    {
      clientId: LINKED_PILOT_SEED_IDS.clientTheo,
      userId: LINKED_PILOT_SEED_IDS.userTheo,
      firstName: "Theo",
      lastName: "Mendes",
      username: "theo.mendes",
      cpf: "52998224725",
      birthDate: new Date("2015-03-12T12:00:00.000Z"),
      skillLevelId: REFERENCE_SEED_IDS.skillLevels.intermediario,
      bestLapMs: 58432,
      totalSessions: 14,
      relationship: "filho",
    },
    {
      clientId: LINKED_PILOT_SEED_IDS.clientLara,
      userId: LINKED_PILOT_SEED_IDS.userLara,
      firstName: "Lara",
      lastName: "Mendes",
      username: "lara.mendes",
      cpf: "39053344705",
      birthDate: new Date("2017-08-20T12:00:00.000Z"),
      skillLevelId: REFERENCE_SEED_IDS.skillLevels.iniciante,
      bestLapMs: 62180,
      totalSessions: 6,
      relationship: "filha",
    },
  ] as const;

  for (const minor of minors) {
    await prisma.client.upsert({
      where: { id: minor.clientId },
      update: {
        name: `${minor.firstName} ${minor.lastName}`,
        skillLevelId: minor.skillLevelId,
        isMinor: true,
        bestLapMs: minor.bestLapMs,
        totalSessions: minor.totalSessions,
        city: "Brasília",
        state: "DF",
        notifyWhatsapp: true,
        notifyEmail: true,
        emergencyName: "Lucas Mendes",
        emergencyPhone: params.userPilotoPhone ?? "(61) 99999-0001",
        emergencyRelation: "Pai",
      },
      create: {
        id: minor.clientId,
        name: `${minor.firstName} ${minor.lastName}`,
        phone: "(61) 98888-0000",
        skillLevelId: minor.skillLevelId,
        status: "Ativo",
        isMinor: true,
        bestLapMs: minor.bestLapMs,
        totalSessions: minor.totalSessions,
        memberSince: new Date("2024-06-01"),
        city: "Brasília",
        state: "DF",
        notifyWhatsapp: true,
        notifyEmail: true,
        emergencyName: "Lucas Mendes",
        emergencyPhone: params.userPilotoPhone ?? "(61) 99999-0001",
        emergencyRelation: "Pai",
      },
    });

    await prisma.clientCategory.upsert({
      where: {
        clientId_categoryId: {
          clientId: minor.clientId,
          categoryId: REFERENCE_SEED_IDS.categories.mirimCadete,
        },
      },
      update: {},
      create: {
        clientId: minor.clientId,
        categoryId: REFERENCE_SEED_IDS.categories.mirimCadete,
      },
    });

    const email = `${minor.username}@piloto-vinculado.local`;

    await prisma.user.upsert({
      where: { id: minor.userId },
      update: {
        email,
        username: minor.username,
        firstName: minor.firstName,
        lastName: minor.lastName,
        cpf: minor.cpf,
        birthDate: minor.birthDate,
        roleKey: RoleKey.recepcao,
        clientId: minor.clientId,
        passwordHash: params.passwordHash,
        active: true,
      },
      create: {
        id: minor.userId,
        email,
        username: minor.username,
        firstName: minor.firstName,
        lastName: minor.lastName,
        cpf: minor.cpf,
        birthDate: minor.birthDate,
        roleKey: RoleKey.recepcao,
        clientId: minor.clientId,
        passwordHash: params.passwordHash,
        active: true,
      },
    });

    await grantPilotPermissions(minor.userId);

    await prisma.guardianLink.upsert({
      where: {
        guardianId_clientId: {
          guardianId: LINKED_PILOT_SEED_IDS.guardianLucas,
          clientId: minor.clientId,
        },
      },
      update: {
        authorizationSigned: true,
        documentsOnFile: true,
        relationship: minor.relationship,
      },
      create: {
        guardianId: LINKED_PILOT_SEED_IDS.guardianLucas,
        clientId: minor.clientId,
        authorizationSigned: true,
        documentsOnFile: true,
        relationship: minor.relationship,
      },
    });
  }

  const futureEvent = await prisma.scheduleEvent.findFirst({
    where: {
      clientId: LINKED_PILOT_SEED_IDS.clientTheo,
      startsAt: { gte: new Date() },
    },
  });
  if (!futureEvent) {
    const startsAt = new Date();
    startsAt.setDate(startsAt.getDate() + ((6 - startsAt.getDay() + 7) % 7 || 7));
    startsAt.setHours(14, 30, 0, 0);
    const endsAt = new Date(startsAt);
    endsAt.setHours(16, 0, 0, 0);

    await prisma.scheduleEvent.create({
      data: {
        startsAt,
        endsAt,
        type: "treino_livre",
        status: "confirmado",
        clientId: LINKED_PILOT_SEED_IDS.clientTheo,
        registeredById: params.userPilotoId,
        categoryId: REFERENCE_SEED_IDS.categories.mirimCadete,
      },
    });
  }
}
