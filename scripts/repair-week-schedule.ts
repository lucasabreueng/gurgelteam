/**
 * Restaura a grade semanal a partir do template WEEK_SCHEDULE (uma categoria/nível por slot).
 * Uso: npm run repair:week-schedule
 */
import { prisma } from "@/lib/server/prisma";
import { seedWeekScheduleData } from "../prisma/seed-week-schedule";

async function main() {
  await seedWeekScheduleData(prisma);
  console.info("Grade semanal restaurada a partir do template padrão.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
