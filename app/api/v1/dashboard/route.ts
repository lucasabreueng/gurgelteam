import { NextRequest } from "next/server";

import { dashboardRepository } from "@/lib/server/dashboard/dashboard-repository";
import {
  isNextResponse,
  requireAnyAdminModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAnyAdminModulePermission(request, "view");
  if (isNextResponse(auth)) return auth;

  try {
    const data = await dashboardRepository.getSummary();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[dashboard GET]", error);
    return jsonError(internalError());
  }
}
