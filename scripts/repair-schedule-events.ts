/**
 * Remove eventos de agenda seed/smoke/demo do banco.
 * Uso:
 *   npm run repair:schedule-events
 *   npm run repair:schedule-events -- --clear-all
 */
import { prisma } from "@/lib/server/prisma";

async function detachAndDeleteEvents(eventIds?: string[]) {
  const where = eventIds ? { id: { in: eventIds } } : undefined;

  const lessonSessions = await prisma.lessonSession.findMany({
    where: where ? { scheduleEventId: { in: eventIds } } : undefined,
    select: { id: true },
  });
  const lessonSessionIds = lessonSessions.map((row) => row.id);

  if (lessonSessionIds.length > 0) {
    await prisma.telemetrySession.deleteMany({
      where: { lessonSessionId: { in: lessonSessionIds } },
    });
    await prisma.lessonSession.deleteMany({
      where: { id: { in: lessonSessionIds } },
    });
  }

  await prisma.accountReceivable.updateMany({
    where: where ? { scheduleEventId: { in: eventIds } } : { scheduleEventId: { not: null } },
    data: { scheduleEventId: null },
  });

  const { count } = await prisma.scheduleEvent.deleteMany({ where });
  return count;
}

async function clearAllEvents() {
  const count = await detachAndDeleteEvents();
  console.info(`Removidos ${count} evento(s) de agenda.`);
}

async function clearDemoEvents() {
  const count = await detachAndDeleteEvents();
  console.info(`Removidos ${count} evento(s) de agenda (seed/demo/smoke).`);
}

async function main() {
  if (process.argv.includes("--clear-all")) {
    await clearAllEvents();
    return;
  }
  await clearDemoEvents();
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
