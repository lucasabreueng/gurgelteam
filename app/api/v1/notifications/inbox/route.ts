import { NextRequest } from "next/server";

import { listAdminInboxNotifications } from "@/lib/server/notifications/admin-inbox-repository";
import {
  isNextResponse,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "dashboard", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const all = await listAdminInboxNotifications();
    const notifications = all.filter((n) => !n.read);
    return jsonSuccess({
      notifications,
      unreadCount: notifications.length,
    });
  } catch (error) {
    console.error("[notifications/inbox GET]", error);
    return jsonError(internalError());
  }
}
