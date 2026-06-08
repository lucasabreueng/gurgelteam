import { NextRequest } from "next/server";

import {
  isNextResponse,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";
import { loadClientsPageData } from "@/lib/server/pages/load-clients-page";

export const dynamic = "force-dynamic";

/** GET /api/v1/clients/page-bundle — lista + KPIs em uma requisição. */
export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "alunos", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const data = await loadClientsPageData();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[clients/page-bundle GET]", error);
    return jsonError(internalError());
  }
}
