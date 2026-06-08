import { NextRequest } from "next/server";

import { recordPaymentSchema } from "@/lib/contracts/api/v1/finance.api.schemas";
import {
  isApiError,
  financeRepository,
} from "@/lib/server/finance/finance-repository";
import {
  isNextResponse,
  parseJsonBody,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "financeiro", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, recordPaymentSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await financeRepository.recordPayment(body, auth.user.id);
    return jsonSuccess(data, 201);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[finance/payments POST]", error);
    return jsonError(internalError());
  }
}
