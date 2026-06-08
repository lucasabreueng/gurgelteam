/**
 * Restaura fixtures para smoke determinístico (aula + receivable pendente).
 * Uso: npm run smoke:setup  (após db:seed ou entre runs de smoke)
 */
import { PrismaClient } from "@prisma/client";

import { toScheduleTimestamp } from "../lib/server/schedule/map-event";
import { DOMAIN_SEED_IDS } from "../prisma/seed-domains";
import { SCHEDULE_SEED_IDS } from "../prisma/seed-schedule";
import { SMOKE_FIXTURES } from "./smoke-fixtures";

const prisma = new PrismaClient();

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const categoryF400Id = "22222222-2222-4222-8222-222222222201";
  const userAdminId = "44444444-4444-4444-8444-444444444401";

  const kart12 = await prisma.kart.upsert({
    where: { number: 12 },
    update: { status: "disponivel", categoryId: categoryF400Id },
    create: {
      id: SMOKE_FIXTURES.kart12Id,
      number: 12,
      categoryId: categoryF400Id,
      status: "disponivel",
    },
  });

  await prisma.scheduleEvent.upsert({
    where: { id: SMOKE_FIXTURES.eventLucasTreinoId },
    update: {
      startsAt: toScheduleTimestamp(today, "14:30"),
      endsAt: toScheduleTimestamp(today, "15:30"),
      status: "confirmado",
      kartId: kart12.id,
      clientId: SMOKE_FIXTURES.clientLucasId,
    },
    create: {
      id: SMOKE_FIXTURES.eventLucasTreinoId,
      startsAt: toScheduleTimestamp(today, "14:30"),
      endsAt: toScheduleTimestamp(today, "15:30"),
      type: "treino_avancado",
      status: "confirmado",
      clientId: SMOKE_FIXTURES.clientLucasId,
      registeredById: userAdminId,
      kartId: kart12.id,
      categoryId: categoryF400Id,
      paymentStatus: "pendente",
      notes: "Smoke fixture — treino Lucas",
    },
  });

  await prisma.lessonSession.upsert({
    where: { id: SMOKE_FIXTURES.lessonSessionId },
    update: {
      status: "aguardando",
      registrationPayload: null,
      kartNumber: 12,
    },
    create: {
      id: SMOKE_FIXTURES.lessonSessionId,
      scheduleEventId: SMOKE_FIXTURES.eventLucasTreinoId,
      clientId: SMOKE_FIXTURES.clientLucasId,
      status: "aguardando",
      categoryLabel: "F400",
      typeLabel: "Treino avançado",
      registeredByName: "Ana Silva",
      kartNumber: 12,
      objective: "Smoke fixture",
    },
  });

  await prisma.accountReceivable.upsert({
    where: { id: SMOKE_FIXTURES.receivablePendenteId },
    update: {
      status: "pendente",
      amountCents: 35_000,
      paymentMethod: "Pix",
    },
    create: {
      id: SMOKE_FIXTURES.receivablePendenteId,
      clientId: SMOKE_FIXTURES.clientLucasId,
      amountCents: 35_000,
      dueDate: new Date(`${today}T00:00:00.000-03:00`),
      status: "pendente",
      paymentMethod: "Pix",
      serviceLabel: "Aula individual F400",
    },
  });

  await prisma.accountReceivable.upsert({
    where: { id: SMOKE_FIXTURES.receivableSmokePayId },
    update: {
      status: "pendente",
      amountCents: 10_000,
      paymentMethod: "Pix",
    },
    create: {
      id: SMOKE_FIXTURES.receivableSmokePayId,
      clientId: SMOKE_FIXTURES.clientLucasId,
      amountCents: 10_000,
      dueDate: new Date(`${today}T00:00:00.000-03:00`),
      status: "pendente",
      paymentMethod: "Pix",
      serviceLabel: "Smoke payment test",
    },
  });

  // Garante supplier/part para purchase-order smoke
  await prisma.supplier.upsert({
    where: { id: DOMAIN_SEED_IDS.supplierBrasil },
    update: {},
    create: {
      id: DOMAIN_SEED_IDS.supplierBrasil,
      code: "FOR-001",
      name: "Brasil Racing Parts",
      city: "São Paulo",
      active: true,
      avgLeadDays: 5,
    },
  });

  await prisma.inventoryPart.upsert({
    where: { id: DOMAIN_SEED_IDS.partPneu },
    update: {},
    create: {
      id: DOMAIN_SEED_IDS.partPneu,
      code: "PNM-001",
      name: "Pneu slick 10x4.5",
      category: "Pneus",
      stockQty: 12,
      minStockQty: 8,
      unitCostCents: 42_000,
      supplierId: DOMAIN_SEED_IDS.supplierBrasil,
    },
  });

  const userPilotoId = "55555555-5555-4555-8555-555555555501";
  await prisma.modulePermission.upsert({
    where: {
      userId_moduleKey: {
        userId: userPilotoId,
        moduleKey: "pilotoAgenda",
      },
    },
    update: { canView: true, canEdit: true },
    create: {
      userId: userPilotoId,
      moduleKey: "pilotoAgenda",
      canView: true,
      canEdit: true,
      canDelete: false,
    },
  });

  console.info("[smoke:setup] Fixtures prontos para", today);
}

main()
  .catch((error) => {
    console.error("[smoke:setup] Falhou:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
