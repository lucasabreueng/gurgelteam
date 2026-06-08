import { NextRequest } from "next/server";

import { teamRepository } from "@/lib/server/team/team-repository";
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
  const auth = await requireModulePermission(request, "equipe", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const data = await teamRepository.getKpis();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[team/kpis GET]", error);
    return jsonError(internalError());
  }
}
