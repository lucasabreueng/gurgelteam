import { NextRequest } from "next/server";

import { buildFinanceCharts } from "@/lib/server/finance/charts-builder";
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
    const data = await buildFinanceCharts();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[finance/charts GET]", error);
    return jsonError(internalError());
  }
}
