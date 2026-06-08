import { NextRequest } from "next/server";

import { payablesQuerySchema } from "@/lib/contracts/api/v1/finance.api.schemas";
import { financeRepository } from "@/lib/server/finance/finance-repository";
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

  const query = parseSearchParams(request, payablesQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await financeRepository.listPayables(query);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[finance/payables GET]", error);
    return jsonError(internalError());
  }
}
