import type { AdminInboxNotification } from "@/lib/contracts/admin-inbox-notification";

export const ADMIN_INBOX_NOTIFICATIONS: AdminInboxNotification[] = [
  {
    id: "mock-delinq",
    title: "Títulos em atraso",
    message: "Há recebíveis vencidos aguardando cobrança.",
    createdAtLabel: "Hoje",
    read: false,
    href: "/admin/financeiro",
  },
  {
    id: "mock-maint",
    title: "Manutenção pendente",
    message: "Ordens de serviço abertas na oficina.",
    createdAtLabel: "Há 2 h",
    read: false,
    href: "/admin/manutencao",
  },
  {
    id: "mock-agenda",
    title: "Aulas de hoje",
    message: "Confira a agenda operacional do dia.",
    createdAtLabel: "Há 4 h",
    read: false,
    href: "/admin/agenda",
  },
  {
    id: "mock-read",
    title: "Meta de receita",
    message: "Resumo financeiro do mês atualizado.",
    createdAtLabel: "Ontem",
    read: true,
    href: "/admin/financeiro",
  },
];

export function getUnreadAdminInboxNotifications(): AdminInboxNotification[] {
  return ADMIN_INBOX_NOTIFICATIONS.filter((n) => !n.read);
}
