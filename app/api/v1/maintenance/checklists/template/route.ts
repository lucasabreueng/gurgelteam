import { NextRequest } from "next/server";

import { maintenanceChecklistRepository } from "@/lib/server/maintenance/maintenance-checklist-repository";
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
    return jsonSuccess(maintenanceChecklistRepository.getTemplate());
  } catch (error) {
    console.error("[maintenance/checklists/template GET]", error);
    return jsonError(internalError());
  }
}
