import type { PrismaClient } from "@prisma/client";

export const CLIENT_SEED_IDS = {
  skillIntermediario: "11111111-1111-4111-8111-111111111102",
  skillAvancado: "11111111-1111-4111-8111-111111111103",
  skillCompetidor: "11111111-1111-4111-8111-111111111104",
  clientMarina: "33333333-3333-4333-8333-333333333302",
  clientPedro: "33333333-3333-4333-8333-333333333303",
  guardianCarlos: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
} as const;

type SeedClientsParams = {
  categoryF400Id: string;
  skillLevelInicianteId: string;
};

export async function seedClientsData(
  prisma: PrismaClient,
  params: SeedClientsParams,
): Promise<void> {
  const levels = [
    {
      id: params.skillLevelInicianteId,
      slug: "iniciante",
      name: "Iniciante",
      sortOrder: 1,
    },
    {
      id: CLIENT_SEED_IDS.skillIntermediario,
      slug: "intermediario",
      name: "Intermediário",
      sortOrder: 2,
    },
    {
      id: CLIENT_SEED_IDS.skillAvancado,
      slug: "avancado",
      name: "Avançado",
      sortOrder: 3,
    },
    {
      id: CLIENT_SEED_IDS.skillCompetidor,
      slug: "competidor",
      name: "Competidor",
      sortOrder: 4,
    },
  ];

  for (const level of levels) {
    await prisma.skillLevel.upsert({
      where: { id: level.id },
      update: { name: level.name, slug: level.slug, sortOrder: level.sortOrder },
      create: {
        id: level.id,
        slug: level.slug,
        name: level.name,
        sortOrder: level.sortOrder,
        thresholds: {},
      },
    });
  }

  await prisma.client.upsert({
    where: { id: CLIENT_SEED_IDS.clientMarina },
    update: {},
    create: {
      id: CLIENT_SEED_IDS.clientMarina,
      name: "Marina Souza",
      email: "marina.souza@gurgelteam.com.br",
      skillLevelId: CLIENT_SEED_IDS.skillCompetidor,
      status: "Ativo",
      isMinor: false,
      bestLapMs: 52104,
      consistencyPct: 94,
      totalSessions: 42,
      memberSince: new Date("2023-06-01"),
    },
  });

  await prisma.client.upsert({
    where: { id: CLIENT_SEED_IDS.clientPedro },
    update: {},
    create: {
      id: CLIENT_SEED_IDS.clientPedro,
      name: "Pedro Alves",
      skillLevelId: params.skillLevelInicianteId,
      status: "Ativo",
      isMinor: true,
      consistencyPct: 72,
      totalSessions: 8,
      memberSince: new Date("2025-01-10"),
    },
  });

  for (const clientId of [
    CLIENT_SEED_IDS.clientMarina,
    CLIENT_SEED_IDS.clientPedro,
  ]) {
    await prisma.clientCategory.upsert({
      where: {
        clientId_categoryId: {
          clientId,
          categoryId: params.categoryF400Id,
        },
      },
      update: {},
      create: { clientId, categoryId: params.categoryF400Id },
    });
  }

  await prisma.guardian.upsert({
    where: { id: CLIENT_SEED_IDS.guardianCarlos },
    update: {},
    create: {
      id: CLIENT_SEED_IDS.guardianCarlos,
      name: "Carlos Alves",
      email: "carlos.alves@email.com",
      phone: "(61) 99999-1234",
    },
  });

  await prisma.guardianLink.upsert({
    where: {
      guardianId_clientId: {
        guardianId: CLIENT_SEED_IDS.guardianCarlos,
        clientId: CLIENT_SEED_IDS.clientPedro,
      },
    },
    update: {},
    create: {
      guardianId: CLIENT_SEED_IDS.guardianCarlos,
      clientId: CLIENT_SEED_IDS.clientPedro,
      authorizationSigned: true,
      documentsOnFile: true,
    },
  });
}
