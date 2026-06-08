import type { PrismaClient } from "@prisma/client";

import { SCHEDULE_SEED_IDS } from "./seed-schedule";
import { CLIENT_SEED_IDS } from "./seed-clients";

export const KART_SEED_IDS = {
  kart6: "77777777-7777-4777-8777-777777777706",
  kart7: "77777777-7777-4777-8777-777777777707",
  kart9: "77777777-7777-4777-8777-777777777709",
  kart14: "77777777-7777-4777-8777-777777777714",
  kart18: "77777777-7777-4777-8777-777777777718",
} as const;

type SeedKartsParams = {
  categoryF400Id: string;
};

export async function seedKartsData(
  prisma: PrismaClient,
  params: SeedKartsParams,
): Promise<void> {
  const fleet = [
    {
      id: SCHEDULE_SEED_IDS.kart3,
      number: 3,
      status: "em_treino" as const,
      motorRef: "IAME Cadet",
      engineHours: 156,
    },
    {
      id: SCHEDULE_SEED_IDS.kart4,
      number: 4,
      status: "disponivel" as const,
      motorRef: "IAME X30",
      engineHours: 220,
    },
    {
      id: SCHEDULE_SEED_IDS.kart5,
      number: 5,
      status: "disponivel" as const,
      motorRef: "IAME X30",
      engineHours: 412,
    },
    {
      id: SCHEDULE_SEED_IDS.kart12,
      number: 12,
      status: "manutencao" as const,
      motorRef: "IAME KZ",
      engineHours: 690,
    },
    {
      id: KART_SEED_IDS.kart6,
      number: 6,
      status: "em_treino" as const,
      motorRef: "IAME X30",
      engineHours: 378,
    },
    {
      id: KART_SEED_IDS.kart7,
      number: 7,
      status: "reservado" as const,
      motorRef: "Rotax Max",
      engineHours: 528,
    },
    {
      id: KART_SEED_IDS.kart9,
      number: 9,
      status: "lavagem" as const,
      motorRef: "IAME Mini",
      engineHours: 89,
    },
    {
      id: KART_SEED_IDS.kart14,
      number: 14,
      status: "disponivel" as const,
      motorRef: "IAME Rental",
      engineHours: 312,
    },
    {
      id: KART_SEED_IDS.kart18,
      number: 18,
      status: "disponivel" as const,
      ownership: "client" as const,
      clientId: CLIENT_SEED_IDS.clientMarina,
      motorRef: "IAME Mini",
      engineHours: 198,
    },
  ];

  for (const kart of fleet) {
    await prisma.kart.upsert({
      where: { number: kart.number },
      update: {
        status: kart.status,
        motorRef: kart.motorRef,
        engineHours: kart.engineHours,
        categoryId: params.categoryF400Id,
        ...(kart.ownership ? { ownership: kart.ownership } : {}),
        ...(kart.clientId ? { clientId: kart.clientId } : {}),
      },
      create: {
        id: kart.id,
        number: kart.number,
        categoryId: params.categoryF400Id,
        status: kart.status,
        motorRef: kart.motorRef,
        engineHours: kart.engineHours,
        ownership: kart.ownership ?? "rental",
        clientId: kart.clientId ?? null,
        lastMaintenanceAt: new Date("2026-04-15"),
        nextMaintenanceHours: 750,
      },
    });
  }
}
