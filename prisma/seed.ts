import { PrismaClient, RoleKey } from "@prisma/client";

import { SETTINGS_USERS } from "../lib/admin-settings-mocks";
import type { ModuleKey } from "../lib/contracts/enums";
import { hashPassword } from "../lib/server/auth/password";
import { seedClientsData, CLIENT_SEED_IDS } from "./seed-clients";
import { seedKartsData } from "./seed-karts";
import { seedReferenceCatalog } from "./seed-reference";
import { seedScheduleData } from "./seed-schedule";
import { seedWeekScheduleData } from "./seed-week-schedule";
import { seedDomainsData } from "./seed-domains";
import { seedLinkedPilotsForLucas } from "./seed-linked-pilots";

const prisma = new PrismaClient();

const SEED_IDS = {
  skillLevelIniciante: "11111111-1111-4111-8111-111111111101",
  categoryF400: "22222222-2222-4222-8222-222222222201",
  clientLucas: "33333333-3333-4333-8333-333333333301",
  userAdmin: "44444444-4444-4444-8444-444444444401",
  userPiloto: "55555555-5555-4555-8555-555555555501",
  userFinanceiro: "66666666-6666-4666-8666-666666666601",
} as const;

type SeedUserDef = {
  id: string;
  settingsId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roleKey: RoleKey;
  clientId: string | null;
};

const SETTINGS_BY_ID = Object.fromEntries(
  SETTINGS_USERS.map((user) => [user.id, user]),
) as Record<string, (typeof SETTINGS_USERS)[number]>;

const SEED_USERS: SeedUserDef[] = [
  {
    id: SEED_IDS.userAdmin,
    settingsId: "user-administrador",
    email: "ana.silva@gurgelteam.com.br",
    username: "ana.silva",
    firstName: "Ana",
    lastName: "Silva",
    roleKey: RoleKey.admin,
    clientId: null,
  },
  {
    id: SEED_IDS.userPiloto,
    settingsId: "user-piloto",
    email: "piloto@gurgelteam.com.br",
    username: "lucas.mendes",
    firstName: "Lucas",
    lastName: "Mendes",
    roleKey: RoleKey.recepcao,
    clientId: SEED_IDS.clientLucas,
  },
  {
    id: SEED_IDS.userFinanceiro,
    settingsId: "user-financeiro",
    email: "financeiro@gurgelteam.com.br",
    username: "financeiro",
    firstName: "Carla",
    lastName: "Financeiro",
    roleKey: RoleKey.financeiro,
    clientId: null,
  },
];

function getSeedPassword(): string {
  return process.env.SEED_DEFAULT_PASSWORD?.trim() || "Gurgel@123";
}

async function seedReferenceData(): Promise<void> {
  await seedReferenceCatalog(prisma);
  await prisma.client.upsert({
    where: { id: SEED_IDS.clientLucas },
    update: {},
    create: {
      id: SEED_IDS.clientLucas,
      name: "Lucas Mendes",
      email: "piloto@gurgelteam.com.br",
      skillLevelId: SEED_IDS.skillLevelIniciante,
      status: "Ativo",
      isMinor: false,
      memberSince: new Date("2024-01-15"),
    },
  });

  await prisma.clientCategory.upsert({
    where: {
      clientId_categoryId: {
        clientId: SEED_IDS.clientLucas,
        categoryId: SEED_IDS.categoryF400,
      },
    },
    update: {},
    create: {
      clientId: SEED_IDS.clientLucas,
      categoryId: SEED_IDS.categoryF400,
    },
  });
}

async function seedUsers(passwordHash: string): Promise<void> {
  for (const seedUser of SEED_USERS) {
    await prisma.user.upsert({
      where: { id: seedUser.id },
      update: {
        email: seedUser.email,
        username: seedUser.username,
        firstName: seedUser.firstName,
        lastName: seedUser.lastName,
        roleKey: seedUser.roleKey,
        clientId: seedUser.clientId,
        passwordHash,
        active: true,
      },
      create: {
        id: seedUser.id,
        email: seedUser.email,
        username: seedUser.username,
        firstName: seedUser.firstName,
        lastName: seedUser.lastName,
        roleKey: seedUser.roleKey,
        clientId: seedUser.clientId,
        passwordHash,
        active: true,
      },
    });

    const settings = SETTINGS_BY_ID[seedUser.settingsId];
    if (!settings) continue;

    for (const moduleKey of Object.keys(settings.modules) as ModuleKey[]) {
      const permission = settings.modules[moduleKey];
      await prisma.modulePermission.upsert({
        where: {
          userId_moduleKey: {
            userId: seedUser.id,
            moduleKey,
          },
        },
        update: {
          canView: permission.visualizar,
          canEdit: permission.editar,
          canDelete: permission.excluir,
        },
        create: {
          userId: seedUser.id,
          moduleKey,
          canView: permission.visualizar,
          canEdit: permission.editar,
          canDelete: permission.excluir,
        },
      });
    }
  }
}

async function main(): Promise<void> {
  const passwordHash = hashPassword(getSeedPassword());
  await seedReferenceData();
  await seedWeekScheduleData(prisma);
  await seedClientsData(prisma, {
    categoryF400Id: SEED_IDS.categoryF400,
    skillLevelInicianteId: SEED_IDS.skillLevelIniciante,
  });
  await prisma.client.update({
    where: { id: SEED_IDS.clientLucas },
    data: {
      skillLevelId: CLIENT_SEED_IDS.skillAvancado,
      bestLapMs: 54821,
      consistencyPct: 91,
      totalSessions: 36,
      phone: "(61) 99999-0001",
      city: "Brasília",
      state: "DF",
      emergencyName: "Mariana Mendes",
      emergencyPhone: "(61) 98888-1234",
      emergencyRelation: "Cônjuge",
    },
  });
  await seedUsers(passwordHash);
  await seedLinkedPilotsForLucas(prisma, {
    userPilotoId: SEED_IDS.userPiloto,
    userPilotoEmail: "piloto@gurgelteam.com.br",
    userPilotoPhone: "(61) 99999-0001",
    passwordHash,
  });
  await seedScheduleData(prisma, {
    categoryF400Id: SEED_IDS.categoryF400,
    clientLucasId: SEED_IDS.clientLucas,
    userAdminId: SEED_IDS.userAdmin,
  });
  await seedKartsData(prisma, { categoryF400Id: SEED_IDS.categoryF400 });
  const karts = await prisma.kart.findMany({ select: { id: true }, take: 3 });
  await seedDomainsData(prisma, {
    clientLucasId: SEED_IDS.clientLucas,
    clientMarinaId: CLIENT_SEED_IDS.clientMarina,
    kartIds: karts.map((k) => k.id),
  });
  console.info("[seed] Dados demo criados. Senha padrão:", getSeedPassword());
}

main()
  .catch((error) => {
    console.error("[seed] Falhou:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
