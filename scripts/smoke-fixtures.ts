/**
 * IDs estáveis do seed usados pelo smoke determinístico.
 * Mantidos alinhados a prisma/seed-schedule.ts e prisma/seed-domains.ts.
 */
export const SMOKE_FIXTURES = {
  clientLucasId: "33333333-3333-4333-8333-333333333301",
  kart12Id: "77777777-7777-4777-8777-777777777712",
  eventLucasTreinoId: "88888888-8888-4888-8888-888888888801",
  lessonSessionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
  supplierBrasilId: "77777777-7777-4777-8777-777777777701",
  partPneuId: "88888888-8888-4888-8888-888888888801",
  receivablePendenteId: "99999999-9999-4999-8999-999999999901",
  /** Reservado para pagamento smoke — resetado por smoke:setup. */
  receivableSmokePayId: "dddddddd-dddd-4ddd-8ddd-dddddddddd01",
} as const;
