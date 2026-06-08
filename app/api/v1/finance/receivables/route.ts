import { NextRequest } from "next/server";

import {
  createReceivableSchema,
  receivablesQuerySchema,
} from "@/lib/contracts/api/v1/finance.api.schemas";
import {
  financeRepository,
  isApiError,
} from "@/lib/server/finance/finance-repository";
import {
  isNextResponse,
  parseJsonBody,
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

  const query = parseSearchParams(request, receivablesQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await financeRepository.listReceivables(query);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[finance/receivables GET]", error);
    return jsonError(internalError());
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "financeiro", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, createReceivableSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await financeRepository.createReceivable(body);
    return jsonSuccess(data, 201);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[finance/receivables POST]", error);
    return jsonError(internalError());
  }
}
