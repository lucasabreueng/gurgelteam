import { NextRequest } from "next/server";

import { buildChecklistContext } from "@/lib/server/maintenance/build-checklist-context";
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
    const data = await buildChecklistContext();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[maintenance/checklists/context GET]", error);
    return jsonError(internalError());
  }
}
