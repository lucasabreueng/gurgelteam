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
import { loadKartsPageData } from "@/lib/server/pages/load-karts-page";

export const dynamic = "force-dynamic";

/** GET /api/v1/karts/page-bundle — frota + KPIs em uma requisição. */
export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "karts", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const data = await loadKartsPageData();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[karts/page-bundle GET]", error);
    return jsonError(internalError());
  }
}
