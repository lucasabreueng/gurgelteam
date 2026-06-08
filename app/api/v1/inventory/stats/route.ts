import { NextRequest } from "next/server";

import { inventoryRepository } from "@/lib/server/inventory/inventory-repository";
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
    const data = await inventoryRepository.getStats();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[inventory/stats GET]", error);
    return jsonError(internalError());
  }
}
