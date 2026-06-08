/**
 * Remove todos os karts e dependências diretas (manutenção, vínculo na agenda).
 * Uso: npx tsx scripts/delete-all-karts.ts
 */
import { prisma } from "@/lib/server/prisma";

async function main() {
  const karts = await prisma.kart.findMany({ select: { id: true, number: true } });
  if (karts.length === 0) {
    console.info("Nenhum kart na tabela.");
    return;
  }

  const kartIds = karts.map((k) => k.id);
  console.info(`Removendo ${karts.length} kart(s): ${karts.map((k) => k.number).join(", ")}`);

  await prisma.$transaction(async (tx) => {
    const orders = await tx.maintenanceOrder.findMany({
      where: { kartId: { in: kartIds } },
      select: { id: true },
    });
    const orderIds = orders.map((o) => o.id);

    if (orderIds.length > 0) {
      await tx.maintenancePartUse.deleteMany({
        where: { maintenanceOrderId: { in: orderIds } },
      });
      await tx.maintenanceInspection.deleteMany({
        where: { maintenanceOrderId: { in: orderIds } },
      });
      await tx.maintenanceOrder.deleteMany({
        where: { id: { in: orderIds } },
      });
    }

    const inspectionsOnly = await tx.maintenanceInspection.deleteMany({
      where: { kartId: { in: kartIds } },
    });

    const eventsDetached = await tx.scheduleEvent.updateMany({
      where: { kartId: { in: kartIds } },
      data: { kartId: null },
    });

    const deleted = await tx.kart.deleteMany({
      where: { id: { in: kartIds } },
    });

    console.info(
      `  ordens de manutenção: ${orderIds.length}, inspeções avulsas: ${inspectionsOnly.count}, eventos desvinculados: ${eventsDetached.count}, karts removidos: ${deleted.count}`,
    );
  });

  console.info("Concluído.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
