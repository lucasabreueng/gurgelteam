import { prisma } from "@/lib/server/prisma";
import type { ReceivableStatus } from "@/lib/contracts/finance";
import type { OperationalKpi } from "@/lib/admin-financial-mocks";
import { FINANCIAL_REPORTS } from "@/lib/admin-financial-mocks";

function currentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );
  return { start, end };
}

function weekRange() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

export async function buildFinanceMeta() {
  const { start: monthStart, end: monthEnd } = currentMonthRange();
  const { start: weekStart, end: weekEnd } = weekRange();

  const [
    activeClients,
    lessonsMonth,
    lessonsWeek,
    karts,
    receivableServices,
    receivableMethods,
    payableCategories,
    clients,
    paymentMethods,
  ] = await Promise.all([
    prisma.client.count({ where: { status: "Ativo" } }),
    prisma.scheduleEvent.count({
      where: {
        status: "finalizado",
        startsAt: { gte: monthStart, lte: monthEnd },
      },
    }),
    prisma.scheduleEvent.count({
      where: {
        status: { in: ["confirmado", "pendente", "em_andamento"] },
        startsAt: { gte: weekStart, lte: weekEnd },
      },
    }),
    prisma.kart.findMany({ select: { status: true } }),
    prisma.accountReceivable.findMany({
      distinct: ["serviceLabel"],
      select: { serviceLabel: true },
      orderBy: { serviceLabel: "asc" },
    }),
    prisma.accountReceivable.findMany({
      where: { paymentMethod: { not: null } },
      distinct: ["paymentMethod"],
      select: { paymentMethod: true },
    }),
    prisma.accountPayable.findMany({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
    prisma.client.findMany({
      where: { status: "Ativo" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
      take: 100,
    }),
    prisma.payment.findMany({
      distinct: ["method"],
      select: { method: true },
      orderBy: { method: "asc" },
    }),
  ]);

  const disponiveis = karts.filter((k) => k.status === "disponivel").length;
  const emManutencao = karts.filter(
    (k) => k.status === "manutencao" || k.status === "aguardando_peca",
  ).length;

  const operationalKpis: OperationalKpi[] = [
    {
      id: "active-students",
      label: "Alunos ativos",
      value: String(activeClients),
      sub: "Clientes com status ativo",
    },
    {
      id: "lessons-month",
      label: "Aulas realizadas no mês",
      value: String(lessonsMonth),
      sub: "Eventos finalizados",
    },
    {
      id: "lessons-week",
      label: "Aulas agendadas (7 dias)",
      value: String(lessonsWeek),
      sub: "Próximos 7 dias",
    },
    {
      id: "karts-available",
      label: "Karts disponíveis",
      value: String(disponiveis),
      sub: `de ${karts.length} na frota`,
    },
    {
      id: "karts-maintenance",
      label: "Karts em manutenção",
      value: String(emManutencao),
      sub: "Indisponíveis por OS",
    },
  ];

  const receivableStatusFilterOptions: {
    value: ReceivableStatus | "";
    label: string;
  }[] = [
    { value: "", label: "Status" },
    { value: "pago", label: "Pago" },
    { value: "pendente", label: "Pendente" },
    { value: "vencido", label: "Vencido" },
    { value: "parcial", label: "Parcial" },
  ];

  return {
    financialReports: FINANCIAL_REPORTS,
    operationalKpis,
    receivableFilterOptions: receivableStatusFilterOptions,
    receivablePaymentMethods: receivableMethods
      .map((row) => row.paymentMethod)
      .filter((m): m is string => Boolean(m?.trim())),
    receivableServices: receivableServices.map((row) => row.serviceLabel),
    payableCategories: payableCategories.map((row) => row.category),
    paymentClientOptions: clients.map((c) => ({
      value: c.id,
      label: c.name,
    })),
    paymentMethodOptions: paymentMethods.map((row) => ({
      value: row.method.toLowerCase(),
      label: row.method,
    })),
    paymentServiceOptions: receivableServices.map((row) => ({
      value: row.serviceLabel.toLowerCase().replace(/\s+/g, "-"),
      label: row.serviceLabel,
    })),
    tablePageSizes: [10, 25, 50] as const,
    packageStatusLabels: {
      ativo: "Ativo",
      expirando: "Expirando",
      esgotado: "Esgotado",
    },
  };
}

export type FinanceMetaPayload = Awaited<ReturnType<typeof buildFinanceMeta>>;
