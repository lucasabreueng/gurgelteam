import type { PrismaClient } from "@prisma/client";

export const SCHEDULE_SEED_IDS = {
  kart3: "77777777-7777-4777-8777-777777777703",
  kart4: "77777777-7777-4777-8777-777777777704",
  kart5: "77777777-7777-4777-8777-777777777705",
  kart12: "77777777-7777-4777-8777-777777777712",
} as const;

type SeedScheduleParams = {
  categoryF400Id: string;
  clientLucasId: string;
  userAdminId: string;
};

export async function seedScheduleData(
  prisma: PrismaClient,
  params: SeedScheduleParams,
): Promise<void> {
  const karts = [
    { id: SCHEDULE_SEED_IDS.kart3, number: 3 },
    { id: SCHEDULE_SEED_IDS.kart4, number: 4 },
    { id: SCHEDULE_SEED_IDS.kart5, number: 5 },
    { id: SCHEDULE_SEED_IDS.kart12, number: 12 },
  ];

  for (const kart of karts) {
    await prisma.kart.upsert({
      where: { number: kart.number },
      update: { status: "disponivel", categoryId: params.categoryF400Id },
      create: {
        id: kart.id,
        number: kart.number,
        categoryId: params.categoryF400Id,
        status: "disponivel",
      },
    });
  }
}
