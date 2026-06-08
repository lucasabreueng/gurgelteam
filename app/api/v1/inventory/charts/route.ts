import { NextRequest } from "next/server";

import { buildInventoryCharts } from "@/lib/server/inventory/charts-builder";
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
  const auth = await requireModulePermission(request, "estoque", "view");
  if (isNextResponse(auth)) return auth;

  try {
    return jsonSuccess(await buildInventoryCharts());
  } catch (error) {
    console.error("[inventory/charts GET]", error);
    return jsonError(internalError());
  }
}
