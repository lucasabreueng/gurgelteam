import { getDataSourceMode } from "@/lib/data-source/mode";
import { getUnreadAdminInboxNotifications } from "@/lib/admin-notifications-mocks";
import type { AdminInboxNotification } from "@/lib/contracts/admin-inbox-notification";
import { NotificationsRepositoryHttp } from "@/repositories/notifications/NotificationsRepositoryHttp";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

export function createNotificationsService() {
  return {
    async getUnreadInbox(): Promise<AdminInboxNotification[]> {
      if (!isHttpMode()) {
        return getUnreadAdminInboxNotifications();
      }
      const data = await NotificationsRepositoryHttp.getInbox();
      return data.notifications;
    },
  };
}
