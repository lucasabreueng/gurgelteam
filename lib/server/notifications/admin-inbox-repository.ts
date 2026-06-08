import type { AdminInboxNotification } from "@/lib/contracts/admin-inbox-notification";
import { getUnreadAdminInboxNotifications } from "@/lib/admin-notifications-mocks";
import { formatCentsBrl } from "@/lib/server/format-money";
import { prisma } from "@/lib/server/prisma";

function formatRelativeLabel(date: Date, now = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "Agora";
  if (diffMin < 60) return `Há ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Há ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Ontem";
  if (diffD < 7) return `Há ${diffD} dias`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export async function listAdminInboxNotifications(): Promise<
  AdminInboxNotification[]
> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const items: AdminInboxNotification[] = [];

  const overdueReceivables = await prisma.accountReceivable.findMany({
    where: {
      status: { in: ["pendente", "vencido"] },
      dueDate: { lt: today },
    },
    orderBy: { dueDate: "asc" },
    take: 4,
    include: { client: { select: { name: true } } },
  });

  if (overdueReceivables.length === 1) {
    const row = overdueReceivables[0]!;
    items.push({
      id: `recv-${row.id}`,
      title: "Cobrança em atraso",
      message: `${row.client.name} · ${formatCentsBrl(row.amountCents)}`,
      createdAtLabel: formatRelativeLabel(row.dueDate, now),
      read: false,
      href: "/admin/financeiro",
    });
  } else if (overdueReceivables.length > 1) {
    const totalCents = overdueReceivables.reduce(
      (sum, row) => sum + row.amountCents,
      0,
    );
    items.push({
      id: "inbox-overdue-receivables",
      title: "Títulos em atraso",
      message: `${overdueReceivables.length} clientes · ${formatCentsBrl(totalCents)}`,
      createdAtLabel: formatRelativeLabel(overdueReceivables[0]!.dueDate, now),
      read: false,
      href: "/admin/financeiro",
    });
  }

  const openMaintenance = await prisma.maintenanceOrder.findMany({
    where: { status: { in: ["pendente", "em_andamento"] } },
    orderBy: { detectedAt: "desc" },
    take: 3,
    include: { kart: { select: { number: true } } },
  });

  if (openMaintenance.length > 0) {
    const latest = openMaintenance[0]!;
    const kartLabel = `Kart #${latest.kart.number}`;
    items.push({
      id: "inbox-maintenance",
      title: "Manutenção em aberto",
      message:
        openMaintenance.length === 1
          ? `${kartLabel} — ${latest.title}`
          : `${openMaintenance.length} OS abertas · última: ${kartLabel}`,
      createdAtLabel: formatRelativeLabel(latest.detectedAt, now),
      read: false,
      href: "/admin/manutencao",
    });
  }

  const upcomingEvents = await prisma.scheduleEvent.count({
    where: {
      startsAt: {
        gte: today,
        lt: new Date(today.getTime() + 86400000),
      },
      status: { not: "cancelado" },
    },
  });

  if (upcomingEvents > 0) {
    items.push({
      id: "inbox-agenda-today",
      title: "Agenda de hoje",
      message: `${upcomingEvents} evento(s) na operação.`,
      createdAtLabel: "Hoje",
      read: false,
      href: "/admin/agenda",
    });
  }

  const unread = items.filter((n) => !n.read);
  if (unread.length > 0) {
    return unread.slice(0, 8);
  }

  return getUnreadAdminInboxNotifications();
}
