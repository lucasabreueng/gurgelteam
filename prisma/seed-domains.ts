import type { PrismaClient } from "@prisma/client";

import { CLIENT_SEED_IDS } from "./seed-clients";

export const DOMAIN_SEED_IDS = {
  supplierBrasil: "77777777-7777-4777-8777-777777777701",
  supplierRacing: "77777777-7777-4777-8777-777777777702",
  partPneu: "88888888-8888-4888-8888-888888888801",
  partCorrente: "88888888-8888-4888-8888-888888888802",
  partOleo: "88888888-8888-4888-8888-888888888803",
  receivable1: "99999999-9999-4999-8999-999999999901",
  receivable2: "99999999-9999-4999-8999-999999999902",
  payable1: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
  maintenance1: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1",
  telemetry1: "cccccccc-cccc-4ccc-8ccc-ccccccccccc1",
} as const;

type SeedDomainsParams = {
  clientLucasId: string;
  clientMarinaId?: string;
  kartIds: string[];
};

export async function seedDomainsData(
  prisma: PrismaClient,
  params: SeedDomainsParams,
): Promise<void> {
  await prisma.organizationSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      teamName: "Gurgel Team",
      email: "contato@gurgelteam.com.br",
      whatsapp: "+55 11 99999-0000",
      address: "Kartódromo Gurgel Team — São Paulo, SP",
      institutionalText: "Excelência em kart e formação de pilotos.",
    },
  });

  await prisma.supplier.upsert({
    where: { id: DOMAIN_SEED_IDS.supplierBrasil },
    update: {},
    create: {
      id: DOMAIN_SEED_IDS.supplierBrasil,
      code: "FOR-001",
      name: "Brasil Racing Parts",
      city: "São Paulo",
      phone: "(11) 3456-7890",
      email: "vendas@brp.com.br",
      active: true,
      avgLeadDays: 5,
    },
  });

  await prisma.supplier.upsert({
    where: { id: DOMAIN_SEED_IDS.supplierRacing },
    update: {},
    create: {
      id: DOMAIN_SEED_IDS.supplierRacing,
      code: "FOR-002",
      name: "Racing Supply",
      city: "Campinas",
      phone: "(19) 3344-5566",
      active: true,
      avgLeadDays: 7,
    },
  });

  const parts = [
    {
      id: DOMAIN_SEED_IDS.partPneu,
      code: "PNM-001",
      name: "Pneu slick 10x4.5",
      category: "Pneus",
      stockQty: 12,
      minStockQty: 8,
      unitCostCents: 42000,
      supplierId: DOMAIN_SEED_IDS.supplierBrasil,
    },
    {
      id: DOMAIN_SEED_IDS.partCorrente,
      code: "TRN-014",
      name: "Corrente 219",
      category: "Transmissão",
      stockQty: 4,
      minStockQty: 6,
      unitCostCents: 8900,
      supplierId: DOMAIN_SEED_IDS.supplierRacing,
    },
    {
      id: DOMAIN_SEED_IDS.partOleo,
      code: "MOT-003",
      name: "Óleo 2T racing 1L",
      category: "Motor",
      stockQty: 24,
      minStockQty: 10,
      unitCostCents: 4500,
      supplierId: DOMAIN_SEED_IDS.supplierBrasil,
    },
  ];

  for (const part of parts) {
    await prisma.inventoryPart.upsert({
      where: { id: part.id },
      update: {},
      create: part,
    });
  }

  await prisma.accountReceivable.upsert({
    where: { id: DOMAIN_SEED_IDS.receivable1 },
    update: {},
    create: {
      id: DOMAIN_SEED_IDS.receivable1,
      clientId: params.clientLucasId,
      amountCents: 35000,
      dueDate: new Date("2026-06-15T00:00:00.000-03:00"),
      status: "pendente",
      paymentMethod: "Pix",
      serviceLabel: "Aula individual F400",
    },
  });

  await prisma.accountReceivable.upsert({
    where: { id: DOMAIN_SEED_IDS.receivable2 },
    update: {},
    create: {
      id: DOMAIN_SEED_IDS.receivable2,
      clientId: params.clientMarinaId ?? CLIENT_SEED_IDS.clientMarina,
      amountCents: 28000,
      dueDate: new Date("2026-05-20T00:00:00.000-03:00"),
      status: "vencido",
      paymentMethod: "Cartão",
      serviceLabel: "Pacote 4 aulas",
    },
  });

  await prisma.accountPayable.upsert({
    where: { id: DOMAIN_SEED_IDS.payable1 },
    update: {},
    create: {
      id: DOMAIN_SEED_IDS.payable1,
      supplierName: "Brasil Racing Parts",
      category: "Peças",
      amountCents: 156000,
      dueDate: new Date("2026-06-10T00:00:00.000-03:00"),
      status: "pendente",
      paymentMethod: "Boleto",
    },
  });

  const kartId = params.kartIds[0];
  if (kartId) {
    await prisma.maintenanceOrder.upsert({
      where: { id: DOMAIN_SEED_IDS.maintenance1 },
      update: {},
      create: {
        id: DOMAIN_SEED_IDS.maintenance1,
        kartId,
        status: "em_andamento",
        title: "Revisão preventiva motor",
        description: "Troca de corrente e ajuste de freios",
        detectedAt: new Date("2026-05-28T10:00:00.000-03:00"),
        assignedTo: "Carlos Silva",
      },
    });
  }

  const dreSeed = [
    { accountCode: "3.1.1", accountName: "Aulas avulsas", groupKey: "Receita", rowKind: "line", year: 2026, month: 6, amountCents: 4200000, sortOrder: 1 },
    { accountCode: "3.1.2", accountName: "Pacotes", groupKey: "Receita", rowKind: "line", year: 2026, month: 6, amountCents: 2800000, sortOrder: 2 },
    { accountCode: "3.1", accountName: "Receita operacional", groupKey: "Receita", rowKind: "total", year: 2026, month: 6, amountCents: 7000000, sortOrder: 3 },
    { accountCode: "4.1.1", accountName: "Peças e consumíveis", groupKey: "Custos", rowKind: "line", year: 2026, month: 6, amountCents: 890000, sortOrder: 10 },
    { accountCode: "4.1.2", accountName: "Mão de obra", groupKey: "Custos", rowKind: "line", year: 2026, month: 6, amountCents: 450000, sortOrder: 11 },
  ];

  await prisma.dreEntry.deleteMany({ where: { year: 2026, month: 6 } });
  for (const entry of dreSeed) {
    await prisma.dreEntry.create({ data: entry });
  }

  await prisma.cashFlowEntry.deleteMany();
  const cashFlowSeed = [
    { entryDate: new Date("2026-06-01T00:00:00.000-03:00"), type: "entrada" as const, category: "Aulas", description: "Recebimento aulas", amountCents: 350000 },
    { entryDate: new Date("2026-06-02T00:00:00.000-03:00"), type: "entrada" as const, category: "Pacotes", description: "Pacote 4 aulas", amountCents: 280000 },
    { entryDate: new Date("2026-06-03T00:00:00.000-03:00"), type: "saida" as const, category: "Peças", description: "Compra pneus", amountCents: 156000 },
    { entryDate: new Date("2026-06-05T00:00:00.000-03:00"), type: "saida" as const, category: "Operacional", description: "Energia kartódromo", amountCents: 89000 },
  ];

  for (const entry of cashFlowSeed) {
    await prisma.cashFlowEntry.create({ data: entry });
  }

  await prisma.telemetrySession.upsert({
    where: { id: DOMAIN_SEED_IDS.telemetry1 },
    update: {},
    create: {
      id: DOMAIN_SEED_IDS.telemetry1,
      clientId: params.clientLucasId,
      status: "COMPLETED",
      source: "alfano",
      trackId: "interlagos",
      processedAt: new Date("2026-05-25T14:00:00.000-03:00"),
      laps: {
        create: [
          { lapNumber: 1, lapTimeMs: 52340, valid: true, sectorTimesMs: [17200, 18100, 17040] },
          { lapNumber: 2, lapTimeMs: 51890, valid: true, sectorTimesMs: [17050, 17940, 16900] },
        ],
      },
    },
  });
}
