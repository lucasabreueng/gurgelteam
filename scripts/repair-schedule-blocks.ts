/**
 * Remove bloqueios inválidos (slotIds legados como "08:00") e normaliza blockDate.
 * Uso:
 *   npm run repair:schedule-blocks
 *   npm run repair:schedule-blocks -- --clear-all
 */
import { prisma } from "@/lib/server/prisma";
import { isoDateToDbDate } from "@/lib/server/schedule/schedule-hours-utils";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function clearAllBlocks() {
  const before = await prisma.scheduleBlock.count();
  if (before === 0) {
    console.info("Nenhum bloqueio cadastrado.");
    return;
  }
  const { count } = await prisma.scheduleBlock.deleteMany();
  console.info(`Removidos ${count} bloqueio(s) de teste/legado.`);
}

async function repairBlocks() {
  const blocks = await prisma.scheduleBlock.findMany();
  let removed = 0;
  let normalized = 0;

  for (const block of blocks) {
    const invalidSlotIds = block.slotIds.filter((id) => !UUID_RE.test(id));
    if (invalidSlotIds.length > 0) {
      await prisma.scheduleBlock.delete({ where: { id: block.id } });
      removed += 1;
      console.info(
        `Removido bloqueio ${block.id.slice(0, 8)} (slotIds inválidos: ${invalidSlotIds.join(", ")})`,
      );
      continue;
    }

    const isoFromUtc = block.blockDate.toISOString().slice(0, 10);
    const isoFromSp = block.blockDate.toLocaleDateString("en-CA", {
      timeZone: "America/Sao_Paulo",
    });
    const canonical = isoFromUtc.length === 10 ? isoFromUtc : isoFromSp;
    const expected = isoDateToDbDate(canonical).getTime();
    if (block.blockDate.getTime() !== expected) {
      await prisma.scheduleBlock.update({
        where: { id: block.id },
        data: { blockDate: isoDateToDbDate(canonical) },
      });
      normalized += 1;
      console.info(`Normalizado blockDate do bloqueio ${block.id.slice(0, 8)} → ${canonical}`);
    }
  }

  console.info(
    `Concluído: ${removed} bloqueio(s) removido(s), ${normalized} data(s) normalizada(s).`,
  );
}

async function main() {
  if (process.argv.includes("--clear-all")) {
    await clearAllBlocks();
    return;
  }
  await repairBlocks();
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
