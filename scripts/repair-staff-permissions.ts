/**
 * Repara permissões de contas staff (equipe) conforme roleKey / permissionProfileId.
 * Uso: npx tsx scripts/repair-staff-permissions.ts
 */
import { PrismaClient } from "@prisma/client";
import { syncStaffUserPermissions } from "../lib/server/auth/sync-staff-permissions";

const prisma = new PrismaClient();

/** Migração: quem geria equipe via `configuracoes` recebe linha `equipe` equivalente. */
async function backfillEquipeFromConfiguracoes(userId: string): Promise<void> {
  const config = await prisma.modulePermission.findUnique({
    where: { userId_moduleKey: { userId, moduleKey: "configuracoes" } },
  });
  if (!config?.canView && !config?.canEdit) return;

  await prisma.modulePermission.upsert({
    where: { userId_moduleKey: { userId, moduleKey: "equipe" } },
    update: {
      canView: config.canView,
      canEdit: config.canEdit,
      canDelete: config.canDelete,
    },
    create: {
      userId,
      moduleKey: "equipe",
      canView: config.canView,
      canEdit: config.canEdit,
      canDelete: config.canDelete,
    },
  });
}

async function main() {
  const staff = await prisma.user.findMany({
    where: { clientId: null },
    select: {
      id: true,
      email: true,
      roleKey: true,
      clientId: true,
      permissionProfileId: true,
    },
  });

  for (const user of staff) {
    await syncStaffUserPermissions(user);
    await backfillEquipeFromConfiguracoes(user.id);
    console.log(`OK: ${user.email} (${user.roleKey})`);
  }

  console.log(`\n${staff.length} conta(s) da equipe atualizada(s).`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
