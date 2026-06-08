import type { NextRequest } from "next/server";

import { handleLegacyAdminScheduleEventById } from "@/lib/server/api/legacy-admin-schedule-handlers";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ eventId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { eventId } = await params;
  return handleLegacyAdminScheduleEventById(request, eventId);
}
