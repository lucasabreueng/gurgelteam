import { NextRequest } from "next/server";

import { cashFlowPeriodQuerySchema } from "@/lib/contracts/api/v1/finance.api.schemas";
import { buildCashFlowDataset } from "@/lib/server/finance/cashflow-builder";
import {
  isNextResponse,
  parseSearchParams,
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

  const query = parseSearchParams(request, cashFlowPeriodQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await buildCashFlowDataset(query);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[finance/cash-flow GET]", error);
    return jsonError(internalError());
  }
}
