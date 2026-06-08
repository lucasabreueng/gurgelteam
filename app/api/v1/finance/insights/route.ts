import { NextRequest } from "next/server";

import { buildFinanceInsights } from "@/lib/server/finance/insights-builder";
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
  const auth = await requireModulePermission(request, "financeiro", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const data = await buildFinanceInsights();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[finance/insights GET]", error);
    return jsonError(internalError());
  }
}
