import { PrismaClient } from "@prisma/client";

const username = process.argv[2]?.trim();
if (!username) {
  console.error("Uso: npx tsx scripts/delete-user-by-username.ts <username>");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    console.info(`Usuário "${username}" não encontrado.`);
    return;
  }

  const clientId = user.clientId;

  await prisma.$transaction(async (tx) => {
    await tx.user.delete({ where: { id: user.id } });
    if (clientId) {
      await tx.clientCategory.deleteMany({ where: { clientId } });
      await tx.client.delete({ where: { id: clientId } });
    }
  });

  console.info(`Usuário "${username}" removido com sucesso.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
