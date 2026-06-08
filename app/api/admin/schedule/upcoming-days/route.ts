import type { NextRequest } from "next/server";

import { handleLegacyAdminScheduleUpcomingDays } from "@/lib/server/api/legacy-admin-schedule-handlers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return handleLegacyAdminScheduleUpcomingDays(request);
}
