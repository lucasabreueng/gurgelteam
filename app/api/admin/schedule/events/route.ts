import type { NextRequest } from "next/server";

import { handleLegacyAdminScheduleEvents } from "@/lib/server/api/legacy-admin-schedule-handlers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return handleLegacyAdminScheduleEvents(request);
}
