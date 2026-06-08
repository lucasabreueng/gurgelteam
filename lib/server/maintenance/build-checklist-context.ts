import { prisma } from "@/lib/server/prisma";

export type ChecklistSmartAlert = {
  id: string;
  message: string;
  severity: "info" | "warn" | "urgent";
};

export type ChecklistHistoryRow = {
  id: string;
  date: string;
  responsible: string;
  result: string;
  photos: number;
  notes: string;
};

const OVERALL_LABELS: Record<string, string> = {
  liberado: "Liberado",
  restrito: "Restrito",
  bloqueado: "Bloqueado",
};

function formatDateTimePt(date: Date): string {
  return date.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function buildChecklistSmartAlerts(): Promise<ChecklistSmartAlert[]> {
  const [openOrders, karts] = await Promise.all([
    prisma.maintenanceOrder.findMany({
      where: { status: { not: "concluida" } },
      include: { kart: { select: { number: true } } },
      orderBy: { detectedAt: "desc" },
      take: 6,
    }),
    prisma.kart.findMany({
      where: {
        status: { in: ["manutencao", "aguardando_peca", "indisponivel"] },
      },
      select: { id: true, number: true, status: true },
    }),
  ]);

  const alerts: ChecklistSmartAlert[] = openOrders.map((order) => ({
    id: `os-${order.id}`,
    message: `Kart ${order.kart.number}: ${order.title}`,
    severity: order.status === "pendente" ? ("urgent" as const) : ("warn" as const),
  }));

  for (const kart of karts) {
    alerts.push({
      id: `kart-${kart.id}`,
      message:
        kart.status === "aguardando_peca"
          ? `Kart ${kart.number} aguardando peça.`
          : kart.status === "manutencao"
            ? `Kart ${kart.number} em manutenção.`
            : `Kart ${kart.number} indisponível.`,
      severity: kart.status === "indisponivel" ? "info" : "warn",
    });
  }

  return alerts.slice(0, 8);
}

export async function buildChecklistHistory(): Promise<ChecklistHistoryRow[]> {
  const [inspections, orders] = await Promise.all([
    prisma.maintenanceInspection.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { kart: { select: { number: true } } },
    }),
    prisma.maintenanceOrder.findMany({
      orderBy: { updatedAt: "desc" },
      take: 24,
      include: { kart: { select: { number: true } } },
    }),
  ]);

  const rows: ChecklistHistoryRow[] = [];

  for (const insp of inspections) {
    const payload = insp.payload as { notes?: string } | null;
    rows.push({
      id: insp.id,
      date: formatDateTimePt(insp.createdAt),
      responsible: insp.signedBy ?? "Equipe técnica",
      result:
        OVERALL_LABELS[insp.overallStatus ?? ""] ??
        insp.overallStatus ??
        "Registrado",
      photos: 0,
      notes:
        payload?.notes?.trim() ||
        `Checklist ${insp.checklistType} · Kart ${insp.kart.number}`,
    });
  }

  for (const order of orders) {
    if (order.checklistData == null) continue;
    const data = order.checklistData as {
      notes?: string;
      overallStatus?: string;
    } | null;
    if (!data) continue;
    rows.push({
      id: `order-${order.id}`,
      date: formatDateTimePt(order.updatedAt),
      responsible: order.assignedTo ?? "Equipe técnica",
      result:
        OVERALL_LABELS[data.overallStatus ?? ""] ??
        data.overallStatus ??
        "Registrado",
      photos: 0,
      notes: data.notes?.trim() || order.title,
    });
  }

  rows.sort((a, b) => (a.date < b.date ? 1 : -1));
  return rows.slice(0, 10);
}

export async function buildChecklistContext() {
  const [smartAlerts, history] = await Promise.all([
    buildChecklistSmartAlerts(),
    buildChecklistHistory(),
  ]);
  return { smartAlerts, history };
}
