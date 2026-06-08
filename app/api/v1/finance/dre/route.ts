import { NextRequest } from "next/server";

import { drePeriodQuerySchema } from "@/lib/contracts/api/v1/finance.api.schemas";
import { buildDreDataset } from "@/lib/server/finance/dre-builder";
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

  const query = parseSearchParams(request, drePeriodQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await buildDreDataset(query);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[finance/dre GET]", error);
    return jsonError(internalError());
  }
}
