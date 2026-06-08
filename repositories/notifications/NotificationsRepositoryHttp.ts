import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type { AdminInboxNotificationsResponseDTO } from "@/lib/contracts/api/v1/notifications.api.schemas";

export const NotificationsRepositoryHttp = {
  async getInbox(): Promise<AdminInboxNotificationsResponseDTO> {
    const res = await apiFetch<AdminInboxNotificationsResponseDTO>(
      v1ApiPaths.notifications.inbox,
    );
    return unwrapApiResponse(res);
  },
};
