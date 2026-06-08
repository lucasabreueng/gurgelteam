import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const identifier = process.argv[2] ?? "lucas.abreu";
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: identifier.toLowerCase() },
        { email: identifier.toLowerCase() },
      ],
    },
    include: {
      modulePermissions: true,
      client: { select: { id: true, name: true, status: true } },
    },
  });

  if (!user) {
    console.log("Usuário não encontrado:", identifier);
    return;
  }

  console.log({
    id: user.id,
    email: user.email,
    username: user.username,
    roleKey: user.roleKey,
    clientId: user.clientId,
    active: user.active,
    permissionProfileId: user.permissionProfileId,
    client: user.client,
    modulePermissions: user.modulePermissions,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
