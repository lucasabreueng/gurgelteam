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
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? "50");
    const data = await inventoryRepository.listHistory(
      Number.isFinite(limit) ? limit : 50,
    );
    return jsonSuccess(data);
  } catch (error) {
    console.error("[inventory/history GET]", error);
    return jsonError(internalError());
  }
}
