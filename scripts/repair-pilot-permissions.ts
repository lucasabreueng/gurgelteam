/**
 * Garante permissões de módulos piloto (incl. pilotoAgenda edit para reservar).
 * Uso: npm run repair:pilot-permissions
 */
import { PrismaClient } from "@prisma/client";

import { grantPilotPermissions } from "../lib/server/auth/pilot-account";

const prisma = new PrismaClient();

async function main() {
  const pilots = await prisma.user.findMany({
    where: { clientId: { not: null }, active: true },
    select: { id: true, email: true },
  });

  for (const pilot of pilots) {
    await grantPilotPermissions(pilot.id);
    console.log(`OK: ${pilot.email}`);
  }

  console.log(`\n${pilots.length} conta(s) piloto atualizada(s).`);
}

main()
  .catch((error) => {
    console.error("[repair:pilot-permissions] Falhou:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
