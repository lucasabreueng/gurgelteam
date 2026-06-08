import { NextRequest } from "next/server";

import { maintenanceInspectionTemplateRepository } from "@/lib/server/maintenance/maintenance-inspection-template";
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
    return jsonSuccess(maintenanceInspectionTemplateRepository.getTemplate());
  } catch (error) {
    console.error("[maintenance/inspections/template GET]", error);
    return jsonError(internalError());
  }
}
