import { NextRequest } from "next/server";

import { maintenanceRepository } from "@/lib/server/maintenance/maintenance-repository";
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
  const auth = await requireModulePermission(request, "manutencao", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const data = await maintenanceRepository.getStats();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[maintenance/stats GET]", error);
    return jsonError(internalError());
  }
}
