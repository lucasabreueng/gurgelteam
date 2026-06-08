import { NextRequest } from "next/server";

import { buildMaintenanceFleetFromDb } from "@/lib/server/maintenance/build-maintenance-fleet";
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
    const fleet = await buildMaintenanceFleetFromDb();
    return jsonSuccess(fleet);
  } catch (error) {
    console.error("[maintenance/fleet GET]", error);
    return jsonError(internalError());
  }
}
